import { useEffect, useState } from 'react'
import PropTypes from "prop-types";

Banner.propTypes = {
    bannerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

function Banner({bannerId}) {
    const [banner, setBanner] = useState([])
    useEffect(()=>{
        fetch('http://localhost:5001/banner')
        .then((res)=>res.json())
        .then((data)=>{
            setBanner(data);
        })
    }, [setBanner])
  return (
    <div className='w-full mt-10'>
        <div className='w-[90%] mx-auto'>
            <div className='w-full h-[180ox]'>
                <img src={banner[bannerId]} alt="" className='h-full w-full object-cover'/>
            </div>
        </div>
    </div>
  )
}

export default Banner