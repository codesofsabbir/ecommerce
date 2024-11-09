/* eslint-disable react/prop-types */
import {ChevronLeft, ChevronRight} from 'lucide-react'

function SliderButton({swiperRef}) {
    
    const handleNext = () => {
        if (swiperRef.current) swiperRef.current?.slideNext();
        console.log("next")
      };
    
      const handlePrev = () => {
        if (swiperRef.current) swiperRef.current?.slidePrev();
        console.log("prev")
      };
  return (
    <div className="flex gap-[1px]">
        <ChevronLeft className="md:w-9 md:h-9 bg-[#0A66C2] rounded-l-full cursor-pointer text-white shadow-md shadow-black" onClick={handlePrev} />
        <ChevronRight className="md:w-9 md:h-9 bg-[#0A66C2] rounded-r-full cursor-pointer text-white shadow-md shadow-black" onClick={handleNext} />
    </div>
  )
}

export default SliderButton