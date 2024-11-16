import TopHeader from "./TopHeader";
import BottomHeader from "./BottomHeader";
import useAxios from "../../../Hooks/useAxios";
import { useContext, useEffect } from "react";
import { UserContext } from "../../../Hooks/UserContext";
import { Outlet } from "react-router-dom";

function Header() {
    const {headerData, setHeaderData} = useContext(UserContext)
    const { data, error, loading } = useAxios('http://localhost:5001/header');
    useEffect(()=>{
        if(data) {
            setHeaderData(data);
        }
    })
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading data: {error.message}</p>;
    return (
        <>
            <div>
                <TopHeader headerData={headerData} />
                <BottomHeader headerData={headerData}/>
            </div>
            <Outlet />
        </>
    );
}

export default Header;
