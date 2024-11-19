import Header from "../components/common/Header";
import { TrendingUp } from "lucide-react";
import OverviewCards from "../components/analytics/OverviewCards";
import RevenueChart from "../components/analytics/RevenueChart";
import ChannelPerformance from "../components/analytics/ChannelPerformance";
import ProductPerformance from "../components/analytics/ProductPerformance";
import UserRetention from "../components/analytics/UserRetention";
import CustomerSegmentation from "../components/analytics/CustomerSegmentation";
import AIPoweredInsights from "../components/analytics/AIPoweredInsights";
import { Helmet } from "react-helmet";
import ReactDOMServer from "react-dom/server";
const svgIcon = encodeURIComponent(
	ReactDOMServer.renderToStaticMarkup(<TrendingUp stroke="#3B82F6" />)
  );
const svgFavicon = `data:image/svg+xml,${svgIcon}`;
const AnalyticsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Helmet>
				<link rel="icon" type="image/svg+xml" href={svgFavicon} />
				<title>Analytics</title>
			</Helmet>
			<Header title={"Analytics Dashboard"} />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<OverviewCards />
				<RevenueChart />

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					<ChannelPerformance />
					<ProductPerformance />
					<UserRetention />
					<CustomerSegmentation />
				</div>

				<AIPoweredInsights />
			</main>
		</div>
	);
};
export default AnalyticsPage;