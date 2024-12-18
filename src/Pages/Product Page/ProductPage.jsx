import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronUp, ChevronDown } from 'lucide-react';
import useFetch from '../../Hooks/UseFetch';
import SwiperSlider from '../../Components/product_img_slider/SwiperSlider';
import { UserContext } from '../../Hooks/UserContext';
import { FaStar } from 'react-icons/fa';
import Avatar from '@mui/material/Avatar';
import { IoIosSend } from "react-icons/io";
import { useFormik } from 'formik';
import { BsThreeDotsVertical } from "react-icons/bs";
import { Menu, MenuItem } from '@mui/material';

function ProductPage() {
  const {loginUser, userLogedIn} = useContext(UserContext);
  const navigate = useNavigate()
  const { id } = useParams();
  const { data: product } = useFetch(`http://localhost:5001/productInfo/${id}`);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const userId = loginUser?.id;
  const [comments, setComments] = useState([])
  const [commentAnchorEl, setCommentAnchorEl] = useState(null);

    const handleCommentNavOpen = (event) => {
      setCommentAnchorEl(event.currentTarget);
    }

    const handleCommentNavClose = () => {
      setCommentAnchorEl(null)
    };
  const formik = useFormik({
    initialValues: {
      
      comments: '',
      
    },
    onSubmit: (values, { resetForm }) => {
      
      const payload = {
        ...values, 
        userId: loginUser?.id,
        userImage: loginUser?.userProfilePic,
        userName: loginUser?.userName,
        productId: product?.id,
      }
      console.log(payload)
      fetch('http://localhost:5001/userComments', {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify(payload),
      })
      
      resetForm();
    },
  })
  const handleIncreaseQuantity = () => {
    if (currentColor && quantity < currentColor.stock) {
      setQuantity(quantity + 1);
    } else {
      alert(`No more products currently available in stock. Current stock: ${currentColor.stock}`);
    }
  };
  const handleDecreaseQuantity = () => {
    setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1)); // Prevent going below 1
  };

  const handleAddToCard = async ()=>{
    if (quantity <= currentColor.stock) {
      const cartItem = {
        productId: product.id,
        productName: product.productName,
        variantType: selectedVariant?.type,
        color: selectedColor,
        quantity,
        price: selectedVariant?.discount
          ? selectedVariant.price - selectedVariant.discountAmount
          : selectedVariant?.price,
        userId,
        image: product.images[0]
      };
      try {
        const response = await fetch("http://localhost:5001/userCart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(cartItem)
        });

        if (response.ok) {
          alert("Product added to cart!");
        } else {
          alert("Failed to add product to cart.");
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
    else{
      alert(`Can not order ${quantity} product. We have only ${currentColor.stock} product in our Stock.`)
    }
  }

  const currentVariant = product?.variants?.find(
    (variant) => variant.type === selectedVariant.type
  );
  const currentColor = currentVariant?.colors?.find(
    (color) => color.color === selectedColor
  );

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
  
      if (product.variants[0].colors && product.variants[0].colors.length > 0) {
        setSelectedColor(product.variants[0].colors[0].color);
      }
    }
  }, [product]);


  useEffect(() => {
    const fetchRelatedProducts = () => {
      if (product) {
        fetch(`http://localhost:5001/productInfo`)
        .then((res)=>res.json())
        .then(data => {
          const  filterRelatedProduct = data.filter(item => item.subCategory[0] === product?.subCategory[0] && item.id !== product.id);
          setRelatedProducts(filterRelatedProduct);
        });
      }
    };
    fetchRelatedProducts();
  }, [product]);

  useEffect(()=>{
    
      fetch('http://localhost:5001/userComments')
    .then((res)=>res.json())
    .then((data)=>{
      const filterComments = data.filter((comment)=> comment.productId === product.id)
      if(filterComments.length>0){
        setComments(filterComments)
      }else{
        setComments([])
      }
    })
  }, [product.id])
