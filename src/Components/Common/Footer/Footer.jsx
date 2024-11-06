import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../../Hooks/UserContext"
import { Facebook, Instagram, Linkedin, Twitter, Phone, Mail } from 'lucide-react';
import useFetch from "../../../Hooks/UseFetch";

function Footer() {
    const {headerData} = useContext(UserContext);
    const [pages, setPages] = useState([]);
    const [paymentSystem, setPaymentSystem] = useState([])
    const {data} = useFetch("http://localhost:5001/categories");
    useEffect(()=>{
        fetch('http://localhost:5001/pages')
        .then(res=>res.json())
        .then((data)=>{
            setPages(data);
        })
    }, [])
    useEffect(()=>{
        fetch('http://localhost:5001/paymant')
        .then((res)=>res.json())
        .then((data)=>{
            setPaymentSystem(data);
        })
    }, [])

  return (
    <div className="w-full h-screen bg-[#212121] relative">
        <div className="w-[90%] mx-auto">
            <div className="pt-10 pb-8 border-b border-[#515151]">
                <h2 className="text-white text-xl uppercase pb-5 font-bold">Brand Directory</h2>
                {
                    data.map(category=>(
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


            <div className="flex gap-8 py-8">
                <div className=" w-1/4">
                    <img src={headerData?.logo} alt="" />
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex gap-5 text-[#999999] mb-4">
                        <Facebook size={22} color="#007BFF"/>
                        <Instagram size={22} color="#007BFF"/>
                        <Linkedin size={22} color="#007BFF"/>
                        <Twitter size={22} color="#007BFF"/>
                    </div>
                    <div className="flex flex-wrap gap-4 capitalize justify-center text-[#515151] ">
                        {
                            pages.map((page)=>(
                                <h3 key={page.id} className="cursor-pointer text-sm hover:underline">{page.name}</h3>
                            ))
                        }
                    </div>
                    <div className="flex gap-5 mt-5">
                        {
                            paymentSystem.map((payment, index)=>(
                                <img key={index} src={payment} alt="" className="w-12"/>
                            ))
                        }
                    </div>
                </div>
                <div className="w-1/4">
                    <h3 className="uppercase text-[20px] font-semibold text-[#999999]">contact us</h3>
                    <h4 className="flex gap-5 items-center pt-1 text-[#515151]">
                        <Phone size={18}/>
                        {headerData?.contact?.number}
                    </h4>
                    <h4 className="flex gap-5 items-center pt-1 text-[#515151]">
                        <Mail size={18}/>
                        {headerData?.contact?.mail}
                    </h4>
                </div>
            </div>

        </div>
        <div className="h-10 flex justify-center items-center absolute w-full bottom-0 bg-[#242323]">
            <span className="text-[#515151]">All content on this website is protected by copyright © 2024. All rights reserved by Sabbir. </span>
        </div>
    </div>
  )
}

export default Footer