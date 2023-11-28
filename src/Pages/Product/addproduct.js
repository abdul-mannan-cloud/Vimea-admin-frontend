import React from 'react';
import NavBar from '../../Components/navbar';
import Sidebar from '../../Components/sidebar';
import {TextField, Button} from '@mui/material';
import Fixed from '../../resources/fixed.png';
import AddPhoto from '../../resources/addphoto.png';
import camera from '../../resources/camera.png';
import saveIcon from '../../resources/save.png'
import {useRef, useState} from 'react';
import axios from 'axios';
import AWS from 'aws-sdk';
import FileUpload from '../../Components/FileUpload';
import {useNavigate} from 'react-router-dom';


const AddProduct = () => {

    const fileInput = useRef(null);
    const [formData, setFormData] = useState({
        productName: '',
        price: '',
        quantity: '',
        type: '',
        size: '',
        description: '',
        coverimage: '',
        images: [],
        imagenames: [],
    });

    const navigate = useNavigate();

    const handleFileChange = (index, e) => {
        const file = e.target.files;
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
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
            ACL: 'public-read',
            CORSConfiguration: {
                CORSRules: [{
                    AllowedHeaders: ['*'], AllowedMethods:
                        ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'], AllowedOrigins:
                        ['*'], MaxAgeSeconds: 3000
                }]
            },
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
                        reject({success: false, error: err});
                    } else {
                        console.log('Upload Success');
                        resolve({success: true, filename: uniqueFileName});
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

        // setFormData({
        //     ...formData,
        //     imagenames: imageNames,
        // });

        const updatedFormData = {
            ...formData,
            imagenames: imageNames,
        };

        console.log(formData);
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/products/addproduct`, updatedFormData);
            if (response.status === 200) {
                console.log('Product added successfully');
                navigate('/products');
            } else {
                console.log('Product not added');
            }
        } catch (error) {
            console.error(error);
        }
        e.target.reset();
        return false;
    };

    return (
        <form className='' onSubmit={handleNewFormSubmit} id="formID" enctype="multipart/form-data">
            <div className='flex h-screen bg-gray-100'>
                <div className='flex flex-col w-full overflow-auto'>
                    <div className='flex flex-col items-center justify-center gap-5 mt-32 align-middle'>
                        <div className='items-start justify-start w-2/3'>
                            <button onClick={() => navigate('/products')}
                                    className='py-2 px-5 rounded-lg bg-[#128F96] font-bold text-white hover:bg-cyan-700 transition-all duration-200'>Kthehu
                            </button>
                        </div>
                        <div className='items-center w-2/3 bg-white rounded-lg h-18 '>
                            <div className='flex items-center justify-between p-5 '>
                                <h2 className='text-2xl font-bold'>Produkti i ri
                                </h2>
                                {
                                    Array.isArray(formData.images) && formData.images.length > 0 && (
                                        <div className='flex flex-row gap-3'>
                                            {formData.images.map((image, index) => (
                                                <div key={index}>
                                                    {/* Display each image or its details here */}
                                                    <img src={URL.createObjectURL(image)} className='w-[50px] h-[50px]'
                                                         alt={`Image ${index}`}/>
                                                    {/* You can add more details or customization as needed */}
                                                </div>
                                            ))}
                                        </div>
                                    )
                                }
                                <div className='flex items-center justify-end'>
                                    <div className="col-span-1">
                                        <label className="block w-[100px] h-[100px] cursor-pointer">
                                            <div
                                                className="flex flex-col items-center justify-center w-full h-full gap-1 align-middle bg-gray-300 rounded-lg">
                                                <img src={camera} className='w-[30px] h-[30px]'/>
                                                <span className='text-sm font-bold text-[#128F96]'>Add Images</span>
                                                <input
                                                    type="file"
                                                    name="image"
                                                    id="image"
                                                    multiple
                                                    className="absolute inset-0 w-1 h-1 p-0 m-0 -ml-1 overflow-hidden border-0 opacity-0 clip rect-0 whitespace-nowrap"
                                                    onChange={(e) => {
                                                        setFormData({...formData, images: e.target.files});
                                                    }}
                                                />
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-row justify-between w-2/3 h-full gap-10 p-5 bg-white rounded-lg'>
                            <div className='w-[30%] flex flex-col gap-10 justify-between h-full'>
                                <div className='flex flex-col w-full gap-5'>
                                    <div className='flex flex-col gap-2'>
                                        <label className='font-semibold text-gray-300'>Emri i produktit</label>
                                        <input value={formData.productName} onChange={handleInputChange}
                                               name="productName" label="productName" variant="outlined"
                                               className='w-full rounded-lg p-3 border-[2px] border-gray-200'
                                               placeholder='Emri i Produktit'/>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label className='font-semibold text-gray-300'>Type</label>
                                        <input value={formData.type} onChange={handleInputChange} name="type"
                                               label="type" variant="outlined"
                                               className='w-full rounded-lg p-3 border-[2px] border-gray-200'
                                               placeholder=''/>
                                    </div>
                                    <div className='flex flex-row gap-5'>
                                        <div className='flex flex-row gap-3 w-[50%] justify-between'>
                                            <div className='flex flex-col gap-2'>
                                                <label className='font-semibold text-gray-300'>Çmimi</label>
                                                <input name="price" label="" type="number" value={formData.price}
                                                       onChange={handleInputChange} variant="outlined"
                                                       className='w-[60px] border border-gray-200 p-2 rounded-lg'/>
                                            </div>
                                            <div className='flex flex-col gap-2'>
                                                <label className='font-semibold text-gray-300'>Stoku</label>
                                                <input label="" name="quantity" type="number" value={formData.quantity}
                                                       onChange={handleInputChange} variant="outlined"
                                                       className='w-[60px] border border-gray-200 p-2 rounded-lg'/>
                                            </div>
                                        </div>
                                        <div className='flex flex-col w-[50%] gap-2'>
                                            <label className='w-full font-semibold text-gray-300'>Sasia (ml)</label>
                                            <div className='flex flex-row justify-between w-full gap-2'>
                                                <div onClick={() => setFormData({...formData, size: '10ml'})}
                                                     className={`border border-gray-200 cursor-pointer py-2 px-[2px] rounded-lg ${formData.size === '10ml' ? 'bg-teal-500' : ''}`}>10ml
                                                </div>
                                                <div onClick={() => setFormData({...formData, size: '15ml'})}
                                                     className={`border border-gray-200 cursor-pointer py-2 px-[2px] rounded-lg ${formData.size === '15ml' ? 'bg-teal-500' : ''}`}>15ml
                                                </div>
                                                <div onClick={() => {
                                                    setFormData({...formData, size: '30ml'})
                                                }}
                                                     className={`border border-gray-200 cursor-pointer py-2 px-[2px] rounded-lg ${formData.size === '30ml' ? 'bg-teal-500' : ''}`}>30ml
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/*<div className='flex justify-between flex-auto pt-4 pb-4 '>
                                        <TextField label="type" name="type" value={formData.type} onChange={handleInputChange} variant="outlined" className='mb-2 w-[100px]' />
                                    </div>
                                    <div className='flex justify-between flex-auto pb-4 '>
                                        <TextField label="Size 1" name="size1" value={formData.size1} onChange={handleInputChange} variant="outlined" className='mb-2 w-[100px] ' />
                                        <TextField label="Size 2" name="size2" value={formData.size2} onChange={handleInputChange} variant="outlined" className='mb-2 w-[100px]' />
                                        <TextField label="Size 3" name="size3" value={formData.size3} onChange={handleInputChange} variant="outlined" className='mb-2 w-[100px]' />
                                    </div>*/}

                                <Button type="submit"
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
                                    <img src={saveIcon} className='w-[20px] h-[20px]'/>
                                    <span className='font-bold text-white'>Rauj</span>
                                </Button>
                            </div>

                            <div className='w-[40%] flex flex-col gap-2 '>
                                <label className='font-semibold text-gray-300'>Përshkrimi</label>
                                <textarea
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    className=' rounded-lg border-[2px] border-gray-200 p-2 w-full'
                                />
                            </div>
                            <div className='w-[25%] flex flex-col gap-3 items-end justify-end'>
                                <div className='w-[70%] h-[200px]'>
                                    {
                                        formData.coverimage == ''
                                            ?
                                            <div className='w-full h-full bg-gray-300 rounded-lg'>

                                            </div>
                                            :
                                            <div className='w-full h-full'>
                                                <img className='w-full h-full rounded-lg cover' coverimage
                                                     src={URL.createObjectURL(formData.coverimage)}/>
                                            </div>
                                    }
                                </div>
                                <div className="col-span-1 w-[70%]">
                                    <label className="block cursor-pointer">
                                        <div
                                            className="flex w-full h-full items-center justify-center align-middle flex-row p-2 gap-3 rounded-lg border border-[#128F96]">
                                            <img src={camera} className='w-[20px] h-[30px]'/>
                                            <span className='font-bold text-[#128F96] text-md'>Shto Foto</span>
                                            <input
                                                type="file"
                                                name="image"
                                                id="image"
                                                multiple
                                                className="absolute inset-0 w-1 h-1 p-0 m-0 -ml-1 overflow-hidden border-0 opacity-0 clip rect-0 whitespace-nowrap"
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    coverimage: e.target.files[0]
                                                })}
                                            />
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <input type="file" ref={fileInput} onChange={handleFileChange} style={{display: 'none'}}/>
            </div>
        </form>

    )
}
export default AddProduct;