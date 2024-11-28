import SettingSection from "./SettingSection";
import { User } from "lucide-react";
import { useContext, useRef, useState } from "react";

import { UserContext } from "../../../Hooks/UserContext";

const AdminProfile = () => {
  const {adminUser, setAdminUser} = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [img, setImg] = useState(null);
  const [formState, setFormState] = useState({ ...adminUser });
  const inputFile = useRef(null);
  const handleImgChange = (e) => {
    const file = e.target.files[0];
    console.log(file)
    setImg(file);
    setPreview(URL.createObjectURL(file));
    setIsEditing(true);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };
  const handleSave = () => {
    // const formData = new FormData();
    // formData.append('image', img);
    // const apiKey = 'de8324250d0b85384622d76aa6c1076b';
    
    // fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    //   method: 'POST',
    //   body: formData,
    // })
    // .then(res => res.json())
    // .then(result => {
    //   const imageUrl = result.data.url;
    //     setAdminUser(prev => ({ ...prev, userProfilePic: imageUrl }));
    //     return fetch(`http://localhost:5001/adminData/${adminUser.adminId}`, {
    //       method: 'PUT',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ userProfilePic: imageUrl}),
    //     });
    // })
            
    setAdminUser(formState); 
    setIsEditing(false);
  };
  const handleCancel = () => {
    setFormState({ ...adminUser });
    setPreview(null);
    setImg(null);
    setIsEditing(false);
  };
	return (
		<SettingSection icon={User} title={"Admin"}>
			<div className="flex gap-10">
        <div className="">
          <div className="w-36 h-36 flex justify-center items-center overflow-hidden border border-gray-600 rounded-md">
            <img
                src={preview || adminUser.profileImg || "https://i.ibb.co.com/yWLz2bS/people.png"}
                alt="Profile"
                className="object-cover w-full h-full"
                loading="lazy"
                onClick={() => inputFile.current.click()}
            />
          </div>
          <input type="file" onChange={handleImgChange} ref={inputFile} className="hidden"/>  
        </div>
        <div className="flex flex-col gap-1">
          {['adminName', 'adminPhone', 'adminEmail'].map((field, idx) => (
            <label key={idx} className="text-gray-600 flex items-center gap-2 mb-1 w-full justify-between">
                  <span className="capitalize">{field.replace("admin", "")}:</span>
                  <input
                      type="text"
                      name={field}
                      value={formState[field] || ""}
                      className={`bg-transparent outline-none px-2 py-1 w-full ${isEditing? 'border border-gray-700': 'border-none' } `}
                      readOnly={!isEditing}
                      onChange={handleInputChange}
                  />
              </label>
          ))}
          <div className="flex gap-3 mt-4">
              <button className="px-3 py-1 rounded-md bg-blue-600 font-bold" onClick={()=>setIsEditing(true)}>Edit</button>
              {
                isEditing ? 
                <>
                  <button className="px-3 py-1 rounded-md bg-green-600 font-bold" onClick={handleSave}>Save</button>
                  <button className="px-3 py-1 rounded-md bg-red-600 font-bold" onClick={handleCancel}>Cancel</button>
                </>
                :
                ""
              }
          </div>
        </div>
      </div>
		</SettingSection>
	);
};
export default AdminProfile;
