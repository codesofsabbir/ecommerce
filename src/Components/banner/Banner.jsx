/* eslint-disable react/prop-types */
import useAxios from "../../Hooks/useAxios"

function Banner({bannerId}) {
    const {data : banner = [], error, loading} = useAxios('http://localhost:5001/banner')
    if(loading) return <p>Loading...</p>;
    if(error) return <p>Error loading data: {error.message}</p>;
  return (
    <div className='w-full mt-10'>
        <div className='w-[90%] mx-auto'>
            <div className='w-full h-[180ox]'>
                <img src={banner[bannerId]} alt="product banner" className='object-cover w-full h-[100px] md:h-[300px]' loading="lazy"/>
            </div>
        </div>
    </div>
  )
}

export default Banner