console.log(comments)
  return (
    <div className="w-full">
      <div className="w-full pt-16 h-fit pb-10 bg-gray-100">
        <div className="w-[90%] mx-auto flex flex-col md:flex-row">
          <SwiperSlider product={product} />
          <div className=" mt-5 md:mt-0 md:pl-10">
            <h2 className="text-4xl font-sans font-medium leading-relaxed">
              {product?.productName}
            </h2>

            <div className="flex flex-wrap gap-3 pb-7">
              <div className="flex gap-1 items-center px-5 py-1 rounded-full bg-gray-300 w-fit">
                <h3 className="text-sm text-gray-700">Price:</h3>
                <span className="text-sm font-semibold">
                  {selectedVariant?.price - selectedVariant?.discountAmount}
                </span>
              </div>
              <div className="flex gap-1 items-center px-5 py-1 rounded-full bg-gray-300 w-fit">
                <h3 className="text-sm text-gray-700">Regular Price:</h3>
                <span className="text-sm font-semibold">
                  {selectedVariant?.price}
                </span>
              </div>
              <div className="flex gap-1 items-center px-5 py-1 rounded-full bg-gray-300 w-fit">
                <h3 className="text-sm text-gray-700">Stock:</h3>
                <span className="text-sm font-semibold">
                {currentColor ? currentColor.stock : 'Loading...'}
                </span>
              </div>
              <div className="flex gap-1 items-center px-5 py-1 rounded-full bg-gray-300 w-fit">
                <h3 className="text-sm text-gray-700">Product Code:</h3>
                <span className="text-sm font-semibold">{product?.productCode}</span>
              </div>
              <div className="flex gap-1 items-center px-5 py-1 rounded-full bg-gray-300 w-fit">
                <h3 className="text-sm text-gray-700">Brand:</h3>
                <span className="text-sm font-semibold">{product?.brand}</span>
              </div>
            </div>

            {/* Variant Selection */}
            <div className="flex gap-5 mb-7">
              {product?.variants?.map(
                (variant, index) =>
                  variant?.typeStatus && variant?.type && (
                    <button
                      key={index}
                      className={`uppercase text-sm px-3 py-1 border ${
                        selectedVariant?.type === variant.type
                          ? 'text-black border-[#1E90FF] rounded-md'
                          : ''
                      }`}
                      onClick={() => setSelectedVariant(variant)}
                    >
                      {variant.type}
                    </button>
                  )
              )}
            </div>

            {/* Color Selection */}
            <div className="flex gap-5 mb-7">
              {currentVariant?.colors?.map((color, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 border rounded ${
                    selectedColor === color.color ? 'bg-blue-500 text-white' : ''
                  } ${
                    color.inStock
                      ? 'cursor-pointer'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  onClick={() => color.inStock && setSelectedColor(color.color)}
                  disabled={!color.inStock}
                >
                  {color.color}
                </button>
              ))}
            </div>

            <div className='mb-5'>
              <h3 className='text-lg font-mono'>Key Features :</h3>
              {product?.keyFeatures?.map((feature, index) => (
                <li key={index} className="list-none font-mono text-sm pb-1">
                  {feature}
                </li>
              ))}
            </div>

            {/* Quantity Selector */}
            <div className='flex justify-between items-center mb-3'>
              <span className='text-3xl font-semibold font-sens'>
                {selectedVariant?.discount
                  ? `${(
                      quantity *
                      (selectedVariant.price - selectedVariant.discountAmount)
                    ).toFixed(2)}`
                  : `${(quantity * selectedVariant?.price).toFixed(2)}`}
              </span>
              <div className="flex items-center gap-3 bg-white w-[80px] justify-around">
                <span className='text-xl font-medium'>{quantity}</span>
                <div>
                  <ChevronUp size={20} onClick={handleIncreaseQuantity} />
                  <ChevronDown size={20} onClick={handleDecreaseQuantity} />
                </div>
              </div>
              
            </div>

            {/* Add to Cart Button */}
            <button className={`px-5 py-2 rounded-md font-semibold uppercase text-sm ${currentColor && currentColor.stock > 0 ? 'bg-[#1E90FF] text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed' }`} onClick={handleAddToCard} disabled={!currentColor || currentColor.stock <= 0}>
              ADD TO CART
            </button>

            
          </div>
        </div>
        <div className='w-[90%] mx-auto mt-10'>
          <h2 className="text-2xl font-semibold mb-5">Comments</h2>
          <div className='flex items-center w-full md:w-2/3'>
            
            <Avatar 
              src={userLogedIn && loginUser?.userProfilePic}
              alt="User Profile" 
              className="cursor-pointer"
            />

            <form onSubmit={formik.handleSubmit} className="search relative w-full ml-5 md:ml-10">
              <input
                type="text"
                placeholder="Enter your comments..."
                name='comments'
                onChange={formik.handleChange}
                value={formik.values.comments}
                className="border border-black py-1 px-2 rounded-md outline-none w-full text-md"
              />
              <button type='submit' className="searchIcon flex gap-2 absolute right-3 top-1/2 -translate-y-1/2">
                <IoIosSend className="cursor-pointer text-xl" />
              </button>
            </form>
            
          </div>
          <div className='ml-16 mt-10'>
            {
              comments?.map((comment)=>( 
                <div className='flex items-start justify-between w-full md:w-2/3 mb-7' key={comment.id}>
                  <div className='flex items-start '>
                    <img 
                      src={comment.userImage}
                      alt="User Profile" 
                      className="cursor-pointer h-8 w-8 rounded-full !important"
                    />
                    <div className='ml-5'>
                      <h2 className='font-semibold font-sans text-lg'>{comment.userName}</h2>
                      <h3 className='font-medium text-base capitalize text-gray-700'>{comment.comments}</h3>
                    </div>
                  </div>
                  {
                    loginUser ? 
                    (
                      <div>
                        <button className='p-1 text-base text-gray-700' onClick={handleCommentNavOpen}><BsThreeDotsVertical /></button>
                        {
                          loginUser?.id === comment?.userId ? (
                            <Menu
                              anchorEl={commentAnchorEl}
                              open={Boolean(commentAnchorEl)}
                              onClose={handleCommentNavClose}
                              anchorOrigin={{
                                  vertical: 'bottom',
                                  horizontal: 'right',
                              }}
                              transformOrigin={{
                                  vertical: 'top',
                                  horizontal: 'right',
                              }}
                              className="mt-5"
                            >
                              <MenuItem >Edit</MenuItem>
                              <MenuItem >Delete</MenuItem>
                              <MenuItem >Reply</MenuItem>
                            </Menu>
                          ) : (
                            <Menu
                              anchorEl={commentAnchorEl}
                              open={Boolean(commentAnchorEl)}
                              onClose={handleCommentNavClose}
                              anchorOrigin={{
                                  vertical: 'bottom',
                                  horizontal: 'right',
                              }}
                              transformOrigin={{
                                  vertical: 'top',
                                  horizontal: 'right',
                              }}
                              className="mt-5"
                            >
                              <MenuItem >Reply</MenuItem>
                            </Menu>
                            
                          )
                        }
                        
                      </div>
                    )
                    :
                    ""
                  }
                  
                  
                </div>
                
              ))
            }
          </div>
        </div>
        <div className='w-[90%] mx-auto mt-10'>
          <h2 className="text-2xl font-semibold mb-5">Related Products</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {
              relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className='border mb-4 rounded-md overflow-hidden bg-[#F5F5F5]' onClick={() => navigate(`/product/${relatedProduct.id}`)}>
                    <div className='w-full h-[220px] flex justify-center items-center'>
                      <img src={relatedProduct.images[0]} alt='' className='h-[180px]' />
                    </div>
                    <div className='px-4 pb-5 pt-2'>
                      <div className='mb-3'>
                        {relatedProduct?.subCategory?.map((subCategoryitem, index) => (
                          <span key={index} className='pr-2 uppercase text-xs'>
                            {subCategoryitem}
                          </span>
                        ))}
                      </div>
                      <h3 className='font-semibold text-[14px] h-12 leading-5'>
                        {relatedProduct?.productName}
                      </h3>
                      <p className='text-[14px] font-bold'>
                        <strong>Price: </strong>${relatedProduct?.variants[0].price}
                      </p>
                      <div className='flex justify-between'>
                        <p className='text-[14px] flex gap-2 items-center'>
                          <span>
                            <FaStar className='text-yellow-500' />
                          </span>
                          {relatedProduct?.rating}
                        </p>
                        <p className='text-[14px]'>({relatedProduct?.variants[0]?.colors[0]?.sold})</p>
                      </div>
                    </div>
                </div>
              ))
            }
            </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
