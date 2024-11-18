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
import PrivateRoute from './Components/PrivateRoute';
import OverviewPage from './Private/Pages/OverviewPage';
import Sidebar from './Private/Components/Common/Sidebar';
import ProductList from './Private/Pages/ProductList';
import UsersPage from './Private/Pages/UsersPage';



function App() {
  /* this headerData for Logo, contact info, language select and Currency select which use in header and footer thats why it use in App.jsx and provide by usercontext */
  const [headerData, setHeaderData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [productData, setProductData] = useState();
  const [userLogedIn, setUserLogedIn] = useState(false);
  const [loginUser, setLoginUser] = useState(null);
  const [cartProductQuantity, setCartProductQuantity] = useState(0);
  const [productmodalopen, setProductModalOpen] = useState(false);
  return (
    <UserContext.Provider value={{productmodalopen, setProductModalOpen, headerData, setHeaderData, categoryData, setCategoryData, productData, setProductData, userLogedIn, setUserLogedIn, loginUser, setLoginUser, cartProductQuantity, setCartProductQuantity}}>
      <BrowserRouter>
      
        

        <Routes>
          <Route path='' element={<Header />}>
            <Route path='' element={<Footer />}>
              <Route path={"/"} element={<Home />}/>
              <Route path={"/help-center"}  element={<HelpCenter />} />
              <Route path="/track-order" element={<PrivateRoute element={<TrackOrder />} />} />
              <Route path="/user-profile" element={<PrivateRoute element={<ProfilePage />} />} />
              <Route path="/addtocard" element={<PrivateRoute element={<AddToCartPage />} />} />
              <Route path={"/sign-up"}  element={<SignUp />} />
              <Route path={"/login"}  element={<LogedIn />} />
              <Route path={'/product/:id'} element = {<ProductPage />} />
              <Route path={'/category/:categoryName'} element = {<CategoryPage />} />
            </Route>
          </Route>
          <Route path='' element={<Sidebar />}>
            <Route path="/dashboard" element={<OverviewPage />} />
            <Route path="/product_list" element={<ProductList />} />
            <Route path="/users" element={<UsersPage />} />
          </Route>
          
        </Routes>
      
      
      </BrowserRouter>
      
      

    </UserContext.Provider>
  )
}

export default App
