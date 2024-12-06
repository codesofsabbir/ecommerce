import { useState } from 'react'
import './App.css'
import {UserContext} from './Hooks/UserContext'
import Header from './Components/Common/Header/Header';
import Home from './Pages/Home/Home';
import Footer from './Components/Common/Footer/Footer';
import { BrowserRouter, Routes, Route,  } from 'react-router-dom';
import HelpCenter from './Pages/Help Center/HelpCenter';
import TrackOrder from './Pages/Track your order/TrackOrder';
import ProductPage from './Pages/Product Page/ProductPage';
import CategoryPage from './Pages/Category Page/CategoryPage';
import SignUp from './Pages/SignUp/SignUp';
import LogedIn from './Pages/LogedIn/LogedIn';
import ProfilePage from './Pages/UserPages/ProfilePage';
import AddToCartPage from './Pages/UserPages/AddToCartPage';
import PrivateRoute from './Private/Components/PrivateRoute';
import OverviewPage from './Private/Pages/OverviewPage';
import Sidebar from './Private/Components/Common/Sidebar';
import ProductList from './Private/Pages/ProductList';
import UsersPage from './Private/Pages/UsersPage';
import SalesPage from './Private/Pages/SalesPage';
import OrdersPage from './Private/Pages/OrdersPage';
import AnalyticsPage from './Private/Pages/AnalyticsPage';
import SettingsPage from './Private/Pages/SettingsPage';
import Error from './Pages/ErrorPage/Error';
import Protected from './Components/Protected';
import AdminLogin from './Private/Pages/AdminLogin';
// import AddProduct from './Private/Pages/AddProduct';
import ProductEntryForm from './Private/Pages/ProductEntryForm';



function App() {
  /* this headerData for Logo, contact info, language select and Currency select which use in header and footer thats why it use in App.jsx and provide by usercontext */
  const [headerData, setHeaderData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [productData, setProductData] = useState();
  const [adminLogIn, setAdminLogIn] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [userLogedIn, setUserLogedIn] = useState(false);
  const [loginUser, setLoginUser] = useState(null);
  const [cartProductQuantity, setCartProductQuantity] = useState(0);
  const [orderSuccessMessageBoxIsOpen, setOrderSuccessMessageBoxIsOpen] = useState(false)
  return (
    <div className={`${orderSuccessMessageBoxIsOpen ? "h-screen overflow-hidden": ""}`}>
      <UserContext.Provider value={{orderSuccessMessageBoxIsOpen, setOrderSuccessMessageBoxIsOpen, adminUser, setAdminUser, adminLogIn, setAdminLogIn, headerData, setHeaderData, categoryData, setCategoryData, productData, setProductData, userLogedIn, setUserLogedIn, loginUser, setLoginUser, cartProductQuantity, setCartProductQuantity}}>
      <BrowserRouter>
        <Routes>
          <Route path='' element={<Header />}>
            <Route path='' element={<Footer />}>
              <Route path={"/*"} element={<Error />}/>
              <Route path={"/"} element={<Home />}/>
              <Route path={"/help-center"}  element={<HelpCenter />} />
              <Route path={""} element={<Protected />} >
                <Route path="/track-order" element={<TrackOrder />} />
                <Route path="/user-profile" element={<ProfilePage />} />
                <Route path="/addtocard" element={<AddToCartPage />} />
              </Route>
              <Route path={"/sign-up"}  element={<SignUp />} />
              <Route path={"/login"}  element={<LogedIn />} />
              <Route path={'/product/:id'} element = {<ProductPage />} />
              <Route path={'/category/:categoryName'} element = {<CategoryPage />} />
            </Route>
          </Route>
          <Route path={'admin'} element={<AdminLogin />} />
          <Route path='' element={<PrivateRoute />}>
            <Route path='' element={<Sidebar />}>
              <Route path="/dashboard" element={<OverviewPage />} />
              <Route path="/product_list" element={<ProductList />} />
              {/* <Route path="/add-product" element={<AddProduct />} /> */}
              <Route path="/add-product" element={<ProductEntryForm />} />

              <Route path="/users" element={<UsersPage />} />
              <Route path="/sales" element={<SalesPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>
          
        </Routes>
      
      
      </BrowserRouter>
      
      

    </UserContext.Provider>
    </div>
  )
}

export default App
