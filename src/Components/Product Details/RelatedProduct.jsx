/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useAxios from '../../Hooks/useAxios';
const summarizeTitle = (title) => {
    const words = title.split(' ');
    return words.length > 11 ? words.slice(0, 11).join(' ') + ' ...' : title;
  };
function RelatedProduct({product}) {
const navigate = useNavigate()
const { data: allProducts } = useAxios(`http://localhost:5001/productsInfo`);
const [relatedProducts, setRelatedProducts] = useState([]);
useEffect(() => {
    if (allProducts?.length > 0 && product?.subCategory?.[0]) {
        const  filterRelatedProduct = allProducts.filter(singleProduct => singleProduct?.subCategory[0] === product?.subCategory[0] && singleProduct.id !== product.id);
        setRelatedProducts(filterRelatedProduct);
    };
}, [product, allProducts]);
  return (
    <div className='w-[90%] mx-auto mt-10 border border-gray-300 rounded-lg p-10'>
          <h2 className="text-2xl font-semibold mb-5">Related Products</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {
              relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className='border mb-4 rounded-md overflow-hidden bg-[#F5F5F5]' onClick={() => navigate(`/product/${relatedProduct.id}`)}>
                    <div className='w-full h-[220px] flex justify-center items-center'>
                      <img src={relatedProduct.images[0]} alt='' loading='lazy' className='h-[180px] aspect-auto' />
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
                        {summarizeTitle(relatedProduct?.productName)}
                      </h3>
                      <p className='text-[16px] py-2'>
                        <strong>Price: {relatedProduct?.productPrice} tk</strong>
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
  )
}

export default RelatedProduct