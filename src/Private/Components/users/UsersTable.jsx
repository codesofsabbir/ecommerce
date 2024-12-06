/* eslint-disable react/prop-types */
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { allDivision, districtsOf, upazilasOf } from '@bangladeshi/bangladesh-address';
const UsersTable = ({userData}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredUser, setFilteredUser] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedActiveStatus, setSelectedActiveStatus] = useState("");
	const [address, setAddress] = useState({
        division: "", 
        district: "",
        upazila: ""
    });
	const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress((prev) => {
			const resetDependentFields = {};
			if (name === "division") {
				resetDependentFields.district = "";
				resetDependentFields.upazila = "";
			} else if (name === "district") {
				resetDependentFields.upazila = "";
			}
			return {
				...prev,
				[name]: value,
				...resetDependentFields, // Apply the resets
			};
		});
    };

	const rowsPerPage = 5;
	useEffect(() => {
		const results = userData.filter((user) => {
			const searchTermMatch = searchTerm
				? user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				  user.userPhone?.toLowerCase().includes(searchTerm.toLowerCase())
				: true;
	
			const activeStatusMatch = selectedActiveStatus
				? (selectedActiveStatus === "active" && user.activeStatus) ||
				  (selectedActiveStatus === "deactive" && !user.activeStatus)
				: true;
	
			const addressMatch =
				(address.division ? user.division === address.division : true) &&
				(address.district ? user.district === address.district : true) &&
				(address.upazila ? user.upazila === address.upazila : true);
	
			return searchTermMatch && activeStatusMatch && addressMatch;
		});
	
		setFilteredUser(results);
		setCurrentPage(1);
	}, [userData, searchTerm, selectedActiveStatus, address]);
	
	

	const totalRows = filteredUser.length;
	const totalPages = Math.ceil(totalRows / rowsPerPage);
	const startIndex = (currentPage - 1) * rowsPerPage;
	const endIndex = startIndex + rowsPerPage;
	const paginatedUser = filteredUser.slice(startIndex, endIndex);
	const getPaginationNumbers = () => {
		const numbers = [];
		for (let i = 1; i <= totalPages; i++) {
			if (i === 1 || i === totalPages || Math.abs(currentPage - i) <= 1) {
				numbers.push(i);
			} else if (numbers[numbers.length - 1] !== "...") {
				numbers.push("...");
			}
		}
		return numbers;
	};

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	const handleActiveStatusChange = (e) => {
		const selected = e.target.value
		setSelectedActiveStatus(selected.toLowerCase());
	}
	return (
		<motion.div
			className='dark:bg-gray-800 bg-white bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold dark:text-gray-100 text-[#1E1E1E]'>Users</h2>
				<div className='relative'>
					<input
						type='text'
						placeholder='Search users...'
						className='dark:bg-gray-700 bg-gray-400 dark:text-white text-[#1E1E1E] dark:placeholder-gray-400 placeholder:text-gray-600 outline-none rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						onChange={(e) => setSearchTerm(e.target.value)}
						value={searchTerm}
					/>
					<Search className='absolute left-3 top-2.5 dark:text-gray-400 text-[#1E1E1E]' size={18} />
				</div>
			</div>
			<div className='flex justify-center gap-5 items-center mb-6'>
				<select
					name="Category"
					id="category"
					className="bg-gray-700 py-2 pl-3 rounded-md"
					value={selectedActiveStatus}
					onChange={handleActiveStatusChange}
				>
					<option value="">
						Select Active Status
					</option>
					<option value="active">
						Active User
					</option>
					<option value="deactive">
						Deactive User
					</option>
				</select>
				<select
					name="division"
					id="division"
					className="bg-gray-700 py-2 pl-3 rounded-md"
					onChange={handleChange}
					value={address.division} // Fixed this to match the state key
				>
					<option value="">Select Division</option>
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
					value={address.division === "" ? "" : address.district}
				>
					<option value="">Select District</option>
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
					value={address.district === "" ? "" : address.upazila}
				>
					<option value="">Select Upazila</option>
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
							<th className='px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-[#1E1E1E] uppercase tracking-wider'>
								Name
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-[#1E1E1E] uppercase tracking-wider'>
								Phone
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-[#1E1E1E] uppercase tracking-wider'>
								Address
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-[#1E1E1E] uppercase tracking-wider'>
								Status
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-[#1E1E1E] uppercase tracking-wider'>
								Actions
							</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-700'>
						{paginatedUser.map((user) => (
							<motion.tr
								key={user.id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='flex items-center'>
										<div className='flex-shrink-0 h-10 w-10'>
											<div className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center dark:text-white text-[#1E1E1E] font-semibold overflow-hidden'>
												{user?.userProfilePic ? <img src={user.userProfilePic} alt="" /> : user?.userName.charAt(0)}
											</div>
										</div>
										<div className='ml-4'>
											<div className='text-sm font-medium dark:text-gray-100 text-[#1E1E1E]'>{user?.userName}</div>
										</div>
									</div>
								</td>

								<td className='px-6 py-4 whitespace-nowrap'>
									<span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full dark:text-blue-100 text-[#1E1E1E]'>
										{user.userPhone}
									</span>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full dark:text-blue-100 text-[#1E1E1E]'>
										{user.division}, {user.district}, {user.upazila}
									</span>
								</td>

								<td className='px-6 py-4 whitespace-nowrap'>
									<span
										className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
											user.activeStatus === true
											? "bg-green-800 dark:text-green-100"
											: "bg-red-800 dark:text-red-100"
										}`}
										>
										{user.activeStatus ? 'Active': 'Deactive'}
									</span>
								</td>

								<td className='px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300'>
									<button className='text-indigo-400 hover:text-indigo-300 mr-2'>Banned</button>
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
							{getPaginationNumbers().map((number, index) =>
    number === "..." ? (
        <span key={`ellipsis-${index}`} className="px-3 py-1 select-none">
            ...
        </span>
    ) : (
        <button
            key={number}
            className={`px-3 py-1 ${
                currentPage === number
                    ? "bg-gray-600 text-white"
                    : "hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            onClick={() => handlePageChange(number)}
        >
            {number}
        </button>
    )
)}
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
	)
};
export default UsersTable;
