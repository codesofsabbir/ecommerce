import { MoveLeft } from 'lucide-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../Hooks/UserContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import useAxios from '../../Hooks/useAxios';
import CartTable from '../../Components/AddToCard/CartTable';
import OrderSummaryForm from '../../Components/AddToCard/OrderSummaryForm';

function AddToCartPage() {
  const orderTracker = [
    { name: "Order Placed", icon: "CircleEllipsis" },
    { name: "Order Confirmed", icon: "ShoppingBag" },
    { name: "Order Assigned", icon: "PackageCheck" },
    { name: "In Transit", icon: "Truck" },
    { name: "Delivered", icon: "House" }
  ];
  const navigate = useNavigate();
  
  const { loginUser, setCartProductQuantity } = useContext(UserContext);
  const [selectedPaymentSystem, setSelectedPaymentSystem] = useState(0);
  const [products, setProducts] = useState([]);
  const submitRef = useRef(null);
  const { data: paymentSystem } = useAxios("http://localhost:5001/paymant");
  
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
        userName: loginUser.userName,
        totalAmount: (subTotal + deliveryFee).toFixed(2),
        deliveryStatus: 0,
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

      
      const userCart = await fetch('http://localhost:5001/userCart')
    .then(res => res.json())
    .then(data => data.filter(item => item.userId === loginUser.id));

  // Send a delete request for each item in the user's cart
  for (const item of userCart) {
    await fetch(`http://localhost:5001/userCart/${item.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
  }

  console.log('Cart cleared after order placement');
  setProducts([]);
  setCartProductQuantity(0);
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
