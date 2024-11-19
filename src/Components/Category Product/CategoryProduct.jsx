import { useEffect, useRef, useState } from "react"
import PropTypes from "prop-types";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import "swiper/css/grid";
import { Grid } from "swiper/modules";
import SliderButton from "../SliderButton/SliderButton";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import useAxios from "../../Hooks/useAxios";
CategoryProduct.propTypes = {
    categoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
const summarizeTitle = (title) => {
    const words = title.split(' ');
    return words.length > 11 ? words.slice(0, 11).join(' ') + ' ...' : title;
};
function CategoryProduct({categoryId}) {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const swiperRef = useRef(null)
    const navigate = useNavigate()

    const {data: categories=[], error: categoryError, loading: categoryLoading} = useAxios("http://localhost:5001/categories");
    const {data: productData=[], error: productError, loading: productLoading} = useAxios("http://localhost:5001/productsInfo");

    useEffect(() => {
        if (productData && categories && categories[categoryId]) {
            const categoryName = categories[categoryId].name.toLowerCase().trim()
            const filtered = productData.filter((product) =>
                product.category.toLowerCase().trim().includes(categoryName)
            );
            setFilteredProducts(filtered);
        }
    }, [productData, categories, categoryId]);

    if (categoryLoading || productLoading) return <p>Loading...</p>;
    if (categoryError || productError) return <p>Error: {categoryError || productError}</p>;

    if (!categories[categoryId]) {
        return <div>No category found or loading...</div>;
    }
    
  return (
    <div className="w-full mt-10">
        <div className="w-[90%] mx-auto">
            <div className="mb-5 flex justify-between items-center">
                <div>
                    <h2 className="text-xl md:text-3xl uppercase font-semibold text-[#0A66C2]">{categories[categoryId].name}</h2>
                    <span className="text-xs md:text-[14px] text-gray-500">{categories[categoryId].tagline}</span>
                </div>
                <SliderButton swiperRef={swiperRef}/>
            </div>
            <Swiper
                modules={[Grid]}
                spaceBetween={20}
                autoplay={{
                    delay: 5000,
                }}
                grid={{
                    rows: 2,
                    fill: 'row',
                }}
                breakpoints={{
                    320: {
                        slidesPerView: 1, 
                    },
                    480: {
                        slidesPerView: 2, 
                    },
                    768: {
                        slidesPerView: 3, 
                    },
                    1024: {
                        slidesPerView: 4,
                    },
                }}
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
            >
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <SwiperSlide key={product.id} className="border mb-4 rounded-md overflow-hidden bg-[#F5F5F5]" onClick={() => navigate(`/product/${product.id}`)}>
                            <div className="w-full h-[220px] flex justify-center items-center">
                                <img src={product.images[0]} alt={product.name} loading="lazy" className="h-[180px] aspect-auto" />
                            </div>

                            <div className="px-4 pb-5 pt-2">
                                <div className="mb-3">
                                    {product?.subCategory?.map((subCategoryitem, index) => (
                                        <span key={index} className="pr-2 uppercase text-xs">
                                            {subCategoryitem}
                                        </span>
                                    ))}
                                </div>
                                <h3 className="text-[15px] h-12 leading-5">{summarizeTitle(product?.productName)}</h3>
                                <p className="text-[16px] pb-2">
                                    <strong>Price: {product?.productPrice} tk</strong>
                                </p>
                                <div className="flex justify-between">
                                    <p className="text-[14px] flex gap-2 items-center">
                                        <span>
                                            <FaStar className="text-yellow-500" />
                                        </span>
                                        {product?.rating}
                                    </p>
                                    <p className="text-[14px]">
                                        ({product?.variants[0]?.colors[0]?.sold})
                                    </p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))
                ) : (
                    <div>No products found in this category.</div>
                )}
            </Swiper>
        </div>
    </div>
  )
}

export default CategoryProduct