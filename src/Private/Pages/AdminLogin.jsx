import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Hooks/UserContext";

function AdminLogin() {
  const {setAdminLogIn, setAdminUser} = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email : "",
    password : ""
  });
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetch("http://localhost:5001/adminData")
    .then((res)=>res.json())
    .then((data)=>{
      const admin = data.find(
        (user) =>
          user.adminEmail === formData.email && user.adminPassword === formData.password
      );

      if (admin) {
        setAdminLogIn(true);
        setAdminUser(admin)
        navigate("/dashboard")
      } else {
        alert("Your Email or Password is Incorrect!")
      }
    })
  };

  return (
    <div className='flex items-center justify-center w-full h-screen bg-gray-900'>
      <div className='w-1/3 h-fit px-5 py-8 rounded-sm bg-gray-700'>
        <h2 className='text-2xl mb-10 text-center'>Login Form</h2>
        <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="email"  // Correct name attribute
            placeholder='Admin Email' 
            className='px-3 py-2 rounded-sm outline-none' 
            onChange={handleChange} 
            value={formData.username}
          />
          <input 
            type="password" 
            name="password"  // Correct name attribute
            placeholder='Password' 
            className='px-3 py-2 rounded-sm outline-none' 
            onChange={handleChange} 
            value={formData.password}
          />
          <input 
            type="submit" 
            value="Login" 
            className='bg-[#C74D4D] dark:bg-[#FFC107] text-black px-3 py-2 cursor-pointer rounded-sm'
          />
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
