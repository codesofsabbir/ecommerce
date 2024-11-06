import { useContext } from "react"
import { Link } from "react-router-dom"
import { UserContext } from "../../../Hooks/UserContext"

function UserNavItem() {
  const {setUserLogedIn} = useContext(UserContext)
  return (
    <div className='py-3 w-fit h-fit bg-[#0a66c2] rounded-md text-sm text-gray-200 absolute z-10 top-full right-0 !important mt-4'>
  <ul className='w-fit capitalize'>
    <Link to={'user-profile'} className="">
      <h3 className="cursor-pointer hover:bg-[rgba(0,0,0,.3)] whitespace-nowrap px-5 py-1 text-md font-semibold">My Profile</h3>
    </Link>
    <Link to={'track-order'} className="">
      <h3 className="cursor-pointer hover:bg-[rgba(0,0,0,.3)] whitespace-nowrap px-5 py-1 text-md font-semibold">My Order</h3>
    </Link>
    <Link className="" onClick={()=>{setUserLogedIn(false)}}>
      <h3 className="cursor-pointer hover:bg-[rgba(0,0,0,.3)] whitespace-nowrap px-5 py-1 text-md font-semibold">Log Out</h3>
    </Link>
  </ul>
</div>

  )
}

export default UserNavItem