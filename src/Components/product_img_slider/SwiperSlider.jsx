/* eslint-disable react/prop-types */
import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
function SwiperSlider({productImg}) {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div className="md:w-[35%]">
        <Swiper
            style={{
                '--swiper-navigation-color': '#fff',
                '--swiper-pagination-color': '#fff',
                }}
                spaceBetween={10}
                navigation={false}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper:null}}
                modules={[FreeMode, Navigation, Thumbs]}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        >
            {productImg?.map((image, index) => (
                <SwiperSlide key={index} className=''>
                    <img src={image} className="w-full h-[400px] object-cover" />
                </SwiperSlide>
            ))}
        </Swiper>
        <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={20}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="mt-4"
        >
            {productImg?.map((image, index) => (
                <SwiperSlide key={index} className=''>
                    <img src={image} className={`object-cover md:h-[100px] w-full ${index === activeIndex ? 'border-4 border-[#1E90FF]': ''}`} />
                </SwiperSlide>
            ))}
        </Swiper>
    </div>
  )
}

export default SwiperSlider