import TopHeader from "./TopHeader";
import BottomHeader from "./BottomHeader";
import useAxios from "../../../Hooks/useAxios";

function Header() {
    const { data: headerData, error, loading } = useAxios('http://localhost:5001/header');
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading data: {error.message}</p>;
    return (
        <div>
            <TopHeader headerData={headerData} />
            <BottomHeader headerData={headerData}/>
        </div>
    );
}

export default Header;
