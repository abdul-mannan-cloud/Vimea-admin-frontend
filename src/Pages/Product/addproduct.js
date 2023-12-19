import React, {useEffect} from 'react';
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
    const [loading, setLoading] = useState(false);
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
        brand: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token') === null) {
            navigate('/login')
        }
        if (localStorage.getItem('role') !== 'admin') {
            alert('You are not authorized to view this page')
            navigate('/home')
        }
    }, []);

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
        accessKeyId: `${process.env.REACT_APP_DO_SPACES_KEY}`,
        secretAccessKey: `${process.env.REACT_APP_DO_SPACES_SECRET}`,
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
        setLoading(true)
        let imageNames = [];

        if (formData.productName === '' || formData.price === '' || formData.quantity === '' || formData.type === '' || formData.size === '' || formData.description === '' || formData.images.length === 0) {
            alert("Ploteso te gjitha fushat");
            return;
        }

        if (formData.images[0]) {
            const imageUploadResponse = await uploadImage(formData.images[0], 'main-image');
            if (imageUploadResponse.success) {
                console.log(`Main image uploaded with filename: ${imageUploadResponse.filename}`);
                imageNames.push(imageUploadResponse.filename);
            } else {
                console.error(`Failed to upload main image: ${imageUploadResponse.error}`);
                return;
            }
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

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/products/addproduct`, updatedFormData);
            if (response.status === 200 || response.status === 201) {
                console.log('Product added successfully');
                navigate('/products');
            } else {
                console.log('Product not added');
            }
        } catch (error) {
            setLoading(false)
            alert('Something went wrong')
            console.error(error);
        }
        e.target.reset();
        setLoading(false)
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
                                                        console.log(e.target.files)
                                                        console.log(e.target.files.length)
                                                        setFormData({
                                                            ...formData,
                                                            images: e.target.files ? [...e.target.files] : []
                                                        });
                                                    }}
                                                />
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white flex flex-col md:flex-row p-5 gap-3'>
                            <div className="flex flex-col md:grid md:grid-cols-2 gap-5">
                                <div className='col-span-1 flex flex-col gap-2'>
                                    <label className='font-semibold text-gray-300'>Emri i produktit</label>
                                    <input value={formData.productName} onChange={handleInputChange}
                                           name="productName" label="productName" variant="outlined"
                                           className='w-full rounded-lg p-3 border-[2px] border-gray-200'
                                           placeholder='Emri i Produktit'/>
                                </div>
                                <div className='col-span-1 flex flex-col gap-2'>
                                    <label className='font-semibold text-gray-300'>Type</label>
                                    <input value={formData.type} onChange={handleInputChange} name="type"
                                           label="type" variant="outlined"
                                           className='w-full rounded-lg p-3 border-[2px] border-gray-200'
                                           placeholder=''/>
                                </div>
                                <div className='flex col-span-1 flex-row gap-5'>
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
                                    <div className='flex col-span-1 flex-col w-[50%] gap-2'>
                                        <label className='w-full font-semibold text-gray-300'>Sasia (ml) (Optional)</label>
                                        <input
                                            type='number'
                                            onChange={(e) => {
                                                setFormData({...formData, size: e.target.value}); // Combines the numeric value with 'ml'
                                            }}
                                            className='border border-gray-200 py-2 rounded-lg px-2'
                                            placeholder='Enter size (e.g. 10ml)'
                                        />
                                    </div>
                                </div>
                                <div className='col-span-1 flex flex-col gap-2'>
                                    <label className='font-semibold text-gray-300'>Brand</label>
                                    <input value={formData.brand} onChange={handleInputChange} name="brand"
                                           label="brand" variant="outlined"
                                           className='w-full rounded-lg p-3 border-[2px] border-gray-200'
                                           placeholder=''/>
                                </div>
                                <div className='col-span-2 flex flex-col gap-2 '>
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
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className='w-[300px] h-[200px]'>
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
                                <div className="">
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
                                <Button disabled={loading} type="submit"
                                        variant="contained"
                                        style={{
                                            background: '#128F96',
                                            boxShadow: 'none',
                                            border: 'none',
                                            padding: '10px',
                                            paddingLeft: '30px',
                                            cursor: 'pointer',
                                            justifyItems: 'start',
                                            justifyContent: 'start',
                                            display: 'flex',
                                            gap: '20px',
                                            borderRadius: '10px',
                                            marginTop: '45px',
                                        }}
                                >
                                    <img src={saveIcon} className='w-[20px] h-[20px]'/>
                                    {!loading && <span className='font-bold text-white'>Rauj</span>}
                                    {
                                        loading && <span className="font-bold text-white">
                                           Adding ...
                                        </span>
                                    }
                                </Button>
                            </div>
                        </div>
                    </div>


                </div>

            </div>
        </form>

    )
}
export default AddProduct;