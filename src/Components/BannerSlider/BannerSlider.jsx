import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import useAxios from '../../Hooks/useAxios';

function BannerSlider() {
    const { data: sliderImages = [], error, loading } = useAxios('http://localhost:5001/banner');
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading data: {error.message}</p>;
    if (sliderImages.length === 0) return <p>No images available</p>;

    return (
        <div className="w-full">
            <div className="w-[90%] mx-auto">
                <Swiper
                    spaceBetween={0}
                    slidesPerView={1}
                    autoplay={{ delay: 5000 }}
                    speed={2000}
                    loop={true}
                    modules={[Autoplay]}
                >
                    {sliderImages.map((sliderImg, index) => (
                        <SwiperSlide key={index} className="w-full h-full">
                            <img
                                src={sliderImg}
                                alt={`Slide ${index + 1}`}
                                className="object-cover w-full h-[100px] md:h-[300px] mt-10"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}

export default BannerSlider;
