import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import SwiperSlider from '../../Components/product_img_slider/SwiperSlider';
import { UserContext } from '../../Hooks/UserContext';
import ProductDetails from '../../Components/Product Details/ProductDetails';
import ProductComment from '../../Components/Product Details/ProductComment';
import RelatedProduct from '../../Components/Product Details/RelatedProduct';
import useAxios from '../../Hooks/useAxios';

function ProductPage() {
  const {loginUser, userLogedIn} = useContext(UserContext);
  const { id } = useParams();
  const { data: product } = useAxios(`http://localhost:5001/productsInfo/${id}`);

  
  return (
    <div className="w-full">
      <div className="w-full pt-16 h-fit pb-10 bg-gray-100">
        <div className="w-[90%] mx-auto flex flex-col md:flex-row">
          <SwiperSlider productImg={product?.images} />
          <ProductDetails 
            product={product}
            userLogedIn={userLogedIn}
            loginUser={loginUser}
          />
        </div>

        <ProductComment 
          product={product}
          userLogedIn={userLogedIn}
          loginUser={loginUser}
        />
        
        <RelatedProduct 
          product={product}
        />
        
      </div>
    </div>
  );
}

export default ProductPage;
