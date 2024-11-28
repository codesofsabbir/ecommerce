import { Lock } from "lucide-react";
import SettingSection from "./SettingSection";
import { useContext, useState } from "react";
import { UserContext } from "../../../Hooks/UserContext";

const Security = () => {
	const {adminUser} = useContext(UserContext);
	const [passwords, setPasswords] = useState({
		oldPassword: '',
		confirmPassword: '',
		newPassword: ''
	})
	const [error, setError] = useState('');
  	const [success, setSuccess] = useState('');
	const handleChange = (e) => {
		const {name, value} = e.target;
		setPasswords((prev)=>({...prev, [name]: value}));
	}
	const handleSavePassword = async () => {
		const { oldPassword, confirmPassword, newPassword } = passwords;
	  
		// Validation checks
		if (!oldPassword || !confirmPassword || !newPassword) {
		  setError("All fields are required.");
		  return;
		}
	  
		if (oldPassword !== confirmPassword) {
		  setError("Your Current Password and Confirmation Password do not match!");
		  return;
		}
	  
		if (oldPassword === newPassword) {
		  setError("Your new password cannot be the same as the old password.");
		  return;
		}
	  
		if (oldPassword === adminUser.adminPassword) {
		  try {
			const response = await fetch(`http://localhost:5001/adminData/${adminUser.adminId}`, {
			  method: "PUT",
			  headers: {
				"Content-Type": "application/json",
			  },
			  body: JSON.stringify({
				adminPassword: newPassword,  // Only update the password
			  }),
			});
	  
			if (!response.ok) {
			  throw new Error("Failed to update the password. Please try again.");
			}
	  
			// Clear errors, show success message
			setError("");
			setSuccess("Password changed successfully!");
			setPasswords({ oldPassword: "", confirmPassword: "", newPassword: "" });
	  
		  } catch (error) {
			setError(error.message);  // Handle fetch errors
		  }
		} else {
		  setError("Incorrect current password.");
		}
	  };
	  

	return (
		<SettingSection icon={Lock} title={"Security"}>
			<div className="flex flex-col gap-2 ">
				<input type="password" name="oldPassword" value={passwords.oldPassword} onChange={handleChange} id="" placeholder="Old Password" className="py-1 px-2 border border-gray-500 rounded-md bg-transparent w-1/3 outline-none" />
				<input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handleChange} id="" placeholder="Confirm Password" className="py-1 px-2 border border-gray-500 rounded-md bg-transparent w-1/3 outline-none" />
				<input type="password" name="newPassword" value={passwords.newPassword} onChange={handleChange} id="" placeholder="New Password" className="py-1 px-2 border border-gray-500 rounded-md bg-transparent w-1/3 outline-none" />
			</div>
			{error || success}
			<div className='mt-4'>
				<button
					className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded 
        			transition duration-200' 
					onClick={handleSavePassword}
				>
					Change Password
				</button>
			</div>
		</SettingSection>
	);
};
export default Security;
