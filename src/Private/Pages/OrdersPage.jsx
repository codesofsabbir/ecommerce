import { CheckCircle, Clock, DollarSign, ShoppingBag, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";


import StatCard from "../components/common/StatCard";
import DailyOrders from "../components/orders/DailyOrders";
import OrderDistribution from "../components/orders/OrderDistribution";
import OrdersTable from "../components/orders/OrdersTable";
import { Helmet } from "react-helmet";
import ReactDOMServer from "react-dom/server";
import Header from "../Components/Common/Header";
import useAxios from "../../Hooks/useAxios";
const svgIcon = encodeURIComponent(
	ReactDOMServer.renderToStaticMarkup(<ShoppingCart stroke="#F59E0B" />)
  );
const svgFavicon = `data:image/svg+xml,${svgIcon}`;
const orderStats = {
	totalOrders: "1,234",
	pendingOrders: "56",
	completedOrders: "1,178",
	totalRevenue: "$98,765",
};

const OrdersPage = () => {
	const {data: orderData = [], loading, error} = useAxios('http://localhost:5001/trackOrder')
	if(loading) return <p>Loading...</p>
	if(error) return <p>{error}</p>
	return (
		<div className='flex-1 relative z-10 overflow-auto'>
			<Helmet>
				<link rel="icon" type="image/svg+xml" href={svgFavicon} />
				<title>Orders</title>
			</Helmet>
			<Header title={"Orders"} />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Orders' icon={ShoppingBag} value={orderStats.totalOrders} color='#6366F1' />
					<StatCard name='Pending Orders' icon={Clock} value={orderStats.pendingOrders} color='#F59E0B' />
					<StatCard
						name='Completed Orders'
						icon={CheckCircle}
						value={orderStats.completedOrders}
						color='#10B981'
					/>
					<StatCard name='Total Revenue' icon={DollarSign} value={orderStats.totalRevenue} color='#EF4444' />
				</motion.div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					<DailyOrders />
					<OrderDistribution />
				</div>

				<OrdersTable orderData={orderData}/>
			</main>
		</div>
	);
};
export default OrdersPage;
