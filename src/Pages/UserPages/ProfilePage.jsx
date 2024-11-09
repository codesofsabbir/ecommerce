import { useContext, useRef, useState } from "react";
import { UserContext } from "../../Hooks/UserContext";
import { Button } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const navigate = useNavigate()
  const { loginUser, setLoginUser, setUserLogedIn } = useContext(UserContext);

  const [editableData, setEditableData] = useState({
    userName: loginUser.userName,
    userPhone: loginUser.userPhone,
    userAddress: loginUser.userAddress,
    userProfilePic: loginUser.userProfilePic,
    
  });

  const [isEditing, setIsEditing] = useState(false);
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState(null);
  const inputFile = useRef(null);

  const toggleEditing = () => setIsEditing(!isEditing);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    setImg(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    console.log('clicked')
    setLoginUser(prev => ({ ...prev, ...editableData }));
    console.log(loginUser)
    fetch(`http://localhost:5001/usersInfo/${loginUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editableData, userPassword: loginUser.userPassword }),
    })
      .then(res => res.json())
      .then(updatedData => {
        console.log("Data updated successfully:", updatedData);
        toggleEditing();
      })
      .catch(error => console.error("Error updating data:", error));
  };

  const passwordSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .required("Current password is required")
      .oneOf([loginUser.userPassword], "Current password is incorrect"),
    newPassword: Yup.string()
      .required("New password is required")
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: Yup.string()
      .required("Please confirm your new password")
      .oneOf([Yup.ref("newPassword")], "Passwords do not match"),
  });
  
  const handlePasswordChange = (values, { resetForm }) => {
    const updatedUser = { ...loginUser, userPassword: values.newPassword };

    fetch(`http://localhost:5001/usersInfo/${loginUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoginUser(updatedUser);
        resetForm();
        console.log("Password updated successfully:", data);
      })
      .catch((error) => console.error("Error updating password:", error));
  };

  const handleImgUpload = () => {
    if (!img) return;

    const formData = new FormData();
    formData.append('image', img);
    const apiKey = 'de8324250d0b85384622d76aa6c1076b';

    fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(result => {
        const imageUrl = result.data.url;
        // Update the local user profile pic URL and save it to the server immediately
        setEditableData(prev => ({ ...prev, userProfilePic: imageUrl }));
        setLoginUser(prev => ({ ...prev, userProfilePic: imageUrl }));

        return fetch(`http://localhost:5001/usersInfo/${loginUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...editableData, userProfilePic: imageUrl, userPassword: loginUser.userPassword }),
        });
      })
      .then(res => res.json())
      .then(updatedData => {
        console.log("Image updated successfully:", updatedData);
        setPreview(null); // Clear the preview after successful upload
      })
      .catch(error => console.error("Error uploading image:", error));
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      // Send DELETE request to delete the user from the JSON server
      fetch(`http://localhost:5001/usersInfo/${loginUser.id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            console.log("User deleted successfully");
            setLoginUser(null);
            setUserLogedIn(false)
            navigate('/')
          } else {
            console.error("Error deleting user");
          }
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
    }
  };

  return (
    <div className="w-full py-10">
      <div className="flex flex-col md:flex-row w-[90%] mx-auto gap-20">
        <div className="md:w-1/3">
          <img
            src={preview || editableData.userProfilePic || "https://i.ibb.co.com/yWLz2bS/people.png"}
            alt="Profile"
            className="h-[300px] w-full rounded-md object-cover object-top bg-gray-300"
          />
          <input type="file" onChange={handleImgChange} ref={inputFile} className="hidden" />
          <div className="flex mt-5 gap-2">
            <Button variant="contained" onClick={() => inputFile.current.click()}>
              {preview ? "Save Image" : "Change"}
            </Button>
            {preview && <Button variant="contained" color="success" onClick={handleImgUpload}>Upload</Button>}
            <Button variant="contained" color="error">Delete</Button>
          </div>
        </div>

        <div className="md:w-2/3">
          {['userName', 'userPhone', 'userAddress'].map((field, idx) => (
            <label key={idx} className="text-gray-600 flex items-center gap-2 mb-2 w-full justify-between">
              <span className="capitalize">{field.replace("user", "")}:</span>
              <input
                type="text"
                name={field}
                value={editableData[field]}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`bg-transparent outline-none py-1 px-2 w-full ${isEditing ? 'border border-gray-500 rounded-md' : 'border-none'}`}
              />
            </label>
          ))}
          <div className="flex gap-3 mt-4">
            <Button variant="contained" color="primary" onClick={isEditing ? handleSave : toggleEditing}>
              {isEditing ? "Save" : "Edit"}
            </Button>
            {isEditing && <Button variant="contained" color="secondary" onClick={toggleEditing}>Cancel</Button>}
          </div>

          <div className="mt-10">
            <h2 className="text-3xl font-semibold text-gray-600">Change Password:</h2>
            <Formik
              initialValues={{
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
              }}
              validationSchema={passwordSchema}
              onSubmit={handlePasswordChange}
            >
              {({ isSubmitting }) => (
                <Form className="w-1/2">
                  {["currentPassword", "newPassword", "confirmPassword"].map((passwordField, idx) => (
                    <div key={idx} className="mb-4">
                      <label className="text-gray-600 flex items-center gap-2 w-full justify-between">
                        <span className="capitalize w-fit">{passwordField.replace(/([A-Z])/, " $1")}:</span>
                        <Field
                          type="password"
                          name={passwordField}
                          className="bg-transparent outline-none py-1 px-2 border border-gray-500 rounded-md"
                        />
                      </label>
                      <ErrorMessage name={passwordField} component="div" className="text-red-500 text-sm" />
                    </div>
                  ))}
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Change Password
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
          <div className="mt-5">
            <Button variant="contained" color="error" className="" onClick={handleDelete}>Delete Account</Button>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
