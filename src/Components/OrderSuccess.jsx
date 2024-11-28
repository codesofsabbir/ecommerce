/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import OrderConfirm from "../../database/OrderConfirm.json"
import Lottie from 'lottie-react'
function OrderSuccess({setOrderSuccessMessageBoxIsOpen}) {
    const navigate = useNavigate();
  return (
    <div className=" w-full h-screen bg-[rgba(0,0,0,0.7)] absolute top-0 left-0 flex justify-center items-center z-[3]">
        <div className="w-96 overflow-hidden py-10 flex flex-col items-center gap-10 rounded-md bg-gray-200 ">
            <div style={{width: "35%"}}>
                <Lottie animationData={OrderConfirm} loop={false} />
            </div>
            <h3 className="text-xl font-semibold">Order Confirmed</h3>
            <button className="px-5 py-2 bg-blue-600 rounded-md text-white font-medium" onClick={()=>{
                setOrderSuccessMessageBoxIsOpen(false)
                navigate('/')
                }}>Continue</button>
        </div>
    </div>
  )
}

export default OrderSuccess