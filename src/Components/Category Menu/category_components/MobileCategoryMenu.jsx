/* eslint-disable react/prop-types */
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useNavigate } from 'react-router-dom';

function MobileCategoryMenu({categories = []}) {
    const navigate = useNavigate()
    return (
        <>
            <Swiper
                spaceBetween={10}
                slidesPerView={4}
            >
                {categories?.flatMap(category => 
                    category.subcategories.map(subcategory => {
                        const categoryPageURL = `/category/${encodeURIComponent(subcategory.name.trim().toLowerCase().replace(/\s+/g, '-'))}`
                        return(
                        <SwiperSlide key={subcategory.id} className="w-full h-[120px] px-5 py-3 flex justify-between cursor-pointer bg-[#E8F0FE] rounded-sm" onClick={() => navigate(categoryPageURL)}>
                            <div className="flex flex-col items-center gap-2 w-full">
                                <div className="w-12 h-12 rounded-full flex justify-center items-center overflow-hidden bg-blue-300">
                                    <img src={subcategory.image} alt={subcategory.name} className="w-12 h-12" loading='lazy'/>
                                </div>
                                <h2 className="text-xs font-semibold text-center">{subcategory.name}</h2>
                            </div>
                        </SwiperSlide>
                    )})
                )}
                
            </Swiper>
        </>
    )
}

export default MobileCategoryMenu