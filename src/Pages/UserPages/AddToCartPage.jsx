import { Button } from '@mui/material';
import { X, Minus, Plus, MoveLeft } from 'lucide-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../Hooks/UserContext';
import useFetch from '../../Hooks/UseFetch';
import { useFormik } from 'formik';
import * as Yup from 'yup';
function AddToCartPage() {
  const orderTracker = [
    { name: "Order Placed", action: "done", icon: "CircleEllipsis" },
    { name: "Order Confirmed", action: "", icon: "ShoppingBag" },
    { name: "Shipping Company Assigned", action: "", icon: "PackageCheck" },
    { name: "In Transit", action: "", icon: "Truck" },
    { name: "Out for Delivery", action: "", icon: "MapPinCheckInside" },
    { name: "Delivered", action: "", icon: "House" }
  ];
  const {loginUser, setCartProductQuantity} = useContext(UserContext)
  const [selectedPaymentSystem, setSelectedPaymentSystem] = useState(0);
  const submitRef = useRef(null);
  const {data: paymentSystem} = useFetch("http://localhost:5001/paymant");
  const formik = useFormik({
    initialValues: {
      phone: '',
      address: ''
    },
    validationSchema: Yup.object({
      phone: Yup.string()
        .required('Phone number is required')
        .matches(/^\d{11}$/, 'Phone number must be exactly 11 digits'),
      address: Yup.string()
        .required('Please confirm your Address')
    }),
    onSubmit: async (values) => {
      const orderId = `order_${Date.now()}`; 
      const newDate = new Date();
      const orderYear = newDate.getFullYear();
      const orderMonth = newDate.getMonth() + 1;
      const orderDay = newDate.getDate();
      const customOrderDate = `${orderYear}-${orderMonth}-${orderDay}`;
      newDate.setDate(newDate.getDate() + 7);
      const deliveryYear = newDate.getFullYear();
      const deliveryMonth = newDate.getMonth() + 1;
      const deliveryDay = newDate.getDate();
      const customDeliveryDate = `${deliveryYear}-${deliveryMonth}-${deliveryDay}`;
      const orderData = {
        phone: values.phone,
        address: values.address,
        orderPaymentMethod: paymentSystem[selectedPaymentSystem]?.paymantSystemName,
        userId: loginUser.id,
        orderId: orderId,
        orderDate: customOrderDate,
        deliveryDate: customDeliveryDate,
        orderTracker: orderTracker,
        orderStage: 0,
        orderProducts: products.map(product => ({
          productId: product.id,
          productImage: product.image,
          productName: product.productName,
          color: product.color,
          variantType: product.variantType,
          quantity: product.quantity,
          price: product.price,
          total: (product.price * product.quantity).toFixed(2)
        }))
      };
      
      const response = await fetch('http://localhost:5001/trackOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      const data = await response.json();
      console.log('Order confirmed:', data);

      fetch(`http://localhost:5001/userCart/`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          
        }
      });
    }
  });
  


  
 
  
  const [products, setProducts] = useState([]);

  const updateProductQuantity = (id, quantity) => {

    fetch(`http://localhost:5001/userCart/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity })
    })
    .then(response => response.json())
    .then(updatedProduct => {
      setProducts(prevProducts => prevProducts.map(product =>
        product.id === id ? updatedProduct : product
      ));
    });
  };
  
  const handleIncreaseQuantity = (id, quantity) => {

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? { ...product, quantity: product.quantity + 1 }
          : product
      )
    );
    const newQuantity = quantity + 1;
    updateProductQuantity(id, newQuantity);
  };

  const handleRemoveProduct = (id) => {
    fetch(`http://localhost:5001/userCart/${id}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          setProducts((prevProducts) => prevProducts.filter(product => product.id !== id));
        }
      });
  };

  // Function to decrease the quantity of a specific product
  const handleDecreaseQuantity = (id, quantity) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id && product.quantity > 1
          ? { ...product, quantity: product.quantity - 1 }
          : product
      )
    );
    if(quantity>1){
      const newQuantity = quantity - 1;
      updateProductQuantity(id, newQuantity);
    }else{
      const newQuantity = quantity;
      updateProductQuantity(id, newQuantity);
    }
  };

  useEffect(()=>{
    fetch('http://localhost:5001/userCart')
    .then(res=>res.json())
    .then((data)=>{
      const filteredData = data.filter((item) => item.userId === loginUser.id);
      setProducts(filteredData);
      setCartProductQuantity(filteredData.length)
    })

  }, [loginUser.id, setCartProductQuantity])
  const subTotal = products.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  let deliveryFee = subTotal > 300 ? 0 : 5.00;

  return (
    <div className="w-full">
      <div className="w-[90%] mx-auto my-10">
        <div className='flex justify-between items-center py-5'>
          <h2 className='text-3xl font-semibold text-gray-700'>My Cart</h2>
          <button className='px-5 py-2 bg-[#007BFF] rounded-full text-[white] text-sm flex gap-2 items-center cursor-pointer'><MoveLeft size={20}/>Back to Shopping</button>
        </div>
        <div className="flex justify-between gap-5">
        <table className='w-2/3 border-collapse border border-gray-300 h-fit'>
          <thead className='bg-gray-100'>
            <tr className='text-center' style={{ height: '40px' }}>
              <th className='p-1 border-b border-gray-300'>Product</th>
              <th className='p-1 border-b border-gray-300'>Price</th>
              <th className='p-1 border-b border-gray-300'>Quantity</th>
              <th className='p-1 border-b border-gray-300'>Total</th>
              <th className='p-1 border-b border-gray-300'></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className='hover:bg-gray-50 text-center' style={{ height: '100px' }}>
                <td className='p-1 border-b border-gray-200'>
                  <div className='flex items-center gap-5'>
                    <img src={product.image} alt="" className='h-16 rounded-md border border-gray-200'/>
                    <div>
                      <h2 className='font-medium'>
                        {
                          product?.productName.split(" ").length > 6 ?`${product.productName.split(" ").slice(0, 6).join(" ")}...` : product?.productName
                        }
                      </h2>
                      <div className='flex gap-1 text-sm text-gray-500'>
                        {product.variantType ? <span className='capitalize'>{product.variantType} |</span> : null}
                        {product.color ? <span>{product.color}</span> : null}
                      </div>
                    </div>
                  </div>
                </td>
                <td className='p-1 border-b border-gray-200'>{product.price}</td>
                <td className='p-1 border-b border-gray-200'>
                  <div className="flex py-1 items-center w-fit px-5 border border-gray-300 rounded-full mx-auto">
                    <Minus
                      size={20}
                      onClick={() => handleDecreaseQuantity(product.id, product.quantity)}
                      className="cursor-pointer text-gray-500 hover:text-gray-700"
                    />
                    <span className="mx-5">{product.quantity}</span>
                    <Plus
                      size={20}
                      onClick={() => handleIncreaseQuantity(product.id, product.quantity)}
                      className="cursor-pointer text-gray-500 hover:text-gray-700"
                    />
                  </div>
                </td>
                <td className='p-1 border-b border-gray-200'>{(product.price * product.quantity).toFixed(2)}</td>
                <td className='p-1 border-b border-gray-200'>
                  <X 
                    size={20} 
                    className="cursor-pointer text-red-500 hover:text-red-700" 
                    onClick={() => handleRemoveProduct(product.id)} 
                  />
                </td>
              </tr>
            ))}
          </tbody>

        </table>

          <div className='w-1/3 text-center'>
              <div className='w-full bg-gray-100'>
                <div className='w-full px-5 py-4 text-start'>
                  <h2 className='font-semibold text-[#212529] font-mono'>Order Summary</h2>
                </div>
                <div className='w-full px-5 py-4 '>
                  <form onSubmit={formik.handleSubmit}>
                  <div className='w-full flex justify-between items-center'>
                    <h4 className='text-md font-light text-[#212529]'>Phone Number</h4>
                    <input 
                      type="text" 
                      className='text-md text-[#212529] py-1 px-2 bg-transparent border rounded-lg w-1/2 outline-none focus:border-blue-500 border-gray-600 transition-colors duration-200'
                      placeholder='Phone Number'
                      onChange={formik.handleChange}
                      value={formik.phone}
                      name='phone'
                    />
                  </div>
                  <div className='w-full flex justify-between items-center my-2'>
                    <h4 className='text-md font-light text-[#212529]'>Address</h4>
                    <input 
                      type="text" 
                      className='text-md text-[#212529] py-1 px-2 bg-transparent border rounded-lg w-1/2 outline-none focus:border-blue-500 border-gray-600 transition-colors duration-200'
                      placeholder='Shipping Address'
                      onChange={formik.handleChange}
                      value={formik.address}
                      name='address'
                    />
                  </div>
                  <input type="submit" value="" ref={submitRef} className='hidden'/>
                  </form>
                  <div className='w-full flex justify-between items-center'>
                    <h4 className='text-md font-light my-2 text-[#212529]'>Subtotal</h4>
                    <span className='text-md font-light my-2 text-[#212529]'>{subTotal.toFixed(2)}</span>
                  </div>
                  <div className='w-full flex justify-between items-center'>
                    <h4 className='text-md font-light my-2 text-[#212529]'>Delivery Fee</h4>
                    <span className='text-md font-light my-2 text-[#212529]'>{deliveryFee.toFixed(2)}</span>
                  </div>
                  

                </div>
                <div className='w-full px-5 py-4 bg-[rgba(0,0,0,.1)] flex justify-between items-center'>
                  <h4 className='text-md font-semibold text-[#212529]'>Total</h4>
                  <span className='text-md font-semibold text-[#212529]'>{(subTotal+deliveryFee).toFixed(2)}</span>
                </div>
              </div>
              <div className='w-full bg-gray-100 my-5'>
                <div className='w-full px-5 py-4 text-start'>
                  <h2 className='text-md font-semibold font-mono text-[#212529]'>Payment Details</h2>
                </div>
                <div className='flex flex-wrap justify-center gap-3'>
                  {
                    paymentSystem.map((payment)=>(
                        <img key={payment?.paymantSystemId} src={payment?.img} alt="" className={`w-16 cursor-pointer border rounded-md ${selectedPaymentSystem === payment?.paymantSystemId ? 'border border-black' : 'border-gray-300'}`} onClick={()=>{setSelectedPaymentSystem(payment?.paymantSystemId)}}/>
                    ))
                  }
                  
                </div>
                
              </div>
              <Button type='submit' variant="contained" sx={{backgroundColor: '#0a66c2', '&:hover': {backgroundColor: '#0a66c2',},}}className='capitaize px-7 py-1 rounded-lg my-5 w-2/3 text-white font-mono font-semibold text-md' onClick={() => submitRef.current.click()}>
                Proceed to checkout
              </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddToCartPage;
