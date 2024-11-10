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
  
  const { loginUser, setCartProductQuantity } = useContext(UserContext);
  const [selectedPaymentSystem, setSelectedPaymentSystem] = useState(0);
  const [products, setProducts] = useState([]);
  const submitRef = useRef(null);
  
  const { data: paymentSystem } = useFetch("http://localhost:5001/paymant");
  
  const formik = useFormik({
    initialValues: { phone: '', address: '' },
    validationSchema: Yup.object({
      phone: Yup.string()
        .required('Phone number is required')
        .matches(/^\d{11}$/, 'Phone number must be exactly 11 digits'),
      address: Yup.string().required('Please confirm your Address')
    }),
    onSubmit: async (values, { resetForm }) => {
      const orderId = `order_${Date.now()}`;
      const today = new Date();
      const orderDate = today.toISOString().split("T")[0];
      const deliveryDate = new Date(today.setDate(today.getDate() + 7)).toISOString().split("T")[0];
      
      const orderData = {
        phone: values.phone,
        address: values.address,
        orderPaymentMethod: paymentSystem[selectedPaymentSystem]?.paymantSystemName,
        userId: loginUser.id,
        orderId,
        orderDate,
        deliveryDate,
        orderTracker,
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
      console.log(orderData)
      
      const response = await fetch('http://localhost:5001/trackOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const data = await response.json();
      console.log('Order confirmed:', data);
      resetForm()
    }
  });

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

  const handleQuantityChange = (id, quantity, isIncreasing) => {
    const newQuantity = isIncreasing ? quantity + 1 : Math.max(quantity - 1, 1);
    setProducts(prevProducts =>
      prevProducts.map(product => product.id === id ? { ...product, quantity: newQuantity } : product)
    );
    updateProductQuantity(id, newQuantity);
  };

  const handleRemoveProduct = (id) => {
    fetch(`http://localhost:5001/userCart/${id}`, { method: "DELETE" })
      .then(response => {
        if (response.ok) {
          setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
        }
      });
  };

  useEffect(() => {
    fetch('http://localhost:5001/userCart')
      .then(res => res.json())
      .then(data => {
        const userCart = data.filter(item => item.userId === loginUser.id);
        setProducts(userCart);
        setCartProductQuantity(userCart.length);
      });
  }, [loginUser.id, setCartProductQuantity]);

  const subTotal = products.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subTotal > 300 ? 0 : 5.00;

  return (
    <div className="w-full">
      <div className="w-[90%] mx-auto my-10">
        <div className="flex justify-between items-center py-5">
          <h2 className="text-xl md:text-3xl font-semibold text-gray-700">My Cart</h2>
          <button className="px-3 md:px-5 py-1 md:py-2 bg-[#007BFF] rounded-full text-white text-xs flex gap-2 items-center cursor-pointer">
            <MoveLeft size={20} />Back to Shopping
          </button>
        </div>
        <div className="flex flex-col lg:flex-row justify-between gap-5">
          <div className="overflow-y-auto w-full lg:w-2/3">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3">Product</th>
                    <th scope="col" className="px-6 py-3">Price</th>
                    <th scope="col" className="px-6 py-3">Quantity</th>
                    <th scope="col" className="px-6 py-3">Total</th>
                    <th scope="col" className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {
                  products?.map(product=> (
                    <tr key={product.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                          <img className="w-10 h-10 rounded-md" src={product.image} alt="Jese image" />
                          <div className="pl-3">
                              <div className="text-base font-semibold">
                                {
                                  product?.productName.split(" ").length > 6 ?`${product.productName.split(" ").slice(0, 6).join(" ")}...` : product?.productName
                                }
                              </div>
                              <div className="font-normal text-gray-500 flex gap-1">
                                {product.variantType && <span className="capitalize">{product.variantType} |</span>}
                                {product.color && <span>{product.color}</span>}
                              </div>
                          </div>
                      </th>
                      <td className="px-6 py-4">
                        {product.price}
                      </td>
                      <td className="px-6 py-4">
                          <div className="flex items-center w-fit px-5 border border-gray-300 rounded-full mx-auto">
                              <Minus size={20} onClick={() => handleQuantityChange(product.id, product.quantity, false)} className="cursor-pointer text-gray-500 hover:text-gray-700" />
                              <span className="mx-5">{product.quantity}</span>
                              <Plus size={20} onClick={() => handleQuantityChange(product.id, product.quantity, true)} className="cursor-pointer text-gray-500 hover:text-gray-700" />
                          </div>
                      </td>
                      <td className="px-6 py-4">
                        {(product.price * product.quantity).toFixed(2)}
                      </td>
                      <td className="w-4 p-4">
                          <X size={20} className="cursor-pointer text-red-500 hover:text-red-700" onClick={() => handleRemoveProduct(product.id)} />
                      </td>
                  </tr>
                  ))
                }
                  
              </tbody>
            </table>




          </div>

          <div className="w-full lg:w-1/3 text-center">
            <div className="w-full bg-gray-100 p-5">
              <h2 className="font-semibold text-[#212529] font-mono mb-5">Order Summary</h2>
              <form onSubmit={formik.handleSubmit} className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-md font-light text-[#212529]">Phone Number</label>
                  <input
                    type="tel"
                    className="form-input w-1/2"
                    placeholder="01xxxxxxxxx"
                    {...formik.getFieldProps('phone')}
                  />
                </div>
                {formik.touched.phone && formik.errors.phone && <div className="text-red-500">{formik.errors.phone}</div>}
                
                <div className="flex justify-between items-center">
                  <label className="text-md font-light text-[#212529]">Address</label>
                  <input
                    type="text"
                    className="form-input w-1/2"
                    placeholder="Your address"
                    {...formik.getFieldProps('address')}
                  />
                </div>
                {formik.touched.address && formik.errors.address && <div className="text-red-500">{formik.errors.address}</div>}

                <div className="flex justify-between items-center">
                  <label className="text-md font-light text-[#212529]">Payment Method</label>
                  <select
                    className="form-select w-1/2"
                    value={selectedPaymentSystem}
                    onChange={(e) => setSelectedPaymentSystem(parseInt(e.target.value, 10))}
                  >
                    {paymentSystem?.map((system, index) => (
                      <option key={index} value={index}>
                        {system.paymantSystemName}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="pt-5 flex flex-col space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${(subTotal + deliveryFee).toFixed(2)}</span>
                  </div>
                </div>
                
                <Button
                  ref={submitRef}
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="mt-5 w-full"
                >
                  Confirm Order
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddToCartPage;
