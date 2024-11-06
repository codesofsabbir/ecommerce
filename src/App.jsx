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



function App() {
  const [headerData, setHeaderData] = useState();
  const [categoryData, setCategoryData] = useState([]);
  const [productData, setProductData] = useState();
  const [userLogedIn, setUserLogedIn] = useState(false);
  const [loginUser, setLoginUser] = useState(null);
  return (
    <UserContext.Provider value={{headerData, setHeaderData, categoryData, setCategoryData, productData, setProductData, userLogedIn, setUserLogedIn, loginUser, setLoginUser}}>
      <BrowserRouter>
      <Header />
        <Routes>
          <Route path={"/"} element={<Home />}/>
          <Route path={"/help-center"}  element={<HelpCenter />} />
          <Route path="/track-order" element={<PrivateRoute element={<TrackOrder />} />} />
          <Route path="/user-profile" element={<PrivateRoute element={<ProfilePage />} />} />
          <Route path="/addtocard" element={<PrivateRoute element={<AddToCartPage />} />} />
          <Route path={"/sign-up"}  element={<SignUp />} />
          <Route path={"/login"}  element={<LogedIn />} />
          <Route path={'/product/:id'} element = {<ProductPage />} />
          <Route path={'/category/:categoryName'} element = {<CategoryPage />} />
        </Routes>
      <Footer />
      
      </BrowserRouter>
      
      

    </UserContext.Provider>
  )
}

export default App
