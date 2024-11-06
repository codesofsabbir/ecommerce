import { useContext, useEffect, useState } from "react";
import { Facebook, Instagram, Linkedin, Twitter, Headset, Search, Camera, Bell, ShoppingCart, User } from 'lucide-react';
import { UserContext } from "../../../Hooks/UserContext";
import HelpLineOnClick from "./HelpLineOnClick";
import { useNavigate } from "react-router-dom";
import UserLoginButton from "./UserLoginButton";
import UserNavItem from "./UserNavItem";
import Badge from '@mui/material/Badge';
function Header() {
    const { userLogedIn, loginUser, headerData, setHeaderData } = useContext(UserContext);
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
                        <Facebook size={18} color="#007BFF" className="hover:text-[#0056b3] cursor-pointer"/>
                        <Instagram size={18} color="#007BFF" className="hover:text-[#0056b3] cursor-pointer"/>
                        <Linkedin size={18} color="#007BFF" className="hover:text-[#0056b3] cursor-pointer"/>
                        <Twitter size={18} color="#007BFF" className="hover:text-[#0056b3] cursor-pointer"/>
                    </div>
                    <h3>{headerData?.deliveryOffer}</h3>
                    <div className="flex gap-2 items-center text-sm">
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
                        <div className="logo w-24">
                            <img src={headerData?.logo} alt="Logo" onClick={() => navigate('/')} className="cursor-pointer" />
                        </div>
                        <div className="relative">
                            <Headset size={30} className="cursor-pointer" onClick={() => setHelpLineBoxOpen(!helpLineBoxOpen)} />
                            {helpLineBoxOpen && <HelpLineOnClick handleHelpLineClose={handleHelpLineClose} />}
                        </div>
                    </div>
                    <div className="search flex relative w-full mx-10">
                        <input
                            type="text"
                            placeholder="Search by keyword/product name/brands..."
                            className="border border-black py-1 px-2 rounded-md outline-none w-full text-md"
                        />
                        <div className="searchIcon flex gap-2 absolute right-3 top-1/2 -translate-y-1/2">
                            <Camera className="cursor-pointer" />
                            <Search className="cursor-pointer" />
                        </div>
                    </div>
                    <div className="icons flex gap-5 items-center">
                        <Bell className="cursor-pointer" />
                        
                        {userLogedIn && 
                            <Badge badgeContent={5} color="primary">
                                <ShoppingCart className="cursor-pointer" onClick={()=>{navigate('addtocard')}}/>
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
                                        <User />
                                    )
                                ) : (
                                    <User />
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
