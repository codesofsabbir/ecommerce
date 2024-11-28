import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, User, Lock, Eye, EyeClosed } from 'lucide-react';
import { allDivision, districtsOf, upazilasOf } from '@bangladeshi/bangladesh-address';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function SignUp() {
    const navigate = useNavigate();
    const [passwordShow, setPasswordShow] = useState(false);
    
    const formik = useFormik({
        initialValues: {
            userName: '',
            userPhone: '',
            userPassword: '',
            confirmPassword: '',
            userProfilePic: '',
            division: "",
            district: "",
            upazila: ""

        },
        validationSchema: Yup.object({
            userName: Yup.string()
                .required('Name is required')
                .min(2, 'Name must be at least 2 characters'),
            userPhone: Yup.string()
                .required('Phone number is required')
                .matches(/^\d{11}$/, 'Phone number must be exactly 11 digits'),
            division: Yup.string()
                .required('Please confirm your Division'),
                district: Yup.string()
                .required('Please confirm your District'),
                upazila: Yup.string()
                .required('Please confirm your Upazila'),
            userPassword: Yup.string()
                .required('Password is required')
                .min(6, 'Password must be at least 6 characters'),
            confirmPassword: Yup.string()
                .required('Please confirm your password')
                .oneOf([Yup.ref('userPassword'), null], 'Passwords must match'),            
        }),
        onSubmit: async (values, { resetForm }) => {
            const { confirmPassword, ...dataToSubmit } = values;
            try {
                const response = await fetch('http://localhost:5001/usersInfo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToSubmit),
                });

                if (response.ok) {
                    console.log('User info submitted successfully');
                    resetForm();
                    navigate('/login'); // Redirect to the login page
                } else {
                    console.error('Failed to submit user info');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    });

    return (
        <div className="bg">
            <div className="w-[90%] mx-auto">
                <div className="flex w-full h-fit justify-center items-center">
                    <div className="w-full md:w-1/2 h-fit">
                        <form 
                            className='w-full flex flex-col gap-3 bg-[#1E90FF] bg-opacity-50 backdrop-blur-md p-10 rounded-[25px] shadow-2xl' 
                            onSubmit={formik.handleSubmit}
                        >
                            <div className='relative h-fit'>
                                <input 
                                    type="text" 
                                    name="userName" 
                                    value={formik.values.userName} 
                                    onChange={formik.handleChange} 
                                    onBlur={formik.handleBlur}
                                    placeholder='Name' 
                                    className='w-full rounded-md bg-transparent border border-white outline-none px-10 py-2 text-md font-thin text-black placeholder:text-black' 
                                />
                                <User className='absolute top-1/2 left-2 -translate-y-1/2' />
                                {formik.touched.userName && formik.errors.userName ? (
                                    <div className="text-red-500 text-xs">{formik.errors.userName}</div>
                                ) : null}
                            </div>
                            <div className='relative h-fit'>
                                <input 
                                    type="text" 
                                    name="userPhone" 
                                    value={formik.values.userPhone} 
                                    onChange={formik.handleChange} 
                                    onBlur={formik.handleBlur}
                                    placeholder='Phone' 
                                    className='w-full rounded-md bg-transparent border border-white outline-none px-10 py-2 text-md font-thin text-black placeholder:text-black' 
                                />
                                <Phone className='absolute top-1/2 left-2 -translate-y-1/2' />
                                {formik.touched.userPhone && formik.errors.userPhone ? (
                                    <div className="text-red-500 text-xs">{formik.errors.userPhone}</div>
                                ) : null}
                            </div>
                            <div className='relative h-fit'>
                                <input 
                                    type={passwordShow ? 'text' : 'password'} 
                                    name="userPassword" 
                                    value={formik.values.userPassword} 
                                    onChange={formik.handleChange} 
                                    onBlur={formik.handleBlur}
                                    placeholder='Password' 
                                    className='w-full rounded-md bg-transparent border border-white outline-none px-10 py-2 text-md font-thin text-black placeholder:text-black' 
                                />
                                <Lock className='absolute top-1/2 left-2 -translate-y-1/2' />
                                <i className='absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer' onClick={() => { setPasswordShow(!passwordShow); }}>
                                    {passwordShow ? <EyeClosed /> : <Eye />}
                                </i>
                                {formik.touched.userPassword && formik.errors.userPassword ? (
                                    <div className="text-red-500 text-xs">{formik.errors.userPassword}</div>
                                ) : null}
                            </div>
                            <div className='relative h-fit'>
                                <input 
                                    type={passwordShow ? 'text' : 'password'} 
                                    name="confirmPassword" 
                                    value={formik.values.confirmPassword} 
                                    onChange={formik.handleChange} 
                                    onBlur={formik.handleBlur}
                                    placeholder='Confirm Password' 
                                    className='w-full rounded-md bg-transparent border border-white outline-none px-10 py-2 text-md font-thin text-black placeholder:text-black' 
                                />
                                <Lock className='absolute top-1/2 left-2 -translate-y-1/2' />
                                {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                    <div className="text-red-500 text-xs">{formik.errors.confirmPassword}</div>
                                ) : null}
                            </div>
                            <div className='flex gap-5'>
                            <select
                                name="division"
                                id="division"
                                onChange={formik.handleChange}
                                value={formik.values.division}
                                className='w-full rounded-md bg-transparent border border-white outline-none p-2 text-md font-thin text-black placeholder:text-black'
                            >
                                <option value="" disabled>Select Division</option>
                                {allDivision().map((division) => (
                                    <option key={division} value={division}>
                                        {division}
                                    </option>
                                ))}
                            </select>

                            <select
                                name="district"
                                id="district"
                                disabled={!formik.values.division}
                                onChange={formik.handleChange}
                                value={formik.values.district}
                                className='w-full rounded-md bg-transparent border border-white outline-none p-2 text-md font-thin text-black placeholder:text-black'
                            >
                                <option value="" disabled>Select District</option>
                                {formik.values.division &&
                                    districtsOf(formik.values.division).map((district) => (
                                        <option key={district} value={district}>
                                            {district}
                                        </option>
                                    ))}
                            </select>

                            <select
                                name="upazila"
                                id="upazila"
                                disabled={!formik.values.district}
                                onChange={formik.handleChange}
                                value={formik.values.upazila}
                                className='w-full rounded-md bg-transparent border border-white outline-none p-2 text-md font-thin text-black placeholder:text-black'
                            >
                                <option value="" disabled>Select Upazila</option>
                                {formik.values.district &&
                                    upazilasOf(formik.values.district).map((upazilaObj) => (
                                        <option key={upazilaObj.upazila} value={upazilaObj.upazila}>
                                            {upazilaObj.upazila}
                                        </option>
                                    ))}
                            </select>
                            
                            </div>
                            <button type="submit" className='bg-[#1E90FF] py-2 rounded-md hover:bg-[#1E90cf] cursor-pointer'>Sign Up</button>
                            <div className='flex justify-between'>
                                <p className='text-xs font-sans font-thin'>Already have an account? <span className='text-red-700 cursor-pointer' onClick={() => navigate('/login')}>LogIn</span></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
