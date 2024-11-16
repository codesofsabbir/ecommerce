import { useContext } from "react"
import { UserContext } from "../../../Hooks/UserContext"
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaPhoneAlt, } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import useAxios from "../../../Hooks/useAxios";

function Footer() {
    const {headerData} = useContext(UserContext);
    const {data: pages = []} = useAxios("http://localhost:5001/pages");
    const {data: categoryData = []} = useAxios("http://localhost:5001/categories")
  return (
    <div className="w-full h-fit bg-[#212121] relative">
        <div className="w-[90%] mx-auto">

            {/* footer Brand directory or subcategories */}
            <div className="py-10 border-b border-[#515151] hidden md:block">
                <h2 className="text-white text-xl uppercase pb-5 font-bold">Brand Directory</h2>
                {
                    categoryData?.map(category=>(
                        <div key={category.id} className="flex pb-[10px]">
                            <h3 className="uppercase flex text-[#999999] font-semibold"><span className="w-40">{category.name}</span><span>:</span></h3>
                            <div className="flex pl-5">
                                {
                                    category?.subcategories?.map((subcategory)=>(
                                        <div key={subcategory.id} className="flex text-[#515151]">
                                            <h5 className="px-1 cursor-pointer mx-2 hover:underline">{subcategory.name}</h5>
                                            <span>|</span>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* footer bottom section */}
            <div className="flex flex-col md:flex-row gap-8 py-20">

                {/* footer logo */}
                <div className="w-full md:w-1/4 flex justify-center">
                    <img src={headerData?.logo} alt="" className="w-1/2"/>
                </div>

                {/* footer icon and page */}
                <div className="flex flex-col items-center">
                    <div className="flex gap-5 text-[#999999] mb-4">
                        <FaFacebookF className="cursor-pointer text-[#007BFF] hover:text-[#0056b3] text-xs md:text-lg" />
                        <FaInstagram className="cursor-pointer text-[#007BFF] hover:text-[#0056b3] text-xs md:text-lg" />
                        <FaLinkedinIn className="cursor-pointer text-[#007BFF] hover:text-[#0056b3] text-xs md:text-lg" />
                        <FaTwitter className="cursor-pointer text-[#007BFF] hover:text-[#0056b3] text-xs md:text-lg" />
                    </div>
                    <div className="flex flex-wrap gap-4 capitalize justify-center text-[#515151] ">
                        {
                            pages?.map(page=>(
                                <h3 key={page.id} className="cursor-pointer text-sm hover:underline">{page.name}</h3>
                            ))
                        }
                    </div>
                </div>

                {/* footer contact info */}
                <div className="w-full md:w-1/4">
                    <h3 className="uppercase text-[20px] font-semibold text-[#999999]">contact us</h3>
                    <div className="flex flex-col justify-center ">
                        <h4 className="flex gap-5 items-center pt-1 text-[#515151]">
                            <FaPhoneAlt />
                            {headerData?.contact?.number}
                        </h4>
                        <h4 className="flex gap-5 items-center pt-1 text-[#515151]">
                            <IoMail size={18}/>
                            
                            {headerData?.contact?.mail}
                        </h4>
                    </div>
                </div>
            </div>

        </div>

        {/* copy write claim */}
        <div className="h-10 flex justify-center items-center absolute w-full bottom-0 bg-[#242323]">
            <span className="text-[#515151] text-xs md:text-sm px-5">All content reserved by Sabbir © 2024.</span>
        </div>
    </div>
  )
}

export default Footer