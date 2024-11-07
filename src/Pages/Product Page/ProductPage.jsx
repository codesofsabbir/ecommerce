import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronUp, ChevronDown } from 'lucide-react';
import useFetch from '../../Hooks/UseFetch';
import SwiperSlider from '../../Components/product_img_slider/SwiperSlider';
import { UserContext } from '../../Hooks/UserContext';

function ProductPage() {
  const {loginUser} = useContext(UserContext);
  const { id } = useParams();
  const { data: product } = useFetch(`http://localhost:5001/productInfo/${id}`);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  console.log(loginUser.id)

  const userId = loginUser.id;

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

  return (
    <div className="w-full">
      <div className="w-full pt-16 h-screen bg-gray-100">
        <div className="w-[90%] mx-auto flex">
          <SwiperSlider product={product} />
          <div className="pl-10">
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
      </div>
    </div>
  );
}

export default ProductPage;
