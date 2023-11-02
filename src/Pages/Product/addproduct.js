import React from 'react';
import NavBar from '../../Components/navbar';
import Sidebar from '../../Components/sidebar';
import { TextField, Button } from '@mui/material';
import Fixed from '../../resources/fixed.png';
import AddPhoto from '../../resources/addphoto.png';
import { useRef, useState } from 'react';
import axios from 'axios';
import AWS from 'aws-sdk';
import FileUpload from '../../Components/FileUpload';


const AddProduct = () => {

const fileInput = useRef(null);
const [formData, setFormData] = useState({
    productName: '',
    price: '',
    quantity: '',
    type: '',
    size1: '',
    size2: '',
    size3: '',
    description: '',
    coverimage: '',
    images: [],
    imagenames: [],
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
  
    const imageUploadResponse = await uploadImage(formData.images[0], 'main-image');
    if (imageUploadResponse.success) {
        console.log(`Main image uploaded with filename: ${imageUploadResponse.filename}`);
        imageNames.push(imageUploadResponse.filename);
    } else {
        console.error(`Failed to upload main image: ${imageUploadResponse.error}`);
        return;
    }
  
    for (let i = 0; i < formData.images.length; i++) {
        const imageUploadResponse = await uploadImage(formData.images[i], 'add-on-image');
        if (imageUploadResponse.success) {
            console.log(`Add-on image uploaded with filename: ${imageUploadResponse.filename}`);
            imageNames.push(imageUploadResponse.filename);
        } else {
            console.error(`Failed to upload add-on image: ${imageUploadResponse.error}`);
            return;
        }
    }

    setFormData({
        ...formData,
        imagenames: imageNames,
    });

    console.log(formData);
    try {
      const response = await axios.post('http://localhost:3001/products/addproduct', formData);
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
                                    <h2 className='text-2xl font-bold'>Add Product</h2>
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
                                    <TextField value={formData.productName} onChange={handleInputChange} name="productName" label="productName" variant="outlined" className='mb-4 w-[300px]' />
                                    <div className='flex flex-auto pt-4 pb-4 justify-between '>
                                        <TextField name="price" label="price" value={formData.price} onChange={handleInputChange} variant="outlined" className='mb-2 w-[100px] ' />
                                        <TextField label="quantity" name="quantity" value={formData.quantity} onChange={handleInputChange} variant="outlined" className='mb-2 w-[100px]' />
                                        <TextField label="type" name="type" value={formData.type} onChange={handleInputChange} variant="outlined" className='mb-2 w-[100px]' />
                                    </div>
                                    <div className='flex flex-auto pb-4 justify-between  '>
                                        <TextField label="Size 1" name="size1" value={formData.size1} onChange={handleInputChange} variant="outlined" className='mb-2 w-[100px] ' />
                                        <TextField label="Size 2" name="size2" value={formData.size2} onChange={handleInputChange} variant="outlined" className='mb-2 w-[100px]' />
                                        <TextField label="Size 3" name="size3" value={formData.size3} onChange={handleInputChange} variant="outlined" className='mb-2 w-[100px]' />
                                    </div>
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
                                </div>
                                <div>
                                    <TextField
                                        label="Description"
                                        name="description"
                                        value={formData.description}
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
                    <input type="file" ref={fileInput} onChange={handleFileChange} style={{ display: 'none' }} />
            </div>       
        </form>

    )
    }
export default AddProduct;