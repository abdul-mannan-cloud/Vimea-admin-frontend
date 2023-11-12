import React from 'react';
import NavBar from '../../Components/navbar';
import Sidebar from '../../Components/sidebar';
import { TextField, Button } from '@mui/material';
import Fixed from '../../resources/fixed.png';
import AddPhoto from '../../resources/addphoto.png';
import camera from '../../resources/camera.png'
import saveIcon from '../../resources/save.png'
import { useRef, useState } from 'react';
import axios from 'axios';
import AWS from 'aws-sdk';
import { useNavigate } from 'react-router-dom';

const AddBlog = () => {
const fileInput = useRef(null);
const [formData, setFormData] = useState({
    blogTitle: '',
    phoneNumber: '',
    toSatisfy: '',
    coverimage: '',
    images: [],
    imagenames: []
});

const navigate = useNavigate();

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
       await axios.post('http://localhost:3001/blogs/addblog', updatedFormData);
    } catch (error) {
      console.error(error);
    }
  
    e.target.reset();
    return false;
  };
  
  

return (           
     <form className='mt-20' onSubmit={handleNewFormSubmit} id="formID" enctype="multipart/form-data">
            <div className='flex h-screen bg-gray-100'>
                <div className='flex flex-col w-full overflow-auto'>
                    <div className='flex flex-col items-center mt-10 align-middle justify-center gap-5'>
                      <div className='w-2/3 items-start justify-start'>
                        <button onClick={() => navigate('/blogs')} className='py-2 px-5 rounded-lg bg-[#128F96] font-bold text-white hover:bg-cyan-700 transition-all duration-200'>Back</button>
                      </div>
                        <div className='items-center w-2/3 bg-white rounded-lg h-18 '>
                            <div className='flex items-center justify-between p-5 '>
                                <h2 className='text-2xl font-bold'>Add Blog</h2>
                                {
                                  Array.isArray(formData.images) && formData.images.length > 0 && (
                                    <div className='flex flex-row gap-3'>
                                      {formData.images.map((image, index) => (
                                        <div key={index}>
                                          {/* Display each image or its details here */}
                                          <img src={URL.createObjectURL(image)} className='w-[50px] h-[50px]' alt={`Image ${index}`} />
                                          {/* You can add more details or customization as needed */}
                                        </div>
                                      ))}
                                    </div>
                                  )
                                }
                                <div className='flex items-center justify-end'>
                                  <div className="col-span-1">
                                    <label className="block w-[100px] h-[100px] cursor-pointer">
                                      <div className="flex w-full h-full bg-gray-300 items-center justify-center align-middle flex-col gap-1 rounded-lg">
                                        <img src={camera} className='w-[30px] h-[30px]' />
                                        <span className='text-sm font-bold text-[#128F96]'>Add Images</span>
                                        <input
                                          type="file"
                                          name="image"
                                          id="image"
                                          multiple
                                          className="absolute clip rect-0 border-0 p-0 m-0 -ml-1 w-1 h-1 overflow-hidden whitespace-nowrap inset-0 opacity-0"
                                          onChange={(e) => {
                                            setFormData({ ...formData, images: e.target.files });                                          
                                          }}
                                        />
                                      </div>
                                    </label>
                                  </div>
                                </div>
                            </div>
                        </div>

                        <div className='p-5 w-2/3 rounded-lg bg-white flex justify-between flex-row gap-10 h-full'>
                            <div className='w-[25%] flex flex-col gap-10 justify-between h-full'>
                              <div className='w-full flex flex-col gap-5'>
                                <div className='flex flex-col gap-2'>
                                  <label className='font-semibold text-gray-300'>TITULLI I BLOG-UT</label>
                                  <input value={formData.blogTitle} onChange={handleInputChange} name="blogTitle" label="Blog Title" variant="outlined" className='w-full rounded-lg p-3 border-[2px] border-gray-200' placeholder='Titulli i Blog-ut'/>
                                </div>
                                <div className='flex flex-col gap-2'>
                                  <label className='font-semibold text-gray-300'>PHONE NUMBER</label>
                                  <input value={formData.phoneNumber} onChange={handleInputChange} name="phoneNumber" label="Phone Number" variant="outlined" className='w-full rounded-lg p-3 border-[2px] border-gray-200' placeholder='Phone Number'/>
                                </div>
                              </div>
                              <Button  type="submit"
                                      variant="contained"
                                      style={{
                                        background: '#128F96',
                                        width: '70%', 
                                        boxShadow: 'none', 
                                        border: 'none', 
                                        padding: '10px', 
                                        paddingLeft: '30px',
                                        cursor: 'pointer',
                                        justifyItems: 'start',
                                        justifyContent: 'start',
                                        display: 'flex',
                                        gap: '20px',
                                        borderRadius: '10px'

                                      }}
                                    >
                                      <img src={saveIcon} className='w-[20px] h-[20px]' />
                                      <span className='text-white font-bold'>Rauj</span>
                              </Button>
                            </div>
                            <div className='w-[40%] flex flex-col gap-2 '>
                              <label className='font-semibold text-gray-300'>Kontenti</label>
                                <textarea
                                    label="To satisfy"
                                    name="toSatisfy"
                                    value={formData.toSatisfy}
                                    onChange={handleInputChange}
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    className=' rounded-lg border-[2px] border-gray-200 p-2 w-full'
                                />
                            </div>
                            <div className='w-[15%] flex flex-col gap-3'>
                              <div className='w-full h-[200px]'>
                                {
                                  formData.coverimage == ''
                                  ? 
                                    <div className='w-full h-full rounded-lg bg-gray-300'>

                                    </div>
                                  : 
                                    <div className='w-full h-full'>
                                      <img className='cover w-full h-full rounded-lg' coverimage src={URL.createObjectURL(formData.coverimage)} />
                                    </div>
                                }
                              </div>
                              <div className="col-span-1">
                                <label className="block cursor-pointer">
                                  <div className="flex w-full h-full items-center justify-center align-middle flex-row p-2 gap-3 rounded-lg border border-[#128F96]">
                                    <img src={camera} className='w-[20px] h-[30px]' />
                                    <span className='font-bold text-[#128F96] text-md'>Shto Foto</span>
                                    <input
                                      type="file"
                                      name="image"
                                      id="image"
                                      multiple
                                      className="absolute clip rect-0 border-0 p-0 m-0 -ml-1 w-1 h-1 overflow-hidden whitespace-nowrap inset-0 opacity-0"
                                      onChange={(e) => setFormData({ ...formData, coverimage: e.target.files[0] })}
                                    />
                                  </div>
                                </label>
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