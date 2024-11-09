import { useContext, useEffect, useState } from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaUser } from "react-icons/fa";
import { PiHeadsetFill } from "react-icons/pi";
import { CiShoppingCart } from "react-icons/ci";
import { IoSearchOutline, IoCamera } from "react-icons/io5";
import { UserContext } from "../../../Hooks/UserContext";
import HelpLineOnClick from "./HelpLineOnClick";
import { useNavigate } from "react-router-dom";
import UserLoginButton from "./UserLoginButton";
import UserNavItem from "./UserNavItem";
import Badge from '@mui/material/Badge';
function Header() {
    const { userLogedIn, loginUser, headerData, setHeaderData, cartProductQuantity } = useContext(UserContext);
    const navigate = useNavigate();
    const [helpLineBoxOpen, setHelpLineBoxOpen] = useState(false);
    const [userLoginBox, setUserLoginBox] = useState(false);

    const handleHelpLineClose = (isOpen) => {
        setHelpLineBoxOpen(isOpen);
    };

    const handleUserLoginBox = (isOpen) => {
        setUserLoginBox(isOpen);
    };
    useEffect(() => {
        fetch('http://localhost:5001/header')
            .then((res) => res.json())
            .then((data) => setHeaderData(data))
            .catch((error) => console.error('Error fetching header data:', error));
    }, [setHeaderData]);

    return (
        <div>
            <div className="w-full bg-[#F2F2F2]">
                <div className="w-[90%] mx-auto flex justify-between items-center h-10 text-[#4A4A4A] uppercase">
                    <div className="icons flex gap-2">
                        <FaFacebookF className="cursor-pointer text-[#007BFF] hover:text-[#0056b3] text-xs md:text-lg" />
                        <FaInstagram className="cursor-pointer text-[#007BFF] hover:text-[#0056b3] text-xs md:text-lg" />
                        <FaLinkedinIn className="cursor-pointer text-[#007BFF] hover:text-[#0056b3] text-xs md:text-lg" />
                        <FaTwitter className="cursor-pointer text-[#007BFF] hover:text-[#0056b3] text-xs md:text-lg" />
                    </div>
                    <h3 className="hidden md:inline">{headerData?.deliveryOffer}</h3>
                    <div className="flex gap-2 items-center text-xs md:text-sm">
                        <select className="bg-transparent">
                            {headerData?.currencyMenu?.options?.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                        <select className="bg-transparent">
                            {headerData?.languageMenu?.options?.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className="w-full bg-[#FFFFFF]">
                <div className="w-[90%] mx-auto flex h-20 gap-5 items-center justify-between text-[#1E90FF]">
                    <div className="flex gap-5 items-center">
                        <div className="logo w-16 md:w-24 ">
                            <img src={headerData?.logo} alt="Logo" onClick={() => navigate('/')} className="cursor-pointer " />
                        </div>
                        <div className="relative">
                            <PiHeadsetFill className="cursor-pointer text-3xl" onClick={() => setHelpLineBoxOpen(!helpLineBoxOpen)} />
                            {helpLineBoxOpen && <HelpLineOnClick handleHelpLineClose={handleHelpLineClose} />}
                        </div>
                    </div>
                    <div className="search md:flex relative w-full mx-10 hidden ">
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
                    <div className="icons flex gap-5 items-center">
                        
                        {userLogedIn && 
                            <Badge badgeContent={cartProductQuantity} color="primary">
                                <CiShoppingCart className="cursor-pointer text-3xl" onClick={()=>{navigate('addtocard')}}/>
                            </Badge>
                        }
                        <div className="relative">
                            <i className="cursor-pointer" onClick={() => setUserLoginBox(!userLoginBox)}>
                                {userLogedIn ? (
                                    loginUser?.userProfilePic ? (
                                        <div className="h-8 w-8 bg-[#0a66c2] rounded-full overflow-hidden">
                                            <img src={loginUser.userProfilePic} alt="User Profile" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <FaUser />
                                    )
                                ) : (
                                    <FaUser />
                                )}
                            </i>
                            {userLoginBox && (
                                userLogedIn ? (
                                    <UserNavItem handleUserLoginBox={handleUserLoginBox} />
                                ) : (
                                    <UserLoginButton handleUserLoginBox={handleUserLoginBox} />
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
