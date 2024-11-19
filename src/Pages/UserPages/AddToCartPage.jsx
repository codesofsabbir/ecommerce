import { MoveLeft } from 'lucide-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../Hooks/UserContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import useAxios from '../../Hooks/useAxios';
import CartTable from '../../Components/AddToCard/CartTable';
import OrderSummaryForm from '../../Components/AddToCard/OrderSummaryForm';
import axios from 'axios';

function AddToCartPage() {
  const navigate = useNavigate();
  const { loginUser, setCartProductQuantity } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [selectedPaymentSystem, setSelectedPaymentSystem] = useState(0);
  const submitRef = useRef(null);
  const { data: paymentSystem } = useAxios("http://localhost:5001/paymant");
  const { data: cartData, loading: cartLoading, error: cartError } = useAxios('http://localhost:5001/userCart');
  const orderTracker = [
    { name: "Order Placed", icon: "CircleEllipsis" },
    { name: "Order Confirmed", icon: "ShoppingBag" },
    { name: "Order Assigned", icon: "PackageCheck" },
    { name: "In Transit", icon: "Truck" },
    { name: "Delivered", icon: "House" }
  ];

  useEffect(() => {
    if (!cartLoading && !cartError && cartData) {
      const userCart = cartData.filter(item => item.userId === loginUser.id);
      setProducts(userCart);
      setCartProductQuantity(userCart.length);
    }
  }, [loginUser.id, cartLoading, cartData, cartError, setCartProductQuantity]);

  const updateProductQuantity = async (id, quantity) => {
    try{
      const response = await axios.patch(`http://localhost:5001/userCart/${id}`,
        {quantity},
        {headers: {"Content-Type": "application/json"}}
      );
      setProducts(prevProducts => prevProducts.map(product =>
        product.id === id ? response.data : product
      ));
    }catch(error){
      console.error('Error updatign quantity:', error);
    }
  };
  
  const handleQuantityChange = (id, quantity, isIncreasing) => {
    const newQuantity = isIncreasing ? quantity + 1 : Math.max(quantity - 1, 1);
    setProducts(prevProducts =>
      prevProducts.map(product => product.id === id ? { ...product, quantity: newQuantity } : product)
    );
    updateProductQuantity(id, newQuantity);
  };

  const handleRemoveProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/userCart/${id}`);
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  const formik = useFormik({
    initialValues: { phone: '', address: '' },
    validationSchema: Yup.object({
      phone: Yup.string()
        .required('Phone number is required')
        .matches(/^\d{11}$/, 'Phone number must be exactly 11 digits'),
      address: Yup.string().required('Please confirm your Address')
    }),
    onSubmit: async (values, { resetForm }) => {
      if(products.length>0){
        const orderId = `order_${Date.now()}`;
        const today = new Date();
        const orderDate = today.toISOString().split("T")[0];
        const deliveryDate = new Date(today.setDate(today.getDate() + 7)).toISOString().split("T")[0];
        const orderData = {
          ...values,
          orderPaymentMethod: paymentSystem[selectedPaymentSystem]?.paymantSystemName,
          userId: loginUser.id,
          userName: loginUser.userName,
          totalAmount: (subTotal + deliveryFee).toFixed(2),
          orderId,
          orderDate,
          deliveryDate,
          orderTracker,
          orderStage: 0,
          orderProducts: products.map(product => ({
            ...product,
            total: (product.price * product.quantity).toFixed(2)
          }))
        };
        try{
          await axios.post('http://localhost:5001/trackOrder', orderData, {
            headers: { 'Content-Type': 'application/json' }
          });
          await Promise.all(products.map(product => 
            axios.delete(`http://localhost:5001/userCart/${product.id}`)
          ))
          setProducts([]);
          setCartProductQuantity(0);
          resetForm()
          navigate('/order-success');
        }catch(error){
          console.error('Error placing order:', error);
        } 
      }else{
        alert("There have no product in your Cart! Please select product first and place the order. Thank You.")
      }
    }
  });

  const subTotal = products.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subTotal === 0 || subTotal > 5500 ? 0 : 200;

  return (
    <div className="w-full">
      <div className="w-[90%] mx-auto my-10">

        <div className="flex justify-between items-center py-5">
          <h2 className="text-xl md:text-3xl font-semibold text-gray-700">My Cart</h2>
          <button className="px-3 md:px-5 py-1 md:py-2 bg-[#007BFF] rounded-full text-white text-xs flex gap-2 items-center cursor-pointer" onClick={()=>{navigate('/')}}>
            <MoveLeft size={20} />Back to Shopping
          </button>
        </div>

        <div className="flex flex-col lg:flex-row justify-between gap-5">

          <CartTable 
            products={products}
            handleQuantityChange={handleQuantityChange}
            handleRemoveProduct={handleRemoveProduct}
          />

          <OrderSummaryForm 
            formik={formik}
            selectedPaymentSystem={selectedPaymentSystem}
            setSelectedPaymentSystem={setSelectedPaymentSystem}
            paymentSystem={paymentSystem}
            subTotal={subTotal}
            deliveryFee={deliveryFee}
            submitRef={submitRef}
          />
        </div>
      </div>
    </div>
  );
}

export default AddToCartPage;
