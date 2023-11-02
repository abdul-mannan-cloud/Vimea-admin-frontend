import React, { useState } from 'react';
import NavBar from '../../Components/navbar';
import Sidebar from '../../Components/sidebar';
import AddBlogs from '../../resources/addBlogs.png';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { TextField, Button } from '@mui/material';
import Fixed from '../../resources/fixed.png';
import AddPhoto from '../../resources/addphoto.png';
import Plus from '../../resources/Plus.png';
import { useRef } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';


const Blogs = () => {
    
const navigate = useNavigate();

const [blogs, setBlogs] = useState([]);
const [showForm, setShowForm] = useState(false); 
const [selectedBlogs, setSelectedBlogs] = useState(null); 

useEffect(() => {
const fetchBlogs = async () => {
    try {
    const response = await axios.get('http://localhost:3001/blogs/getallblogs');
    setBlogs(response.data.blogs);
    console.log(blogs);
    } catch (error) {
    console.error('Error fetching blogs:', error);
    }
};
fetchBlogs();
}, []);


const handleProductClick = (blog) => {
    if (selectedBlogs === blog) {
        setSelectedBlogs(null);
      setShowForm(false);
      setFormData({
        blogTitle: '',
        phoneNumber: '',
        toSatisfy: '',
        coverimage: '',
        images: [],
      });
    } else {
        setSelectedBlogs(blog);
        setShowForm(true);
      setFormData({
        blogTitle: blog.blogTitle || '',
        phoneNumber: blog.phoneNumber ||'',
        toSatisfy: blog.toSatisfy ||'',
        coverimage: blog.coverimage || '',
        images: blog.images || [],
      });
    }
  };
  

  const onDeleteClick = async () => {
    // if (selectedProduct) {
    //   try {
    //     const response = await axios.delete(`http://localhost:3001/products/deleteproduct/${selectedProduct._id}`);
    //     console.log(response.data); 
    //   } catch (error) {
    //     console.error('Error deleting product:', error);
    //   }
    // }
  };
  

const fileInput = useRef(null);
const [formData, setFormData] = useState({
    blogTitle: '',
    phoneNumber: '',
    toSatisfy: '',
    coverimage: '',
    images: [],
});

const handleFileChange = (index, e) => {
}

const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
};

const handleNewFormSubmit = async (e) => {
    // e.preventDefault();
    
    // console.log(formData);
  
    // let formDataToSend = new FormData();
    // formDataToSend.append('productName', formData.productName);
    // formDataToSend.append('price', formData.price);
    // formDataToSend.append('quantity', formData.quantity);
    // formDataToSend.append('type', formData.type);
    // formDataToSend.append('size1', formData.size1);
    // formDataToSend.append('size2', formData.size2);
    // formDataToSend.append('size3', formData.size3);
    // formDataToSend.append('description', formData.description);
    // formDataToSend.append('coverImage', formData.coverimage); 
    // for (let i = 0; i < formData.images.length; i++) {
    //   formDataToSend.append(`images`, formData.images[i]);
    // }  

    // console.log(formDataToSend)
    // try {
  
    //   const response = await axios.post('http://localhost:3001/products/editproduct', formDataToSend);
    //   console.log(response.data.filenames);
    // } catch (error) {
    //   console.error(error);
    // }
  
    // e.target.reset();
    // setSelectedProduct(null); 
    // setShowForm(false); 
    // return false;
  };
  
  


return (
    <div className='flex h-screen bg-gray-100'>
      <Sidebar />
      <div className='flex flex-col w-full overflow-auto'>
        <NavBar />
        <div className=' flex flex-col items-center space-y-4 w-full px-20'>
          <div className='flex items-end justify-end mt-32 w-full'>
            <div 
              onClick={() => navigate('/blogs/add')}
              className='flex gap-3 px-3 py-2 bg-[#128F96] rounded-xl justify-center items-center hover:bg-cyan-700 transition-all duration-200 cursor-pointer'
              >
              <img src={Plus} className=''/>
              <span className='text-lg font-bold text-white'>SHTO BLOGUN</span>
            </div>
          </div>
          
          
          {blogs.map((blog, index) => (
            <div key={index} className='w-full px-16'>
              <div
                className={`border p-4 rounded-lg w-full h-20 flex items-center justify-between ${
                    selectedBlogs === blog ? 'mb-2' : 'mb-4'
                }`}
                onClick={() => handleProductClick(blog)}
              >
                <h2 className='font-bold mb-3'>{blog.blogTitle}</h2>
                <p> {blog.phoneNumber}</p>
                <p>Є {blog.toSatisfy}</p>
                {/* <img src={} className='w-24 h-24 mb-2 rounded-lg' alt='Product image 1' />
                <img src={} className='w-24 h-24 rounded-lg' alt='Product image 2' /> */}
                
              </div>
              {selectedBlogs === blog && (
                <form
                  className='border rounded-lg w-full mb-4'
                  onSubmit={handleNewFormSubmit}
                  id='formID'
                  encType='multipart/form-data'
                >
        <div className='flex justify-center'>
                    <div className='p-4 max-w-7xl w-3/3 l-1/3 h-[450px] rounded-lg bg-white flex justify-between'>
                        <div>
                        <div className='p-10 flex justify-between items-center '>
                            <div className='flex justify-end items-center'>
                    <div className="col-span-1">
                            <input
                                type="file"
                                name="image"
                                id="image"
                                multiple
                                className="h-10 border p-1.5 mt-1 rounded px-4 w-full bg-gray-50"
                                onChange={(e) => {
                                    setFormData({ ...formData, images: e.target.files })
                                }}
                            />

                </div>
                            </div>
                        </div>
                            <TextField value={formData.blogTitle} onChange={handleInputChange} name="productName" label="productName" variant="outlined" className='mb-4 w-[300px]' />
                            <div className='flex flex-auto pt-4 pb-4 justify-between '>
                                <TextField value={formData.phoneNumber} onChange={handleInputChange} name="phoneNumber" label="Phone Number" variant="outlined" className='mb-4 w-[300px]' />
                                </div>
                            <div className='flex justify-center items-center'>
  <Button
    type="submit"
    variant="contained"
    style={{
      background: 'transparent',
      boxShadow: 'none',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
    }}
  >
    <img src={Fixed} alt='Product' className='mb-4' />
  </Button>
  <div className='pb-4 pl-36'>

  <Button
    variant="contained"
    style={{ backgroundColor: 'red', color: 'white', height: '55px', width: '220px' }}
    startIcon={<DeleteIcon />}
    onClick={onDeleteClick}
  >
    Delete
  </Button>
  </div>
  </div>

    </div>
                        <div className='pt-32 pl-8'>
                            <TextField
                                label="To satisfy"
                                name="description"
                                value={formData.toSatisfy}
                                onChange={handleInputChange}
                                multiline
                                rows={4}
                                variant="outlined"
                                className='mb-4  w-[300px]'
                            />
                        </div>
                        <div className='pt-32 pl-8'>
<input
    type="file"
    className=""
    accept="image/png, image/jpg"
    name="coverImage"
    id="coverImage"
    onChange={(e) => setFormData({ ...formData, coverimage: e.target.files[0] })}
/>
<div className='pl-5 pt-2'>
<img src={AddPhoto} alt='Product' className=' border border-teal-500 rounded-lg w-[150px] h-[50px] mb-4 ' />
</div>
</div>
                    </div>
            <input type="file" ref={fileInput} style={{ display: 'none' }} onChange={handleFileChange} />
        </div>       
            </form>
              )}
            </div>
          ))}
    </div>
    </div>
</div>
);
};

export default Blogs;
