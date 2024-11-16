/* eslint-disable react/prop-types */
import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useNavigate } from 'react-router-dom';

function ComputerCategoryMenu({categories = []}) {
    const navigate = useNavigate()
    const [activeNav, setActiveNav] = useState(categories[0]?.id || null);
    const handleNavClick = (id) => setActiveNav(id);
    const getSubcategories = () => categories.find(category => category.id === activeNav)?.subcategories || [];
    
    return (
        <>
            <div className="md:flex justify-between my-5">
                {categories?.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => handleNavClick(category.id)}
                        className={`md:px-2 lg:px-5 py-1 md:text-sm lg:text-base rounded-full transition-all duration-300 font-semibold capitalize ${
                            activeNav === category.id ? 'bg-[#0A66C2] text-white' : 'hover:text-[#0A66C2]'
                        }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
            <Swiper
                spaceBetween={10}
                slidesPerView={4}
                loop={true}
                autoplay={{
                    delay: 5000,
                }}
            >
                {
                    getSubcategories().map(subcategory => {
                        const categoryPageURL = `/category/${encodeURIComponent(subcategory.name.trim().toLowerCase().replace(/\s+/g, '-'))}`
                        return(
                            <SwiperSlide key={subcategory.id} className="w-full h-[150px] px-5 py-3 flex justify-between cursor-pointer bg-[#E8F0FE] rounded-sm" onClick={() => navigate(categoryPageURL)}>
                                <div className="flex flex-col justify-between md:w-2/3 lg:w-1/2">
                                    <h2 className="text-sm lg:text-lg font-semibold font-serif text-[18px]">{subcategory.name}</h2>
                                    <h4 className="text-xs lg:text-sm text-gray-600 text-[12px]">{subcategory.punchline}</h4>
                                </div>
                                <div className="md:w-1/3 lg:w-1/2">
                                    <img src={subcategory.image} alt={subcategory?.name} className="w-full h-28 object-cover" loading='lazy'/>
                                </div>
                            </SwiperSlide>
                        )})
                }
                
            </Swiper>
        </>
        
  )
}

export default ComputerCategoryMenu