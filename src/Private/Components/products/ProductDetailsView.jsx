/* eslint-disable react/prop-types */
import useAxios from "../../../Hooks/useAxios";
import { motion } from "framer-motion";
import { X } from "lucide-react"
import SwiperSlider from "../../../Components/product_img_slider/SwiperSlider";
import ProductDetailsTable from "./ProductDetailsTable";


function ProductDetailsView({viewProductId, setProductModalOpen}) {
    const {data: product=[] } = useAxios(`http://localhost:5001/productsInfo/${viewProductId}`)



    
  return (
    <motion.div 
        className="fixed top-0 left-0 h-screen w-full bg-[rgba(0,0,0,0.7)] z-[1000] flex justify-center items-center"
        initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ delay: 0.2 }}
    >
        <div className="w-[70%] h-[90%] bg-white rounded-md overflow-hidden overflow-y-scroll relative">
            <X className="absolute right-5 top-5 cursor-pointer z-10 text-black" onClick={()=>{setProductModalOpen(false)}}/>
            <div className="p-10 flex">
                <div className="">

                </div>
                <SwiperSlider productImg={product?.images} />
                <div className=" mt-5 md:mt-0 md:pl-10">
                    <h2 className="text-4xl font-sans font-medium leading-relaxed text-black">
                        {product?.productName}
                    </h2>
                    <div className="flex flex-wrap gap-3 pb-7">
                        <div className="flex gap-1 items-center px-5 py-1 rounded-full bg-gray-800 w-fit">
                            <h3 className="text-sm text-gray-300">Price:</h3>
                            <span className="text-sm font-semibold">
                                {product?.productPrice - (product?.productPrice * (product?.productDiscountAmount/100))}
                            </span>
                        </div>

                        <div className="flex gap-1 items-center px-5 py-1 rounded-full bg-gray-800 w-fit">
                            <h3 className="text-sm text-gray-300">Regular Price:</h3>
                            <span className="text-sm font-semibold">
                                {product?.productPrice}
                            </span>
                        </div>

                        <div className="flex gap-1 items-center px-5 py-1 rounded-full bg-gray-800 w-fit">
                            <h3 className="text-sm text-gray-300">Product Code:</h3>
                            <span className="text-sm font-semibold">{product?.productCode}</span>
                        </div>

                        <div className="flex gap-1 items-center px-5 py-1 rounded-full bg-gray-800 w-fit">
                            <h3 className="text-sm text-gray-300">Brand:</h3>
                            <span className="text-sm font-semibold">{product?.brand}</span>
                        </div>

                    </div>
                    <div className='mb-5'>
                        <h3 className='text-lg font-mono text-gray-900'>Key Features :</h3>
                        {product?.keyFeatures?.map((feature, index) => (
                            <li key={index} className="list-none font-mono text-sm pb-1 text-gray-700">
                                {feature}
                            </li>
                        ))}
                    </div>
                </div>
            </div>
            <div className="p-10">
                <ProductDetailsTable product={product}/>
            </div>
        </div>
    </motion.div>
  )
}

export default ProductDetailsView