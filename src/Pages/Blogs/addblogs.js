import React from 'react';
import NavBar from '../../Components/navbar';
import Sidebar from '../../Components/sidebar';
import { TextField, Button } from '@mui/material';
import Fixed from '../../resources/fixed.png';
import AddPhoto from '../../resources/addphoto.png';
import { useRef, useState } from 'react';
import axios from 'axios';

const AddBlog = () => {
const fileInput = useRef(null);
const [formData, setFormData] = useState({
    blogTitle: '',
    phoneNumber: '',
    toSatisfy: '',
    coverimage: '',
    images: [],
});

const handleFileChange = (index, e) => {
  };
  

const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
};

const handleNewFormSubmit = async (e) => {
    e.preventDefault();
    console.log("Just before sending in function");
    let formDataToSend = new FormData();
    formDataToSend.append('blogTitle', formData.blogTitle);
    formDataToSend.append('phoneNumber', formData.phoneNumber);
    formDataToSend.append('images', formData.coverimage);
    formDataToSend.append('toSatisfy', formData.toSatisfy);
    for (let i = 0; i < formData.images.length; i++) {
        formDataToSend.append(`images`, formData.images[i]);
    }

    console.log(formDataToSend)
  
    try {
      const response = await axios.post('http://localhost:3001/blogs/addblog', formDataToSend);
      console.log(response.data.filenames);
    } catch (error) {
      console.error(error);
    }
  
    e.target.reset();
    return false;
  };
  


return (           
     <form className='' onSubmit={handleNewFormSubmit} id="formID" enctype="multipart/form-data">
            <div className='flex h-screen'>
                <Sidebar />
                <div className='flex flex-col w-full overflow-auto'>
                    <NavBar />
                    <div className='pl-4 flex-grow bg-gray-100 flex flex-col items-center space-y-4'>
                        <br />
                        <div className='p-18 w-2/3 h-18 items-center rounded-lg bg-white '>
                            <div className='p-10 flex justify-between items-center '>
                                <h2 className='text-2xl font-bold'>Add Blog</h2>
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
                        </div>

                        <br />

                        <div className='p-36 max-w-7xl w-2/3 l-1/3 h-[450px] rounded-lg bg-white flex justify-between'>
                            <div>
                            <TextField value={formData.blogTitle} onChange={handleInputChange} name="blogTitle" label="Blog Title" variant="outlined" className='mb-4 w-[300px]' />
                                <div className='flex flex-auto pt-4 pb-4  '>
                                <TextField value={formData.phoneNumber} onChange={handleInputChange} name="phoneNumber" label="Phone Number" variant="outlined" className='mb-4 w-[300px]' />
                                </div>
                                <Button  type="submit"
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
                            </div>
                            <div>
                                <TextField
                                    label="To satisfy"
                                    name="toSatisfy"
                                    value={formData.toSatisfy}
                                    onChange={handleInputChange}
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    className='mb-4  w-[300px]'
                                />
                            </div>
                            <div className=''>
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

                    </div>
                </div>
                <input type="file" ref={fileInput} style={{ display: 'none' }} onChange={handleFileChange} />
            </div>       
             </form>

)
}
export default AddBlog;