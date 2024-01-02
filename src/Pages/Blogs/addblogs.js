import React, {useEffect} from 'react';
import NavBar from '../../Components/navbar';
import Sidebar from '../../Components/sidebar';
import {TextField, Button} from '@mui/material';
import Fixed from '../../resources/fixed.png';
import AddPhoto from '../../resources/addphoto.png';
import camera from '../../resources/camera.png'
import saveIcon from '../../resources/save.png'
import {useRef, useState} from 'react';
import axios from 'axios';
import AWS from 'aws-sdk';
import {useNavigate} from 'react-router-dom';

const AddBlog = () => {
    const fileInput = useRef(null);
    const [formData, setFormData] = useState({
        blogTitle: '',
        description: '',
        blogTitleENG: '',
        descriptionENG: '',
        images: [],
        imagenames: []
    });

    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('token') === null){
            navigate('/login')
        }
        if(localStorage.getItem('role') !== 'admin'){
            alert('You are not authorized to view this page')
            navigate('/blogs')
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
        if (formData.blogTitle == '' || formData.description == '' || formData.images.length == 0) {
            alert('Ploteso te gjitha fushat!');
            return;
        }

        for (let i = 0; i < formData.images.length; i++) {
            if (formData.images[i]) {
                const imageUploadResponse = await uploadImage(formData.images[i], 'blog-add-on-image');
                if (imageUploadResponse.success) {
                    console.log(`Add-on image uploaded with filename: ${imageUploadResponse.filename}`);
                    imageNames.push(imageUploadResponse.filename);
                } else {
                    console.error(`Failed to upload add-on image: ${imageUploadResponse.error}`);
                    return;
                }
            }
        }

        const updatedFormData = {
            ...formData,
            imagenames: imageNames,
        };

        try {
            console.log("Blog adding...");
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/blogs/addblog`, updatedFormData);
            console.log("Blog added");
            if(res.status === 201){
                alert('Blogu u shtua me sukses!');
            }
            navigate('/blogs');
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
                    <div className='flex flex-col items-center justify-center gap-5 mt-10 align-middle'>
                        <div className='items-start justify-start w-2/3'>
                            <button onClick={() => navigate('/blogs')}
                                    className='py-2 px-5 rounded-lg bg-[#128F96] font-bold text-white hover:bg-cyan-700 transition-all duration-200'>Kthehu
                            </button>
                        </div>
                        <div className='items-center w-2/3 bg-white rounded-lg h-18 '>
                            <div className='flex items-center justify-between p-5 '>
                                <h2 className='text-2xl font-bold'>Add Blog</h2>
                                {
                                    formData.images.length > 0 && (
                                        <div className='flex flex-row gap-3'>
                                            {Array.from(formData.images).map((image, index) => (
                                                <div key={index}>
                                                    <img src={URL.createObjectURL(image)} className='w-[50px] h-[50px]'
                                                         alt={`Image ${index}`}/>
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
                            <div className='w-[40%] flex flex-col gap-10 justify-between h-full'>
                                <div className='flex flex-col w-full gap-5'>
                                    <h className="font-bold">Enter Information in Albanina</h>
                                    <div className='flex flex-col gap-2'>
                                        <label className='font-semibold text-gray-300'>TITULLI I BLOG-UT</label>
                                        <input value={formData.blogTitle} onChange={handleInputChange} name="blogTitle"
                                               label="Blog Title" variant="outlined"
                                               className='w-full rounded-lg p-3 border-[2px] border-gray-200'
                                               placeholder='Titulli i Blog-ut'/>
                                    </div>
                                    <div className='flex flex-col gap-2 '>
                                        <label className='font-semibold text-gray-300'>Kontenti</label>
                                        <textarea
                                            label="To satisfy"
                                            name="description"

                                            onChange={handleInputChange}
                                            multiline
                                            rows={4}
                                            variant="outlined"
                                            className=' rounded-lg border-[2px] border-gray-200 p-2 w-full'
                                        />
                                    </div>
                                </div>
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
                            <div className='w-[40%] flex flex-col gap-5 '>
                                <h className="font-bold">Enter Information in English</h>
                                <div className='flex flex-col gap-2'>
                                    <label className='font-semibold text-gray-300'>Blog Title</label>
                                    <input value={formData.blogTitleENG} onChange={handleInputChange} name="blogTitleENG"
                                            label="Blog Title" variant="outlined"
                                            className='w-full rounded-lg p-3 border-[2px] border-gray-200'
                                            placeholder='Titulli i Blog-ut'/>
                                </div>
                                <label className='font-semibold text-gray-300'>Description</label>
                                <textarea
                                    label="To satisfy"
                                    name="descriptionENG"

                                    onChange={handleInputChange}
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    className=' rounded-lg border-[2px] border-gray-200 p-2 w-full'
                                />
                            </div>
                        </div>

                    </div>
                </div>
                <input type="file" ref={fileInput} style={{display: 'none'}} onChange={handleFileChange}/>
            </div>
        </form>

    )
}
export default AddBlog;