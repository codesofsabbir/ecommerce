import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import useFetch from "../../Hooks/UseFetch";
import { useNavigate } from "react-router-dom";
function CategoryMenu() {
    const navigate = useNavigate()
    const [activeNav, setActiveNav] = useState(null);
    const {data} = useFetch("http://localhost:5001/categories");
    useEffect(() => {
        if (data && data.length > 0) {
            setActiveNav(data[0].id);
        }
    }, [data]);
    
    const handleNavClick = (id) => {
        setActiveNav(id);
    };

    return (
        <div className="w-full">
            <div className="w-[90%] mx-auto pt-10">
                <h2 className="uppercase text-xl font-semibold ">Popular Categories</h2>
                <div className="flex justify-between my-5">
                    {data?.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleNavClick(category.id)}
                            className={`px-5 py-1 rounded-full transition-all duration-300 font-semibold capitalize ${
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
                    // onSlideChange={() => console.log('slide change')}
                    // onSwiper={(swiper) => console.log(swiper)}
                >
                    {
                        data?.flatMap(category => 
                            category.id === activeNav ? category.subcategories : []
                        ).map(subcategory => (
                            <SwiperSlide key={subcategory.id} className="w-full h-[150px] px-5 py-3 flex justify-between cursor-pointer bg-[#E8F0FE] rounded-sm" onClick={() => navigate(`/category/${encodeURIComponent(subcategory.name.trim().toLowerCase().replace(/\s+/g, '-'))}`)}>
                                <div className="flex flex-col justify-between w-1/2">
                                    <h2 className="text-md font-semibold font-serif text-[18px]">{subcategory.name}</h2>
                                    <h4 className="text-sm text-gray-600 text-[12px]">{subcategory.punchline}</h4>
                                </div>
                                <div className="w-1/2">
                                    <img src={subcategory.image} alt="" className="object-cover"/>
                                </div>
                            </SwiperSlide>
                        ))
                    }
                    
                </Swiper>
            </div>
        </div>
    );
}

export default CategoryMenu;
