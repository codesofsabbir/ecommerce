import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, User, Lock, Eye, EyeClosed } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function SignUp() {
    const navigate = useNavigate();
    const [passwordShow, setPasswordShow] = useState(false);
    
    const formik = useFormik({
        initialValues: {
            name: '',
            phone: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Name is required')
                .min(2, 'Name must be at least 2 characters'),
            phone: Yup.string()
                .required('Phone number is required')
                .matches(/^\d{11}$/, 'Phone number must be exactly 10 digits'),
            password: Yup.string()
                .required('Password is required')
                .min(6, 'Password must be at least 6 characters'),
            confirmPassword: Yup.string()
                .required('Please confirm your password')
                .oneOf([Yup.ref('password'), null], 'Passwords must match'),
        }),
        onSubmit: (values, { resetForm }) => {
            console.log(values);
            resetForm();
            // Navigate to another page or perform further actions here
        }
    });

    return (
        <div className="bg">
            <div className="w-[90%] mx-auto">
                <div className="flex w-full h-fit justify-center items-center">
                    <div className="w-1/3 h-fit">
                        <form 
                            className='w-full flex flex-col gap-3 bg-[#1E90FF] bg-opacity-50 backdrop-blur-md p-10 rounded-[25px] shadow-2xl' 
                            onSubmit={formik.handleSubmit}
                        >
                            <div className='relative h-fit'>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={formik.values.name} 
                                    onChange={formik.handleChange} 
                                    onBlur={formik.handleBlur}
                                    placeholder='Name' 
                                    className='w-full rounded-md bg-transparent border border-white outline-none px-10 py-2 text-md font-thin text-black placeholder:text-black' 
                                />
                                <User className='absolute top-1/2 left-2 -translate-y-1/2' />
                                {formik.touched.name && formik.errors.name ? (
                                    <div className="text-red-500 text-xs">{formik.errors.name}</div>
                                ) : null}
                            </div>
                            <div className='relative h-fit'>
                                <input 
                                    type="text" 
                                    name="phone" 
                                    value={formik.values.phone} 
                                    onChange={formik.handleChange} 
                                    onBlur={formik.handleBlur}
                                    placeholder='Phone' 
                                    className='w-full rounded-md bg-transparent border border-white outline-none px-10 py-2 text-md font-thin text-black placeholder:text-black' 
                                />
                                <Phone className='absolute top-1/2 left-2 -translate-y-1/2' />
                                {formik.touched.phone && formik.errors.phone ? (
                                    <div className="text-red-500 text-xs">{formik.errors.phone}</div>
                                ) : null}
                            </div>
                            <div className='relative h-fit'>
                                <input 
                                    type={passwordShow ? 'text' : 'password'} 
                                    name="password" 
                                    value={formik.values.password} 
                                    onChange={formik.handleChange} 
                                    onBlur={formik.handleBlur}
                                    placeholder='Password' 
                                    className='w-full rounded-md bg-transparent border border-black outline-none px-10 py-2 text-md font-thin text-black placeholder:text-black' 
                                />
                                <Lock className='absolute top-1/2 left-2 -translate-y-1/2' />
                                <i className='absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer' onClick={() => { setPasswordShow(!passwordShow); }}>
                                    {passwordShow ? <EyeClosed /> : <Eye />}
                                </i>
                                {formik.touched.password && formik.errors.password ? (
                                    <div className="text-red-500 text-xs">{formik.errors.password}</div>
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
