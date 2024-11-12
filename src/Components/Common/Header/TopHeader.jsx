/* eslint-disable react/prop-types */

import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
function TopHeader({headerData}) {
  return (

    // top Header contant 
    <div className="w-full bg-[#F2F2F2]">
        <div className="w-[90%] mx-auto flex justify-between items-center h-10 text-[#4A4A4A] uppercase">

            {/* social media icons */}
            <div className="icons flex gap-2">
                <FaFacebookF className="cursor-pointer text-[#007BFF] hover:text-[#0056b3] text-xs md:text-lg" />
                <FaInstagram className="cursor-pointer text-[#007BFF] hover:text-[#0056b3] text-xs md:text-lg" />
                <FaLinkedinIn className="cursor-pointer text-[#007BFF] hover:text-[#0056b3] text-xs md:text-lg" />
                <FaTwitter className="cursor-pointer text-[#007BFF] hover:text-[#0056b3] text-xs md:text-lg" />
            </div>

            <h3 className="hidden md:inline">{headerData?.offer}</h3>

            {/* Language and Currency Select Option  */}
            <div className="flex gap-2 items-center">
                <select className="bg-transparent text-xs p-1 rounded-md">
                    {headerData?.languageMenu?.options?.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                    ))}
                </select>
                <select className="bg-transparent text-xs p-1 rounded-md">
                    {headerData?.currencyMenu?.options?.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                    ))}
                </select>
            </div>
        </div>
    </div>
    
  )
}

export default TopHeader