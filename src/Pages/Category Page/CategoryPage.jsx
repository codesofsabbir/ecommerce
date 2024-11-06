import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../Hooks/UseFetch';
import { FaStar } from 'react-icons/fa';
import PriceRange from '../../Components/Category Product/PriceRange';

function convertToTitleCase(str) {
  return str.split('-').join(' ');
}

function CategoryPage() {
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 }); // Default min is 0, max will be set later
  const { data: productInfo = [] } = useFetch('http://localhost:5001/productInfo');
  const { categoryName } = useParams();
  const normalizedCategory = categoryName?.toLowerCase().trim();
  const displayName = convertToTitleCase(categoryName);

  // Filter products based on category
  const filtered = useMemo(() => {
    if (productInfo && normalizedCategory) {
      return productInfo.filter((product) =>
        product?.subCategory.some((subItem) =>
          subItem.toLowerCase().trim().replace(/\s+/g, '-').includes(normalizedCategory)
        )
      );
    }
    return [];
  }, [productInfo, normalizedCategory]);

  // Set the filtered products and determine the max price when `filtered` changes
  useEffect(() => {
    setFilteredProducts(filtered);

    // Set the max price based on the filtered products
    if (filtered.length > 0) {
      const prices = filtered.map(product => product.variants[0]?.price);
      const maxPrice = Math.max(...prices);
      setPriceRange({ min: 0, max: maxPrice }); // Set min to 0 and max to the highest price
    } else {
      setPriceRange({ min: 0, max: 0 }); // Reset if no products
    }
  }, [filtered]);

  // Handle brand selection
  const handleBrandSelection = (brand) => {
    setSelectedBrands((prevSelected) =>
      prevSelected.includes(brand)
        ? prevSelected.filter((b) => b !== brand) // Remove brand if already selected
        : [...prevSelected, brand] // Add brand if not selected
    );
  };

  // Filter products by selected brands
  const brandFilteredProducts = useMemo(() => {
    if (selectedBrands.length === 0) return filteredProducts; // Show all if no brand selected
    return filteredProducts.filter((product) => selectedBrands.includes(product.brand));
  }, [filteredProducts, selectedBrands]);

  // Filter products by price range
  const priceFilteredProducts = useMemo(() => {
    return brandFilteredProducts.filter((product) => {
      const productPrice = product.variants[0]?.price; // Assuming you want to filter by the first variant's price
      return productPrice >= priceRange.min && productPrice <= priceRange.max;
    });
  }, [brandFilteredProducts, priceRange]);

  return (
    <div className='w-full'>
      <div className='w-[90%] mx-auto'>
        <div className='w-full flex gap-10'>
          <div className='w-1/4'>
            <h2 className='text-lg font-semibold text-gray-700 mb-2'>Select Price Range</h2>
            <PriceRange
              minPrice={priceRange.min}
              maxPrice={priceRange.max}
              setPriceRange={setPriceRange}
              className="w-full"
            />
            <div className='mt-5'>
              <h2 className='text-lg font-semibold text-gray-700 mb-2'>Select Brand</h2>
              {filteredProducts
                .filter(
                  (product, index, self) =>
                    index === self.findIndex((p) => p.brand === product.brand)
                )
                .map((uniqueProduct, index) => (
                  <div key={index} className='flex gap-3 items-center'>
                    <input
                      type='checkbox'
                      value={uniqueProduct.brand}
                      onChange={() => handleBrandSelection(uniqueProduct.brand)}
                      checked={selectedBrands.includes(uniqueProduct.brand)}
                    />
                    <li className='list-none text-md font-sans font-semibold text-gray-500'>{uniqueProduct.brand}</li>
                  </div>
                ))}
            </div>
          </div>
          <div className='w-3/4'>
            <div className='w-full h-16 flex items-center'>
              <h2 className='text-2xl font-semibold capitalize'>{displayName}</h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {priceFilteredProducts?.length > 0 ? (
                priceFilteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className='border mb-4 rounded-md overflow-hidden bg-[#F5F5F5]'
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className='w-full h-[220px] flex justify-center items-center'>
                      <img src={product.images[0]} alt='' className='h-[180px]' />
                    </div>
                    <div className='px-4 pb-5 pt-2'>
                      <div className='mb-3'>
                        {product?.subCategory?.map((subCategoryitem, index) => (
                          <span key={index} className='pr-2 uppercase text-xs'>
                            {subCategoryitem}
                          </span>
                        ))}
                      </div>
                      <h3 className='font-semibold text-[14px] h-12 leading-5'>
                        {product?.productName}
                      </h3>
                      <p className='text-[14px] font-bold'>
                        <strong>Price: </strong>${product?.variants[0].price}
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
