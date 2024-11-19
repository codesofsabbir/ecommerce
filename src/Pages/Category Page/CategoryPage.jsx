import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import PriceRange from '../../Components/Category Product/PriceRange';
import useAxios from '../../Hooks/useAxios';

const convertToTitleCase = (str) => str.replace(/-/g, ' ');
const summarizeTitle = (title) => {
  const words = title.split(' ');
  return words.length > 11 ? words.slice(0, 11).join(' ') + ' ...' : title;
};

function CategoryPage() {
  const navigate = useNavigate();
  const { categoryName } = useParams();
  const { data: productInfo = [], error, loading } = useAxios('http://localhost:5001/productsInfo');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const normalizedCategory = categoryName?.toLowerCase().trim();
  const displayName = convertToTitleCase(categoryName);

  const filteredProducts = useMemo(() => {
    if (!productInfo || !normalizedCategory) return []; 
      return productInfo.filter((product) =>
        product?.subCategory.some((subItem) =>
          subItem.toLowerCase().trim().replace(/\s+/g, '-').includes(normalizedCategory)
        )
      );
  }, [productInfo, normalizedCategory]);

  useEffect(() => {
    if (filteredProducts.length) {
      const maxPrice = Math.max(...filteredProducts.map((p) => p.productPrice));
      setPriceRange({ min: 0, max: maxPrice }); 
    } else {
      setPriceRange({ min: 0, max: 0 });
    }
  }, [filteredProducts]);

  const handleBrandSelection = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const displayedProducts = useMemo(()=>{
    return filteredProducts
    .filter((product)=> selectedBrands.length ? selectedBrands.includes(product.brand) : true)
    .filter((product)=> product.productPrice >= priceRange.min && product.productPrice <= priceRange.max);
  }, [filteredProducts, selectedBrands, priceRange]);

  const uniqueBrands = [...new Set(filteredProducts.map((p)=> p.brand))];

  if(error) return <p>{error}</p>
  if(loading) return <p>Loading...</p>

  return (
    <div className='w-full'>
      <div className='w-[90%] mx-auto'>
        <div className='w-full flex flex-col md:flex-row gap-10'>
          <div className='md:w-1/4'>
            <h2 className='text-lg font-semibold text-gray-700 mb-2'>Select Price Range</h2>
            <PriceRange
              minPrice={priceRange.min}
              maxPrice={priceRange.max}
              setPriceRange={setPriceRange}
              className="w-full"
            />
            <div className='mt-5'>
              <h2 className='text-lg font-semibold text-gray-700 mb-2'>Select Brand</h2>
              {uniqueBrands.map((brand) => (
                  <div key={brand} className='flex gap-3 items-center'>
                    <input
                      type='checkbox'
                      value={brand}
                      onChange={() => handleBrandSelection(brand)}
                      checked={selectedBrands.includes(brand)}
                    />
                    <span className='list-none text-md font-sans font-semibold text-gray-500'>{brand}</span>
                  </div>
                ))}
            </div>
          </div>
          <div className='md:w-3/4'>
            <div className='w-full h-16 flex items-center'>
              <h2 className='text-2xl font-semibold capitalize'>{displayName}</h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {displayedProducts?.length > 0 ? (
                displayedProducts.map((product) => (
                  <div
                    key={product.id}
                    className='border mb-4 rounded-md overflow-hidden bg-[#F5F5F5]'
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className='w-full h-[220px] flex justify-center items-center'>
                      <img src={product.images[0]} alt='' className='h-[180px] aspect-auto' loading='lazy'/>
                    </div>
                    <div className='px-4 pb-5 pt-2'>
                      <div className='mb-3'>
                        {product?.subCategory?.map((subCategoryitem, index) => (
                          <span key={index} className='pr-2 uppercase text-xs'>
                            {subCategoryitem}
                          </span>
                        ))}
                      </div>
                      <h3 className='font-regular text-[15px] h-12 leading-5'>
                        {summarizeTitle(product?.productName)}
                      </h3>
                      <p className='text-[16px] pb-2'>
                        <strong>Price: {product?.productPrice} tk</strong>
                      </p>
                      <div className='flex justify-between'>
                        <p className='text-[14px] flex gap-2 items-center'>
                          <span>
                            <FaStar className='text-yellow-500' />
                          </span>
                          {product?.rating}
                        </p>
                        <p className='text-[14px]'>({product?.variants[0]?.colors[0]?.sold})</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No products found for this category.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
