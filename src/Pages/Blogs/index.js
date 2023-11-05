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
import AWS from 'aws-sdk';


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
    if (selectedBlogs) {
      try {
        const response = await axios.delete(`http://localhost:3001/blogs/deleteblog/${selectedBlogs._id}`);
        console.log(response.data); 
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };
  


  const spacesEndpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com');
  const s3 = new AWS.S3({
      endpoint: spacesEndpoint,
      accessKeyId: 'DO00B86B2J6M8JRAFFMR',
      secretAccessKey: 'XxvAhR8M2aF8ZYDliQ5kuvDvKEMwIr1BKUKJi7g7Bv4'
  });
  const bucketName = 'vimea';  
  const uploadImage = async (file, imageType) => {
      const timestamp = Date.now(); 
      const uniqueFileName = `${imageType}-${file.name}-${timestamp}`; 
      console.log(`Uploading ${uniqueFileName}`); 
  
      const params = {
          Body: file,
          Bucket: bucketName,
          Key: uniqueFileName, 
          ACL: 'public-read'  
      };
  
      return new Promise((resolve, reject) => {
          s3.putObject(params)
              .on('build', request => {
                  request.httpRequest.headers.Host = `${bucketName}.${spacesEndpoint.hostname}`;
                  request.httpRequest.headers['Content-Length'] = file.size;
                  request.httpRequest.headers['Content-Type'] = file.type;
                  request.httpRequest.headers['x-amz-acl'] = 'public-read';
              })
              .send((err) => {
                  if (err) {
                      console.log(err);
                      reject({ success: false, error: err });
                  } else {
                      console.log('Upload Success');
                      resolve({ success: true, filename: uniqueFileName });
                  }
              });
      });
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
  const file = e.target.files;
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
  let imageNames = [];

  const imageUploadResponse = await uploadImage(formData.images[0], 'blog-main-image');
  if (imageUploadResponse.success) {
      console.log(`Main image uploaded with filename: ${imageUploadResponse.filename}`);
      imageNames.push(imageUploadResponse.filename);
  } else {
      console.error(`Failed to upload main image: ${imageUploadResponse.error}`);
      return;
  }

  for (let i = 0; i < formData.images.length; i++) {
      const imageUploadResponse = await uploadImage(formData.images[i], 'blog-add-on-image');
      if (imageUploadResponse.success) {
          console.log(`Add-on image uploaded with filename: ${imageUploadResponse.filename}`);
          imageNames.push(imageUploadResponse.filename);
        
      } else {
          console.error(`Failed to upload add-on image: ${imageUploadResponse.error}`);
          return;
      }
  } 
  const updatedFormData = {
    ...formData,
    imagenames: imageNames,
};

console.log(updatedFormData);

    try {
         await axios.post('http://localhost:3001/blogs/editblog', updatedFormData);
    } catch (error) {
      console.error(error);
    }
  
    e.target.reset();
    setSelectedBlogs(null); 
    setShowForm(false); 
    return false;
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
                className={`border shadow-lg p-5 px-10 gap-10 rounded-lg w-full h-[120px] flex items-center justify-between bg-white ${
                    selectedBlogs === blog ? 'mb-2' : 'mb-4'
                }`}
                onClick={() => handleProductClick(blog)}
              >
                <h2 className='font-bold text-2xl'>{blog.blogTitle}</h2>
                <p className='text-xl'>{blog.phoneNumber}</p>
                <p className='text-xl'>{blog.phoneNumber}</p>
                {/* <p> {blog.toSatisfy}</p> */}
                <div className='flex flex-row gap-5'>
                  <img src={`https://vimea.nyc3.cdn.digitaloceanspaces.com/${blog.coverimage}`}  className='w-[100px] h-[100px] rounded-lg' alt='Product image 1' />
                  <img src={`https://vimea.nyc3.cdn.digitaloceanspaces.com/${blog.images[0]}`} className='w-[100px] h-[100px] rounded-lg' alt='Product image 2' />
                  <img src={`https://vimea.nyc3.cdn.digitaloceanspaces.com/${blog.images[1]}`} className='w-[100px] h-[100px] rounded-lg' alt='Product image 2' />
                </div>
                
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
