// import {useRef} from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
function BannerSlider() {
  return (
    <div className="w-full">
        <div className="w-[90%] mx-auto">
        <Swiper
            spaceBetween={0}
            slidesPerView={1}
            autoplay={{
                delay: 5000,
            }}
            speed={2000}
            loop={true}
            modules={[Autoplay]}
            // onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
        >
            <SwiperSlide className="w-full h-fit">
                <img src="https://i.ibb.co.com/syMqCrc/haircare.png" className="object-cover"/>
            </SwiperSlide>
            <SwiperSlide className="w-full h-fit">
                <img src="https://i.ibb.co.com/C9Grkpy/skincare.png" className="object-cover"/>
            </SwiperSlide>
            <SwiperSlide className="w-full h-fit">
                <img src="https://i.ibb.co.com/9T5MWdB/electronics.png" className="object-cover"/>    
            </SwiperSlide>
            <SwiperSlide className="w-full h-fit">
                <img src="https://i.ibb.co.com/Jrj7NTn/baby.gif" className="object-cover"/>
            </SwiperSlide>
        </Swiper>
        </div>
    </div>
  )
}

export default BannerSlider