/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom';

function UserLoginButton({handleUserLoginBox}) {
  const navigate = useNavigate()
  
  return (
    <div className='py-3 w-fit h-fit bg-[#0a66c2] rounded-md text-sm text-gray-200 absolute z-10 top-full right-0 !important mt-4'>

        <ul className='capitalize'>
            <li className='flex gap-2 items-center px-5 py-1 cursor-pointer hover:bg-[rgba(0,0,0,.3)]' onClick={()=>{handleUserLoginBox(false)
            navigate('login')}}>login</li>
            <li className='flex gap-2 items-center px-5 py-1 cursor-pointer hover:bg-[rgba(0,0,0,.3)]' onClick={()=>{handleUserLoginBox(false)
            navigate('sign-up')}}> 
              signup
            </li>
        </ul>
    </div>
  )
}

export default UserLoginButton