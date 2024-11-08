import * as Icons from 'lucide-react'
import useFetch from '../../Hooks/UseFetch';
import { useState } from 'react';
function TrackOrder() {
  const {data: trackOrders = []} = useFetch('http://localhost:5001/trackOrder')
  const [openOrderId, setOpenOrderId] = useState()
  
  return (
    <div className="w-full">
        <div className="w-[90%] mx-auto">
          {
            trackOrders.map(order=>{
              const isOpen = openOrderId === order.orderId;
              const percent = order.orderStage
              return(  
                <div key={order.orderId} className={`max-w-4xl  mx-auto my-10 bg-white p-8 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${isOpen ? "h-fit" : "h-[120px]"} `} >
                  <div className="flex justify-between items-center border-b pb-4 mb-6" onClick={()=>setOpenOrderId(isOpen ? null : order.orderId)}>
                    <div>
                      <h2 className="uppercase text-md font-semibold">order <span className="text-[#1E90FF]">#{order.orderId}</span></h2>
                      <h4>{order.phone}</h4>
                      <address>{order.address}</address>
                    </div>
                    <div>
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
                            className={`w-8 h-8 rounded-full flex items-center justify-center 
                            ${tracker.action === 'done' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
                          >
                            {IconComponent && <IconComponent size={14} />}
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
                          <div key={orderProduct.productId} className="flex justify-between items-center">
                            <div className="">
                              <div className="w-[70px] h-[70px] bg-[#c4c9d1] flex justify-center">
                                <img src={orderProduct?.productImage} alt="" className='h-[70px] object-cover object-center'/>
                              </div>
                            </div>
                            <div className="w-4/6">
                              <h2 className="text-md font-semibold">{orderProduct?.productName}</h2>
                              <span className="text-sm font-semibold text-slate-500 uppercase">{orderProduct.color} | {orderProduct?.variantType}</span>
                            </div>
                            <div className="w-1/6 text-end">
                              <span className="text-slate-500 text-sm font-medium">Qty: {orderProduct.quantity}</span>
                            </div>
                          </div>
                        )
                      })
                    }
                    
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