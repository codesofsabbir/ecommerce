import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock, EyeClosed, Eye } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useFetch from '../../Hooks/UseFetch';
import { UserContext } from '../../Hooks/UserContext';

function LogedIn() {
    const navigate = useNavigate();
    const {setUserLogedIn, setLoginUser} = useContext(UserContext)
    const [passwordShow, setPasswordShow] = useState(false);
    const {data: userInfo} = useFetch("http://localhost:5001/usersInfo");
    const formik = useFormik({
        initialValues: {
            phone: '',
            password: '',
        },
        validationSchema: Yup.object({
            phone: Yup.string()
                .required('Phone number is required')
                .matches(/^\d{11}$/, 'Phone number must be exactly 11 digits'),
            password: Yup.string()
                .required('Password is required')
                .min(6, 'Password must be at least 6 characters'),
        }),
        onSubmit: (values, { resetForm }) => {
            
            const user = userInfo.find((user) => user.userPhone === values.phone);
            if (user) {
                if (user.userPassword === values.password) {
                    setUserLogedIn(true);
                    setLoginUser(user)
                    
                    navigate("/");
                } else {
                    alert("Password is incorrect!");
                }
            } else {
                alert("User Not Found!");
            }
            resetForm();
        },
    });

    return (
        <div className='bg'>
            <div className='w-[90%] mx-auto'>
                <div className='flex w-full h-fit justify-center items-center'>
                    <div className='w-1/3 h-fit'>
                        <form className='w-full flex flex-col gap-3 bg-[#1E90FF] bg-opacity-50 backdrop-blur-md p-10 rounded-[25px] shadow-2xl' onSubmit={formik.handleSubmit}>
                            <div className='w-20 h-20 rounded-full bg-[#1e90ff] mx-auto overflow-hidden flex justify-center items-end'>
                                <img src="https://i.ibb.co.com/yWLz2bS/people.png" alt="User Icon" className='h-16' />
                            </div>
                            <div className="relative h-fit">
                                <input 
                                    type="text" 
                                    name="phone" 
                                    value={formik.values.phone} 
                                    onChange={formik.handleChange} 
                                    onBlur={formik.handleBlur}
                                    placeholder='Phone' 
                                    className='w-full rounded-md bg-transparent border border-black outline-none px-10 py-2 text-md font-thin text-black placeholder:text-black' 
                                />
                                <Phone className='absolute top-1/2 left-2 -translate-y-1/2' />
                                {formik.touched.phone && formik.errors.phone ? (
                                    <div className="text-red-500 text-xs">{formik.errors.phone}</div>
                                ) : null}
                            </div>
                            <div className="relative h-fit">
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
                            <button type="submit" className='bg-[#1E90FF] py-2 rounded-md hover:bg-[#1E90cf] cursor-pointer'>LogIn</button>
                            <div className='flex justify-between'>
                                <p className='text-xs font-sans font-thin'>Don’t have an account? <span className='text-red-700 cursor-pointer' onClick={() => navigate('/sign-up')}>Sign up</span></p>
                                <p className='text-xs font-sans font-thin'><span className='text-red-700 cursor-pointer'>Forget password?</span></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LogedIn;
