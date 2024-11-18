
import { motion } from "framer-motion";
import { Search, Eye, X } from "lucide-react";
import useAxios from "../../../Hooks/useAxios";

const OrdersTable = () => {
	const {data: orderData = [], loading, error} = useAxios('http://localhost:5001/trackOrder')



	
	if(loading) return <p>Loading...</p>
	if(error) return <p>{error}</p>
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
					/>
					<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
				</div>
			</div>

			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-[#1E1E1E] uppercase tracking-wider'>
								Order ID
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-[#1E1E1E] uppercase tracking-wider'>
								Customer
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-[#1E1E1E] uppercase tracking-wider'>
								Phone
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-[#1E1E1E] uppercase tracking-wider'>
								Address
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-[#1E1E1E] uppercase tracking-wider'>
								Total
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-[#1E1E1E] uppercase tracking-wider'>
								Status
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-[#1E1E1E] uppercase tracking-wider'>
								Date
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-[#1E1E1E] uppercase tracking-wider'>
								Actions
							</th>
						</tr>
					</thead>

					<tbody className='divide divide-gray-700'>
						{orderData.map((order) => (
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
									{order?.address}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-gray-100 text-[#1E1E1E]'>
									${order?.totalAmount}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									{order?.orderTracker[order?.orderStage].name}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300 text-[#1E1E1E]'>{order.orderDate	}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									<button className='text-indigo-400 hover:text-indigo-300 mr-2'>
										<Eye size={18} />
									</button>
									<button className='text-red-400 hover:text-red-300 mr-2'>
										<X size={18} />
									</button>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
		</motion.div>
	);
};
export default OrdersTable;
