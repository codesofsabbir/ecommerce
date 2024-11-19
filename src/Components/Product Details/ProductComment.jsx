/* eslint-disable react/prop-types */
import Avatar from '@mui/material/Avatar';
import { IoIosSend } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Menu, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import useAxios from '../../Hooks/useAxios';

function ProductComment({userLogedIn, loginUser, product}) {
    const [comments, setComments] = useState([])
    const [commentAnchorEl, setCommentAnchorEl] = useState(null);
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const { data: allComments } = useAxios(`http://localhost:5001/userComments`);
    const handleCommentNavOpen = (event, commentId) => {
        setCommentAnchorEl(event.currentTarget);
        setSelectedCommentId(commentId);
    }
    const handleCommentNavClose = () => {
        setCommentAnchorEl(null)
        setSelectedCommentId(null)
    };
    useEffect(()=>{
      if(allComments?.length > 0 && product){
          const filterComments = allComments.filter((comment)=> comment.productId === product.id)
          setComments(filterComments)
      }
      else{
          setComments([])
      }
    }, [product?.id, allComments, product])
    const formik = useFormik({
        initialValues: {
        comments: '',
        },
        onSubmit: (values, { resetForm }) => {
            const payload = {
                ...values, 
                userId: loginUser?.id,
                userImage: loginUser?.userProfilePic,
                userName: loginUser?.userName,
                productId: product?.id,
            }
            fetch('http://localhost:5001/userComments', {
                method: 'POST',
                headers: {
                'Content-Type' : 'application/json',
                },
                body: JSON.stringify(payload),
            })
            resetForm();
        },
    })
    
  return (
    <div className='w-[90%] mx-auto mt-10 border border-gray-300 rounded-lg p-10'>
          <h2 className="text-2xl font-semibold mb-5">Comments</h2>
          <div className='flex items-center w-full md:w-2/3'>
            
            <Avatar 
              src={userLogedIn && loginUser?.userProfilePic}
              alt="User Profile" 
              className="cursor-pointer"
            />

            <form onSubmit={formik.handleSubmit} className="search relative w-full ml-5 md:ml-10">
              <input
                type="text"
                placeholder="Enter your comments..."
                name='comments'
                onChange={formik.handleChange}
                value={formik.values.comments}
                className="border border-black py-1 px-2 rounded-md outline-none w-full text-md"
              />
              <button type='submit' className="searchIcon flex gap-2 absolute right-3 top-1/2 -translate-y-1/2">
                <IoIosSend className="cursor-pointer text-xl" />
              </button>
            </form>
            
          </div>
          <div className='ml-16 mt-10'>
            {
              comments?.map((comment)=>( 
                <div key={comment.id} className='flex items-start justify-between w-full md:w-2/3 mb-7 border border-gray-300 p-5 rounded-md' >
                  <div className='flex items-start '>
                    <img 
                      src={comment.userImage}
                      alt={comment.userName} 
                      className="cursor-pointer h-8 w-8 rounded-full aspect-square"
                      loading='lazy'
                    />
                    <div className='ml-5'>
                      <h2 className='font-semibold font-sans text-lg'>{comment.userName}</h2>
                      <h3 className='font-medium text-base capitalize text-gray-700'>{comment.comments}</h3>
                    </div>
                  </div>
                  {
                    loginUser ? 
                    (
                      <div>
                        <button className='p-1 text-base text-gray-700' onClick={(event) => handleCommentNavOpen(event, comment.id)}><BsThreeDotsVertical /></button>
                        {selectedCommentId === comment.id && (
              <div>
                {loginUser?.id === comment?.userId ? (
                  <Menu
                    anchorEl={commentAnchorEl}
                    open={Boolean(commentAnchorEl)}
                    onClose={handleCommentNavClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    className="mt-5"
                  >
                    <MenuItem>Edit</MenuItem>
                    <MenuItem>Delete</MenuItem>
                    <MenuItem>Reply</MenuItem>
                  </Menu>
                ) : (
                  <Menu
                    anchorEl={commentAnchorEl}
                    open={Boolean(commentAnchorEl)}
                    onClose={handleCommentNavClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    className="mt-5"
                  >
                    <MenuItem>Reply</MenuItem>
                  </Menu>
                )}
              </div>
            )}
                        
                      </div>
                    )
                    :
                    ""
                  }
                  
                  
                </div>
                
              ))
            }
          </div>
        </div>
  )
}

export default ProductComment