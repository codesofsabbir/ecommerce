import { useContext, useState } from "react"
import { UserContext } from "../../Hooks/UserContext"

function ProfilePage() {
  const {loginUser} = useContext(UserContext)
  const [userEdit, setUserEdit] = useState(false)
  const handleUserEditSave = () => {
    setUserEdit(false)
  }
  return (
    <div className="w-full">
      <div className="w-[90%] mx-auto py-10">
        <div className="flex w-full gap-20">
          <img src={loginUser.userProfilePic} alt="" className="h-[200px]"/>
          <div className="w-2/3">
            <div className="w-2/3">
              <label className="text-2xl font-semibold text-gray-600 flex items-center gap-2 mb-1 w-full justify-between">
                <h3>Name: </h3>
                <input type="text" name="" id="" value={loginUser.userName} className={`bg-transparent outline-none py-1 px-2 w-full ${userEdit ? 'border border-gray-500 rounded-md ': 'border-none cursor-default'}`} readOnly={!userEdit} />
              </label>
              <label className="text-md font-bold text-gray-500 flex items-center gap-2 mb-1 w-full justify-between">
                <h3>Phone: </h3>
                <input type="text" name="" id="" value={loginUser.userPhone} className={`bg-transparent outline-none py-1 px-2 w-full ${userEdit ? 'border border-gray-500 rounded-md ': 'border-none cursor-default'}`} readOnly={!userEdit} />
              </label>
              <label className="text-gray-500 flex items-center gap-2 mb-1 w-full justify-between">
                <h3>Address: </h3>
                <input type="text" name="" id="" value={loginUser.userAddress} className={`bg-transparent outline-none py-1 px-2 w-full ${userEdit ? 'border border-gray-500 rounded-md ': 'border-none cursor-default'}`} readOnly={!userEdit} />
              </label>
              <div className="flex gap-3 mt-4">
                {
                  userEdit ? 
                  <button className="px-3 py-1 bg-blue-600 rounded-md text-sm font-semibold text-white" onClick={handleUserEditSave}>Save</button> 
                  : 
                  <button className="px-3 py-1 bg-blue-600 rounded-md text-sm font-semibold text-white" onClick={()=>{setUserEdit(true)}}>Edit</button>
                }
                {
                  userEdit ? <button className="px-3 py-1 bg-red-600 rounded-md text-sm font-semibold text-white" onClick={()=>{setUserEdit(false)}}>Cancel</button> : ""
                }
              </div>
            </div>
            <div className="w-fit">
              <h2 className="text-3xl font-semibold text-gray-600 mt-10">Change Password : </h2>
              <label className="text-md font-semibold text-gray-600 flex items-center gap-2 mb-1 w-full justify-between">
                <h3>Current Password: </h3>
                <input type="password" name="" id=""  className={`bg-transparent outline-none py-1 px-2 border border-gray-500 rounded-md`} />
              </label>
              <label className="text-md font-semibold text-gray-600 flex items-center gap-2 mb-1 w-full justify-between">
                <h3>New Password: </h3>
                <input type="password" name="" id=""  className={`bg-transparent outline-none py-1 px-2 border border-gray-500 rounded-md`} />
              </label>
              <label className="text-md font-semibold text-gray-600 flex items-center gap-2 mb-1 w-full justify-between">
                <h3>Confirm Password: </h3>
                <input type="password" name="" id=""  className={`bg-transparent outline-none py-1 px-2 border border-gray-500 rounded-md`} />
              </label>
            </div>
            <div className="mt-10">
              <button className="px-3 py-2 bg-red-600 rounded-md text-lg font-semibold text-white">Delete Account</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProfilePage