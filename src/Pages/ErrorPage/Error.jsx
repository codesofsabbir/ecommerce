import { MoveLeft } from 'lucide-react'
import errorImg from './img/error-404.png'
import { useNavigate } from 'react-router-dom'
function Error() {
    const navigate = useNavigate()
  return (
    <div className='w-full '>
        <div className='w-[90%] mx-auto'>
            <div className="flex flex-col items-center py-20">
                <img src={errorImg} alt="" className='h-64 w-fit'/>
                <h2 className='tracking-wider text-[22px] font-thin text-gray-600'>The page you`re looking for doesn`t exist or has been moved</h2>
                <button className="px-3 md:px-5 py-1 md:py-2 bg-[#007BFF] rounded-full text-white text-xs flex gap-2 items-center cursor-pointer mt-10" onClick={()=>{navigate('/')}}>
                    <MoveLeft size={20} />Back to Home
                </button>
            </div>
        </div>
    </div>
  )
}

export default Error