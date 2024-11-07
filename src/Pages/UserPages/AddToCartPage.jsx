import { Button } from '@mui/material';
import { X, Minus, Plus, MoveLeft } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../Hooks/UserContext';

function AddToCartPage() {
  const {loginUser, setCartProductQuantity} = useContext(UserContext)
  const [activeButton, setActiveButton] = useState('Bkash');
  console.log(loginUser.id)
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };
 
  
  const [products, setProducts] = useState([]);

  const updateProductQuantity = (id, quantity) => {
    console.log('update',quantity)
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
    console.log('increase',quantity)
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
    const newQuantity = quantity - 1;
    updateProductQuantity(id, newQuantity);
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
  console.log(products);

  return (
    <div className="w-full">
      <div className="w-[90%] mx-auto my-10">
        <div className='flex justify-between items-center py-5'>
          <h2 className='text-3xl font-semibold text-gray-700'>My Cart</h2>
          <button className='px-5 py-2 bg-[#007BFF] rounded-full text-[#212529] text-sm flex gap-2 items-center cursor-pointer'><MoveLeft size={20}/>Back to Shopping</button>
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
                      <h2 className='font-medium'>{product.name}</h2>
                      <div className='flex gap-3 text-sm text-gray-500'>
                        {product.type ? <span>{product.type}</span> : null}
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
                  <div className='w-full flex justify-between items-center'>
                    <h4 className='text-md font-light text-[#212529]'>Phone Number</h4>
                    <input 
                      type="text" 
                      className='text-md text-[#212529] py-1 px-2 bg-transparent border rounded-lg w-1/2 outline-none focus:border-blue-500 border-gray-600 transition-colors duration-200'
                      placeholder='Phone Number'
                    />
                  </div>
                  <div className='w-full flex justify-between items-center my-2'>
                    <h4 className='text-md font-light text-[#212529]'>Address</h4>
                    <input 
                      type="text" 
                      className='text-md text-[#212529] py-1 px-2 bg-transparent border rounded-lg w-1/2 outline-none focus:border-blue-500 border-gray-600 transition-colors duration-200'
                      placeholder='Shipping Address'
                    />
                  </div>
                  <div className='w-full flex justify-between items-center'>
                    <h4 className='text-md font-light text-[#212529]'>Subtotal</h4>
                    <span className='text-md font-light text-[#212529]'>412</span>
                  </div>
                  <div className='w-full flex justify-between items-center'>
                    <h4 className='text-md font-light my-2 text-[#212529]'>Shipping</h4>
                    <span className='text-md font-light my-2 text-[#212529]'>Free</span>
                  </div>
                  <div className='w-full flex justify-between items-center'>
                    <h4 className='text-md font-light text-[#212529]'>Add coupon code</h4>
                    <input 
                      type="text" 
                      className='text-md text-[#212529] py-1 px-2 bg-transparent border rounded-lg w-1/2 outline-none focus:border-blue-500 border-gray-600 transition-colors duration-200'
                    />
                  </div>
                  <div className='w-full flex justify-end mt-3'>
                    <Button variant="contained" sx={{backgroundColor: '#007BFF', '&:hover': {backgroundColor: '#007BFF',},}}className='px-10 py-3 rounded-md text-sm text-white'>
                      Apply
                    </Button>
                  </div>

                </div>
                <div className='w-full px-5 py-4 bg-[rgba(0,0,0,.1)] flex justify-between items-center'>
                  <h4 className='text-md font-semibold text-[#212529]'>Total</h4>
                  <span className='text-md font-semibold text-[#212529]'>412</span>
                </div>
              </div>
              <div className='w-full bg-gray-100 my-5'>
                <div className='w-full px-5 py-4 text-start'>
                  <h2 className='text-md font-semibold font-mono text-[#212529]'>Payment Details</h2>
                </div>
                <div className='flex px-5 py-2 gap-2'>
                  <button
                    className={`px-2 py-1 rounded-lg cursor-pointer text-sm font-light transition-colors 
                      ${activeButton === 'Bkash' ? 'bg-[#383d50] text-white border border-[#383d50]' : 'border border-[#383d50] text-[#212529] hover:border-[#007BFF]'}`}
                    onClick={() => handleButtonClick('Bkash')}
                  >
                    Bkash
                  </button>
                  <button
                    className={`px-2 py-1 rounded-lg cursor-pointer text-sm font-light transition-colors 
                      ${activeButton === 'Bank' ? 'bg-[#383d50] text-white border border-[#383d50]' : 'border border-[#383d50] text-[#212529] hover:border-[#007BFF]'} `}
                    onClick={() => handleButtonClick('Bank')}
                  >
                    Bank
                  </button>
                  <button
                    className={`px-2 py-1 rounded-lg cursor-pointer text-sm font-light transition-colors 
                      ${activeButton === 'Cash On Delivery' ? 'bg-[#383d50] text-white border border-[#383d50]' : 'border border-[#383d50] text-[#212529] hover:border-[#007BFF]'}`}
                    onClick={() => handleButtonClick('Cash On Delivery')}
                  >
                    Cash On Delivery
                  </button>
                </div>
                {
                  activeButton === "Bkash" ? 
                  <div className='px-5 py-3'>
                    <label className='flex justify-between items-center'><p className='text-sm text-[#212529]'>Bkash Number:</p> <input type="text" name="" id="" placeholder='Enter Bkash Number' className='text-sm text-[#212529] py-1 px-2 bg-transparent border rounded-lg w-1/2 outline-none focus:border-blue-500 border-gray-600 transition-colors duration-200'/></label>
                    <label className='flex justify-between items-center my-2'><p className='text-sm text-[#212529]'>Ammount:</p> <input type="text" name="" id="" placeholder='Enter Bkash Number' className='text-sm text-[#212529] py-1 px-2 bg-transparent border rounded-lg w-1/2 outline-none focus:border-blue-500 border-gray-600 transition-colors duration-200' value='412'/></label>
                    <div className='flex gap-5 justify-between my-5'>
                    <Button variant="contained" sx={{backgroundColor: '#007BFF', '&:hover': {backgroundColor: '#0056b3',},}}className='capitalize px-3 py-1 rounded-md text-sm text-white font-mono font-semibold text-md'>
                      Send Code
                    </Button>
                      <input type="text" name="" id="" placeholder='Enter Code Here' className='text-sm text-[#212529] py-1 px-2 bg-transparent border rounded-lg w-1/2 outline-none focus:border-blue-500 border-gray-600 transition-colors duration-200'/>
                    </div>
                    <Button variant="contained" sx={{backgroundColor: '#007BFF', '&:hover': {backgroundColor: '#007BFF',},}}className='px-10 py-3 rounded-md text-sm text-white'>
                      Check Out
                    </Button>
                  </div> 
                  : activeButton === "Bank" ? 
                  <div className='px-5 py-2 flex flex-col gap-2'>
                    <label className='flex justify-between items-center'><p className='text-sm text-[#212529]'>Holder Name:</p> <input type="text" name="" id="" placeholder='Card Holder Name' className='text-sm font-thin px-2 py-1 rounded-md outline-none border border-[#383d50] bg-transparent text-[#212529] placeholder:text-[#212529]'/></label>
                    <label className='flex justify-between items-center'><p className='text-sm text-[#212529]'>Card Number:</p> <input type="text" name="" id="" placeholder='Card Number' className='text-sm font-thin px-2 py-1 rounded-md outline-none border border-[#383d50] bg-transparent text-[#212529] placeholder:text-[#212529]'/></label>
                    <label className='flex justify-between items-center'><p className='text-sm text-[#212529]'>CVV Number:</p> <input type="text" name="" id="" placeholder='CVV Number' className='text-sm font-thin px-2 py-1 rounded-md outline-none border border-[#383d50] bg-transparent text-[#212529] placeholder:text-[#212529]'/></label>
                    <label className='flex justify-between items-center'><p className='text-sm text-[#212529]'>Expire Date:</p> <input type="text" name="" id="" placeholder='Month / Year' className='text-sm font-thin px-2 py-1 rounded-md outline-none border border-[#383d50] bg-transparent text-[#212529] placeholder:text-[#212529]'/></label>
                    <Button variant="contained" sx={{backgroundColor: '#007BFF', '&:hover': {backgroundColor: '#007BFF',},}}className='px-10 py-3 rounded-md text-sm text-white'>
                      Check Out
                    </Button>
                  </div>
                  : activeButton === "Cash On Delivery" ? 
                  <div className='px-5 py-4'>
                    <h2>Cash On Delivery</h2>
                  </div>
                  : ''
                }
              </div>
              <Button variant="contained" sx={{backgroundColor: '#FFC107', '&:hover': {backgroundColor: '#FFA000',},}}className='capitalize px-7 py-1 rounded-lg my-5 w-2/3 text-white font-mono font-semibold text-md'>
                Order Now
              </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddToCartPage;
