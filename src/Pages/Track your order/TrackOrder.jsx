import * as Icons from 'lucide-react'
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../Hooks/UserContext';
function TrackOrder() {
  const {loginUser} = useContext(UserContext);
  const [ orderProduct, setOrderProduct] = useState([])
  const [openOrderId, setOpenOrderId] = useState()
  useEffect(()=>{
    fetch('http://localhost:5001/trackOrder')
    .then(res=>res.json())
    .then((data)=>{
      const filteredData = data.filter((item) => item.userId === loginUser.id);
      setOrderProduct(filteredData);
    })

  }, [loginUser.id])
  return (
    <div className="w-full">
        <div className="w-[90%] mx-auto">
          {
            orderProduct.map(order=>{
              const isOpen = openOrderId === order.orderId;
              const percent = order.orderStage
              return(  
                <div key={order.orderId} className={`cursor-pointer max-w-4xl  mx-auto my-10 bg-white p-8 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${isOpen ? "h-fit" : "h-[120px]"} `} >
                  <div className="flex justify-between items-center border-b pb-4 mb-6" onClick={()=>setOpenOrderId(isOpen ? null : order.orderId)}>
                    <div>
                      <h2 className="uppercase text-sm md:text-base font-semibold"><span className="text-[#1E90FF]">#{order.orderId}</span></h2>
                      <h4 className='text-sm font-semibold text-gray-700'>{order.phone}</h4>
                      <address className='text-sm font-semibold text-gray-500'>{order.address}</address>
                    </div>
                    <div className='hidden md:block'>
                      <h4 className="font-medium">Order Data: <span className="font-semibold text-[#1e90ff]">{order.orderDate}</span></h4>
                      <h4 className="font-medium">Delivery Data: <span className="font-semibold text-[#1e90ff]">{order.deliveryDate}</span></h4>
                      <h4 className="font-medium">Payment: <span className="font-semibold text-[#1e90ff]"> {order.orderPaymentMethod}</span></h4>
                    </div>
                  </div>
                  <div className="relative w-full border-b py-10 mb-6">
                    <div className="flex justify-between absolute top-1/2 -translate-y-1/2 w-full z-[1]">
                    {
                      order?.orderTracker.map((tracker, index)=>{
                        const IconComponent = Icons[tracker.icon]
                        
                        return (
                          <div
                            key={index}
                            className={`w-7 h-7 rounded-full flex items-center justify-center 
                            ${tracker.action === 'done' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
                          >
                            {IconComponent && <IconComponent size={16} />}
                          </div>
                        )
                      })
                    }
                    </div>
                    <div className="absolute top-1/2 left-0 bg-[#e8f0fe] w-full h-2 -translate-y-1/2 rounded ">
                      <div className={`h-full bg-[#0a66c2]`} style={{ width: `${percent * 20}%` }}></div>
                    </div>
                  </div>
                  <div className="border-b pb-4 mb-6 flex flex-col gap-5">
                    {
                      order?.orderProducts.map((orderProduct)=>{
                        
                        return(
                          <div key={orderProduct.productId} className="flex gap-3 justify-between items-center">
                            <div className="">
                              <div className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] flex justify-center">
                                <img src={orderProduct?.productImage} alt="" className='h-[50px] w-[50px] object-cover rounded-full border border-gray-700 aspect-square object-center' loading='lazy'/>
                              </div>
                            </div>
                            <div className="w-5/6">
                              <h2 className="text-sm md:text-base md:font-semibold">{orderProduct?.productName}</h2>
                              <span className="text-xs md:text-sm md:font-semibold text-slate-500 uppercase">{orderProduct.color} | {orderProduct?.variantType}</span>
                            </div>
                            <div className="w-1/6 text-end">
                              <span className="text-slate-500 text-sm font-medium"><span className='hidden md:blcok'>Qty:</span> ({orderProduct.quantity})</span>
                            </div>
                          </div>
                        )
                      })
                    }
                    
                  </div>
                  <div className='md:hidden text-end'>
                      <h4 className="text-sm">Order Data: <span className="font-semibold text-[#1e90ff]">{order.orderDate}</span></h4>
                      <h4 className="text-sm">Delivery Data: <span className="font-semibold text-[#1e90ff]">{order.deliveryDate}</span></h4>
                      <h4 className="text-sm">Payment: <span className="font-semibold text-[#1e90ff]"> {order.orderPaymentMethod}</span></h4>
                    </div>
                </div>
              )
            })
          }
        </div>
    </div>
  )
}

export default TrackOrder