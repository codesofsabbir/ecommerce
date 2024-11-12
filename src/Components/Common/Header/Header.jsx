import { useContext, useEffect, useState } from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { PiHeadsetFill } from "react-icons/pi";
import { CiShoppingCart } from "react-icons/ci";
import { IoSearchOutline, IoCamera } from "react-icons/io5";
import { UserContext } from "../../../Hooks/UserContext";
import { useNavigate } from "react-router-dom";
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';

function Header() {
    const { userLogedIn, setUserLogedIn, loginUser, headerData, setHeaderData, cartProductQuantity } = useContext(UserContext);
    const navigate = useNavigate();
    const [userAnchorEl, setUserAnchorEl] = useState(null);
    const [helpAnchorEl, setHelpAnchorEl] = useState(null);

    const handleHelpLineOpen = (event) => {
        setHelpAnchorEl(event.currentTarget);
    }

    const handleHelpLineClose = () => {
        setHelpAnchorEl(null)
    };

    const handleUserMenuOpen = (event) => {
        setUserAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setUserAnchorEl(null);
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
                    <div className="flex gap-2 items-center">
                        <select className="bg-transparent text-xs p-1 rounded-md">
                            {headerData?.currencyMenu?.options?.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                        <select className="bg-transparent text-xs p-1 rounded-md">
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
                            <PiHeadsetFill 
                                onClick={handleHelpLineOpen}
                                className="cursor-pointer text-3xl"
                            />

                            <Menu
                                anchorEl={helpAnchorEl}
                                open={Boolean(helpAnchorEl)}
                                onClose={handleHelpLineClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                className="mt-5"
                            >
                                <MenuItem >+880 1303 142498</MenuItem>
                                <MenuItem onClick={() => navigate('/help-center')}>Help Center</MenuItem>
                                
                            </Menu>
                        </div>
                    </div>
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
                    <div className="icons flex gap-5 items-center">
                        {userLogedIn && (
                            <Badge badgeContent={cartProductQuantity} color="primary">
                                <CiShoppingCart className="cursor-pointer text-3xl" onClick={() => navigate('addtocard')} />
                            </Badge>
                        )}
                        <div className="relative">
                            <Avatar 
                                src={userLogedIn && loginUser?.userProfilePic}
                                alt="User Profile" 
                                onClick={handleUserMenuOpen} 
                                className="cursor-pointer"
                            />
                            {
                                userLogedIn ? 
                                (
                                    <Menu
                                        anchorEl={userAnchorEl}
                                        open={Boolean(userAnchorEl)}
                                        onClose={handleUserMenuClose}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        className="mt-5"
                                    >
                                        <MenuItem onClick={() => navigate('/user-profile')}>Profile</MenuItem>
                                        <MenuItem onClick={() => navigate('/track-order')}>My Order</MenuItem>
                                        <Divider />
                                        <MenuItem onClick={() => {
                                            // Logout function
                                            handleUserMenuClose()
                                            setUserLogedIn(false)
                                            navigate('/')
                                        }}>Logout</MenuItem>
                                    </Menu>
                                ) 
                                : 
                                ( 
                                    <Menu
                                        anchorEl={userAnchorEl}
                                        open={Boolean(userAnchorEl)}
                                        onClose={handleUserMenuClose}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        className="mt-5"
                                    >
                                        <MenuItem onClick={() => navigate('/login')}>Log In</MenuItem>
                                        <MenuItem onClick={() => navigate('/sign-up')}>Sign Up</MenuItem>
                                    </Menu>
                                )
                            }
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
