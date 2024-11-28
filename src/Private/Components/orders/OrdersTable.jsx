/* eslint-disable react/prop-types */

import { motion } from "framer-motion";
import { Search, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { allDivision, districtsOf, upazilasOf } from '@bangladeshi/bangladesh-address';
const OrdersTable = ({orderData}) => {
	
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredOrder, setFilteredOrder] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedDeliveryStatus, setSelectedDeliveryStatus] = useState("");
	const rowsPerPage = 10;
	const [address, setAddress] = useState({
        division: "", 
        district: "",
        upazila: ""
    });
	const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress((prev)=>({
            ...prev,
            [name]: value
        }))
    };
	useEffect(() => {
		const results = orderData.filter((order) => {
		  const lowerSearchTerm = searchTerm.toLowerCase();
		  const userName = order.userName?.toLowerCase() || "";
		  const phone = order.phone?.toLowerCase() || "";
		  return userName.includes(lowerSearchTerm) || phone.includes(lowerSearchTerm);
		});
	
		// Filter by address selection
		const filteredByAddress = results.filter((order) => {
		  const matchesDivision = address.division ? order.division === address.division : true;
		  const matchesDistrict = address.district ? order.district === address.district : true;
		  const matchesUpazila = address.upazila ? order.upazila === address.upazila : true;
		  return matchesDivision && matchesDistrict && matchesUpazila;
		});
	
		// Filter by delivery status
		const filteredByStatus = filteredByAddress.filter((order) => {
		  return selectedDeliveryStatus ? order.orderTracker[order.orderStage].name.toLowerCase() === selectedDeliveryStatus : true;
		});
	
		setFilteredOrder(filteredByStatus);
		setCurrentPage(1);  // Reset to the first page on filter change
	  }, [orderData, searchTerm, address, selectedDeliveryStatus]);

	const totalRows = filteredOrder.length;
	const totalPages = Math.ceil(totalRows / rowsPerPage);
	const startIndex = (currentPage - 1) * rowsPerPage;
	const endIndex = startIndex + rowsPerPage;
	const paginatedOrder = filteredOrder.slice(startIndex, endIndex);
	const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	  };

	  const handleDeliveryStatusChange = (e) => {
		const selected = e.target.value
		setSelectedDeliveryStatus(selected.toLowerCase());
	  }
	
	
	return (
		<motion.div
			className='dark:bg-gray-800 bg-white bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold dark:text-gray-100 text-[#1E1E1E]'>Order List</h2>
				<div className='relative'>
					<input
						type='text'
						placeholder='Search orders...'
						className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 outline-none'
						onChange={(e) => setSearchTerm(e.target.value)}
						value={searchTerm}
					/>
					<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
				</div>
			</div>
			<div className='flex justify-center gap-5 items-center mb-6'>
				<select
					name="Category"
					id="category"
					className="bg-gray-700 py-2 pl-3 rounded-md"
					value={selectedDeliveryStatus}
					onChange={handleDeliveryStatusChange}
				>
					<option value="" disabled>
						Select Order Status
					</option>
					{orderData[0]?.orderTracker?.map(orderStage=>(
					<option key={orderStage.name}>
						{orderStage.name}
					</option>
						
					))}
					
				</select>
				<select
					name="division"
					id="division"
					className="bg-gray-700 py-2 pl-3 rounded-md"
					onChange={handleChange}
					value={address.division} // Fixed this to match the state key
				>
					<option value="" disabled>Select Division</option>
					{allDivision().map((division) => (
						<option key={division} value={division}>
							{division}
						</option>
					))}
				</select>
				<select
					name="district"
					id="district"
					className="bg-gray-700 py-2 pl-3 rounded-md"
					disabled={!address.division}
					onChange={handleChange}
					value={address.district}
				>
					<option value="" disabled>Select District</option>
					{address.division &&
						districtsOf(address.division).map((district) => (
							<option key={district} value={district}>
								{district}
							</option>
						))}
				</select>

				{/* Upazila Dropdown */}
				<select
					name="upazila"
					id="upazila"
					className="bg-gray-700 py-2 pl-3 rounded-md"
					disabled={!address.district}
					onChange={handleChange}
					value={address.upazila}
				>
					<option value="" disabled>Select Upazila</option>
					{address.district &&
						upazilasOf(address.district).map((upazilaObj) => (
							<option key={upazilaObj.upazila} value={upazilaObj.upazila}>
								{upazilaObj.upazila}
							</option>
						))}
				</select>
			
			</div>
			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
							{["Order ID", "Customer", "Phone", "Address", "Total", "Status", "Date", "Actions"].map(
								(header) => (
										<th
											key={header}
											className="px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-[#1E1E1E] uppercase tracking-wider"
										>
											{header}
										</th>
									)
								)
							}
						</tr>
					</thead>

					<tbody className='divide divide-gray-700'>
						{paginatedOrder.map((order) => (
							<motion.tr
								key={order.id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-gray-100 text-[#1E1E1E]'>
									{order.orderId}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-gray-100 text-[#1E1E1E]'>
									{order.userName}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-gray-100 text-[#1E1E1E]'>
									{order.phone}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-gray-100 text-[#1E1E1E]'>
									{order?.division}, {order?.district}, {order?.upazila}, {order?.code}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-gray-100 text-[#1E1E1E]'>
									{order?.totalAmount}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									{order?.orderTracker[order?.orderStage].name}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300 text-[#1E1E1E]'>{order.orderDate	}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									<button className='text-indigo-400 hover:text-indigo-300 mr-2'>
										<Eye size={18} />
									</button>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="flex justify-between items-center mt-4">
						<span>Showing {startIndex + 1}-{Math.min(endIndex, totalRows)} of {totalRows}</span>
						<div className="border border-gray-500 rounded-md">
							<button
								className={`px-3 py-1 ${
									currentPage === 1
									? "cursor-not-allowed opacity-50"
									: "hover:bg-gray-200 dark:hover:bg-gray-600"
								}`}
								onClick={() => handlePageChange(currentPage - 1)}
								disabled={currentPage === 1}
							>
								Previous
							</button>
							{pageNumbers.map((number, index) => {
								const isFirstFew = index < 3;
								const isLastFew = index >= totalPages - 3;
								const isNearCurrent = Math.abs(currentPage - number) <= 1;

								if (isFirstFew || isLastFew || isNearCurrent) {
									return (
										<button
											key={number}
											className={`px-3 py-1 border-l border-gray-500 ${
												currentPage === number
													? "bg-gray-600 text-white"
													: "hover:bg-gray-200 dark:hover:bg-gray-600"
											}`}
											onClick={() => handlePageChange(number)}
										>
											{number}
										</button>
									);
								}

								if (
									(index === 3 && !isNearCurrent && currentPage > 3) ||
									(index === totalPages - 4 && !isNearCurrent && currentPage < totalPages - 3)
								) {
									return (
										<span
											key={`ellipsis-${index}`}
											className="px-3 py-1 border-l border-gray-500 select-none"
										>
											...
										</span>
									);
								}

								return null;
							})}
							<button
								className={`px-3 py-1 border-l border-gray-500  ${
									currentPage === totalPages
									? "cursor-not-allowed opacity-50"
									: "hover:bg-gray-200 dark:hover:bg-gray-600"
								}`}
								onClick={() => handlePageChange(currentPage + 1)}
								disabled={currentPage === totalPages}
							>
								Next
							</button>
						</div>
			</div>
		</motion.div>
	);
};
export default OrdersTable;
