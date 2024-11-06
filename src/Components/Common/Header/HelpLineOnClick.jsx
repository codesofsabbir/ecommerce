/* eslint-disable react/prop-types */
import {Phone, CircleHelp} from 'lucide-react'
import { useNavigate } from 'react-router-dom';

function HelpLineOnClick({handleHelpLineClose}) {
  const navigate = useNavigate()
  
  return (
    <div className='py-3 w-fit h-fit bg-[#0a66c2] rounded-md text-sm text-gray-200 absolute z-10 top-full left-0 mt-4'>
        <ul className=''>
            <li className='flex gap-2 items-center px-5 py-1 cursor-pointer hover:bg-[rgba(0,0,0,.3)]' onClick={()=>{handleHelpLineClose(false)}}><Phone size={16}/> 01303142498</li>
            <li className='flex gap-2 items-center px-5 py-1 cursor-pointer hover:bg-[rgba(0,0,0,.3)]' onClick={()=>{
              handleHelpLineClose(false)
              navigate('help-center')
              }}>
              <CircleHelp size={16} /> Help center
            </li>
        </ul>
    </div>
  )
}

export default HelpLineOnClick