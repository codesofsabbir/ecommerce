/* eslint-disable react/prop-types */

import { useContext } from "react";
import { CiShoppingCart } from "react-icons/ci";
import { IoSearchOutline, IoCamera } from "react-icons/io5";
import { UserContext } from "../../../Hooks/UserContext";
import { useNavigate } from "react-router-dom";
import Badge from '@mui/material/Badge';
import HelpIconMenu from './header_component/HelpIconMenu';
import UserMenu from './header_component/UserMenu';
function BottomHeader({headerData}) {
    const { userLogedIn, cartProductQuantity } = useContext(UserContext);
    const navigate = useNavigate();
    return (
        <div className="w-full bg-[#FFFFFF]">
            <div className="w-[90%] mx-auto flex h-20 gap-5 items-center justify-between text-[#1E90FF]">
                {/* Bottom Menu Right site logo and help center icon */}
                <div className="flex gap-5 items-center">
                    <div className="logo ">
                        {/* <img
                            loading="lazy"
                            alt="logo"
                            srcSet="
                                /?width=100 100w,
                                /?width=200 200w,
                                /?width=400 400w,
                                /?width=800 800w,
                            "
                            sizes="(max-width: 800px) 100vw, 50vw" 
                            decoding="async"
                            fetchPriority="high"
                            src={headerData?.logo} 
                            width="130" 
                            height="20" 
                            onClick={() => navigate('/')} className="cursor-pointer" 
                            /> */}
                            <img width="130" height="20" src={headerData?.logo} alt="" onClick={() => navigate('/')} className="cursor-pointer"/>
                    </div>
                    <div className="relative">
                        <HelpIconMenu />
                    </div>
                </div>

                {/* Bottom menu center search bar and icons */}
                <div className="search md:flex relative w-full mx-10 hidden">
                    <input
                        type="text"
                        placeholder="Search by keyword/product name/brands..."
                        className="border border-black py-1 px-2 rounded-md outline-none w-full text-md"
                    />
                    <div className="searchIcon flex gap-2 absolute right-3 top-1/2 -translate-y-1/2">
                        <IoCamera className="cursor-pointer text-xl hidden" />
                        <IoSearchOutline className="cursor-pointer text-xl" />
                    </div>
                </div>

                {/* Bottom Menu left site shopping icon and user avator */}
                <div className="icons flex gap-5 items-center">
                    {userLogedIn && (
                        <Badge badgeContent={cartProductQuantity} color="primary">
                            <CiShoppingCart className="cursor-pointer text-3xl" onClick={() => navigate('addtocard')} />
                        </Badge>
                    )}
                    <div className="relative">
                        <UserMenu />
                    </div>
                </div>
            </div>
        </div>
  )
}

export default BottomHeader