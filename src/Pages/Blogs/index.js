import React, {useState} from 'react';
import NavBar from '../../Components/navbar';
import Sidebar from '../../Components/sidebar';
import AddBlogs from '../../resources/addBlogs.png';
import {useNavigate} from 'react-router-dom';
import {useEffect} from 'react';
import axios from 'axios';
import {TextField, Button} from '@mui/material';
import Fixed from '../../resources/fixed.png';
import AddPhoto from '../../resources/addphoto.png';
import Plus from '../../resources/Plus.png';
import {useRef} from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import AWS from 'aws-sdk';


const Blogs = () => {

    const navigate = useNavigate();

    const [blogs, setBlogs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedBlogs, setSelectedBlogs] = useState(null);
    const [showImageInput, setShowImageInput] = useState(false);
    const [allBlogs, setAllBlogs] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if(localStorage.getItem('token') === null){
            navigate('/login')
        }
    }, []);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/blogs/getallblogs`);
                setBlogs(response.data.blogs);
                setAllBlogs(response.data.blogs);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };
        fetchBlogs();
    }, []);


    const handleProductClick = (blog) => {
        console.log(blog)
        if (selectedBlogs === blog) {
            setSelectedBlogs(null);
            setShowForm(false);
            setFormData({
                blogTitle: '',
                description: '',
                blogTitleENG: '',
                descriptionENG: '',
                coverimage: '',
                images: [],
                mobileImages: [],
            });
        } else {
            setSelectedBlogs(blog);
            setShowForm(true);
            setFormData({
                blogTitle: blog.blogTitle || '',
                description: blog.description || '',
                blogTitleENG: blog.blogTitleENG || '',
                descriptionENG: blog.descriptionENG || '',
                coverimage: blog.coverimage || '',
                images: blog.images || [],
                mobileImages: blog.mobileImages || [],
            });
        }
    };


    const onDeleteClick = async () => {
        if (selectedBlogs) {
            try {
                const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/blogs/deleteblog/${selectedBlogs._id}`);
                if (response.status === 200) {
                    const updatedBlogs = blogs.filter((blog) => blog._id !== selectedBlogs._id);
                    setBlogs(updatedBlogs);
                    setAllBlogs(updatedBlogs)
                    setSelectedBlogs(null);
                    setShowForm(false);
                }
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
                        resolve({success: true, filename: uniqueFileName});
                    }
                });
        });
    };


    const fileInput = useRef(null);
    const [formData, setFormData] = useState({
        blogTitle: '',
        description: '',
        blogTitleENG: '',
        descriptionENG: '',
        coverimage: '',
        images: [],
        mobileImages: [],
    });

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

    const handleImageDelete = (index) => {
        const updatedImages = [...formData.images];
        const deletedImage = updatedImages.splice(index, 1)[0];

        if (deletedImage instanceof File) {
            // If the deleted image is a file (newly added), do any necessary cleanup.
            // For example, you might want to remove it from the file input.
            // fileInput.current.value = null;

        } else {
            // If the deleted image is a link (existing), you may want to perform any necessary cleanup on the server.
            // For example, you might want to delete the image from your storage.
            // Make a server request if needed.
        }

        setFormData({
            ...formData,
            images: updatedImages,
        });
    };

    const handleNewFormSubmit = async (e) => {
        e.preventDefault();
        let imageNames = [];

        for (let i = 0; i < formData.images.length; i++) {
            if (typeof formData.images[i] === 'string') {
                imageNames.push(formData.images[i]);
                continue;
            }
            const imageUploadResponse = await uploadImage(formData.images[i], 'blog-add-on-image');
            if (imageUploadResponse.success) {
                console.log(`Add-on image uploaded with filename: ${imageUploadResponse.filename}`);
                imageNames.push(imageUploadResponse.filename);

            } else {
                console.error(`Failed to upload add-on image: ${imageUploadResponse.error}`);
                return;
            }
        }
        for (let i = 0; i < formData.mobileImages.length; i++) {
            if (typeof formData.images[i] !== 'string') {
                const imageUploadResponse = await uploadImage(formData.mobileImages[i], 'blog-mobile-image');
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
            mobileImages: formData.mobileImages,
        };

        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/blogs/editblog`, {...updatedFormData,blogId:selectedBlogs._id});
            if(res.status === 200){
                // update the blogs state
                const updatedBlogs = [...blogs];
                const index = updatedBlogs.findIndex((blog) => blog._id === selectedBlogs._id);
                updatedBlogs[index] = res.data.blog;
                setBlogs(updatedBlogs);
                setAllBlogs(updatedBlogs)
            }
        } catch (error) {
            console.error(error);
        }

        e.target.reset();
        setSelectedBlogs(null);
        setShowForm(false);
        return false;
    };

    useEffect(() => {
        setBlogs(allBlogs.filter((blog) =>
            blog.blogTitle.toLowerCase().includes(searchQuery.toLowerCase()) || blog.description.toLowerCase().includes(searchQuery.toLowerCase())
        ));
    },[searchQuery]);

    return (
        <div className="flex h-screen bg-gray-100 ">
        <div className="flex flex-col w-full overflow-auto">
          <div className="flex flex-col items-center w-full sm:px-20 px-0 space-y-4 ">
            <div className="flex sm:flex-row flex-col items-end  justify-end  gap-y-2 w-full mt-32 gap-x-2  sm:pl-0 pl-16 sm:pr-0 pr-1">
                        <input placeholder="Kërko" onChange={(e)=>setSearchQuery(e.target.value)} className="w-30 h-10 p-4 mr-2 rounded-lg border-black border-[1px]"/>
                        <div
                            onClick={() => navigate('/blogs/add')}
                            className='flex gap-3 px-3 py-2 bg-[#128F96] rounded-xl justify-center items-center hover:bg-cyan-700 transition-all duration-200 cursor-pointer'
                        >
                            <img src={Plus} className=''/>
                            <span className='text-lg font-bold text-white'>Shto blogun</span>
                        </div>
                    </div>


                    {blogs.map((blog, index) => (
                        <div key={index} className='w-full sm:pl-0 pl-16 sm:pr-0 pr-1'>
                            <div
                                className={`border shadow-lg sm:py-5 py-4 sm:px-10 px-6 gap-y-3 rounded-lg w-full ${
                                    selectedBlogs === blog ? 'mb-2' : 'mb-3'
                                }`}
                                onClick={() => {
                                    handleProductClick(blog)
                                }}
                            >
                                <h2 className='text-2xl font-bold sm:w-1/2 '>{blog.blogTitle}</h2>
                                <p className="flex flex-col items-center sm:flex-row justify-between  gap-2 w-full"> {blog.description}</p>
                                <div className='sm:truncate sm:w-[40rem] text-justify'>
                                    {
                                        blog.images.length > 0 && (
                                            <img
                                                src={`https://vimea.nyc3.cdn.digitaloceanspaces.com/${blog.images[0]}`}
                                                className='w-[100px] h-[100px] rounded-lg' alt='Product image 2'/>
                                        )
                                    }
                                </div>

                            </div>
                            {selectedBlogs === blog && (
                                <form
                                    className='w-full mb-4 border rounded-md'
                                    onSubmit={handleNewFormSubmit}
                                    id='formID'
                                    encType='multipart/form-data'
                                >
                                    <div className='flex justify-center'>
                                        <div
                                            className='p-4 sm:w-1/2 w-full rounded-lg bg-white flex flex-col gap-y-5'>
                                            <div className='flex flex-row gap-10 justify-between'>
                                                <div className='flex flex-col gap-5 w-[50%]'>
                                                    <h className="font-bold">Blogu në gjuhën shqipe</h>
                                                    <TextField value={formData.blogTitle} onChange={handleInputChange}
                                                               name="blogTitle" label="Titulli i Blogut (AL)"
                                                               variant="outlined"
                                                               className='mb-4 w-full'
                                                    />
                                                    <TextField
                                                        label="Përshkrimi i Blogut (AL)"
                                                        name="description"
                                                        value={formData.description}
                                                        onChange={handleInputChange}
                                                        multiline
                                                        rows={4}
                                                        variant="outlined"
                                                        className='mb-4  w-full'
                                                    />
                                                </div>
                                                <div className='flex flex-col gap-5 w-[50%]'>
                                                    <h className="font-bold">Blogu në gjuhën angleze</h>
                                                    <TextField value={formData.blogTitleENG}
                                                               onChange={handleInputChange}
                                                               name="blogTitleENG" label="Titulli i Blogut (EN)"
                                                               variant="outlined"
                                                               className='mb-4 w-full'
                                                    />
                                                    <TextField
                                                        label="Përshkrimi i Blogut (EN)"
                                                        name="descriptionENG"
                                                        value={formData.descriptionENG}
                                                        onChange={handleInputChange}
                                                        multiline
                                                        rows={4}
                                                        variant="outlined"
                                                        className='mb-4  w-full'
                                                    />
                                                </div>
                                            </div>
                                            <div className='flex items-center justify-end'>
                                                <div className="flex flex-row gap-5">
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        style={{
                                                            backgroundColor: '#128F96',
                                                            color: 'white',
                                                        }}
                                                    >
                                                        Ruaj
                                                    </Button>

                                                    <Button
                                                        variant="contained"
                                                        style={{backgroundColor: 'red', color: 'white'}}
                                                        startIcon={<DeleteIcon/>}
                                                        onClick={onDeleteClick}
                                                    >
                                                        Fshij
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-5">
                                                <h1 className="text-2xl font-bold">Shto Foto</h1>
                                                <div className="flex flex-wrap sm:gap-x-5 sm:gap-y-5 gap-x-2 gap-y-5">
                                                    {
                                                        formData.images.map((image, index) => (
                                                            <div className="flex flex-col max-w-[250px] gap-3">
                                                                {typeof image === 'string' ? (
                                                                    <img
                                                                        src={`https://vimea.nyc3.cdn.digitaloceanspaces.com/${image}`}
                                                                        className='sm:w-[200px] sm:h-[200px] w-[100px] h-[100px] rounded-lg'
                                                                        alt={image}
                                                                    />
                                                                ) : (
                                                                    <img
                                                                        src={URL.createObjectURL(image)}
                                                                        className='w-[250px] h-[250px] rounded-lg'
                                                                        alt={image.name}
                                                                    />
                                                                )}
                                                                <button type="button" onClick={() => {
                                                                    handleImageDelete(index)
                                                                    setSelectedBlogs(blog);
                                                                }}
                                                                        className="bg-red-500 text-white rounded-lg px-2 py-1">
                                                                    Fshij
                                                                </button>
                                                            </div>
                                                        ))
                                                    }
                                                    <div onClick={() => setShowImageInput(!showImageInput)}
                                                         className="text-xl cursor-pointer hover:shadow-lg h-10 px-3 pt-1 place-self-center rounded-full border-2 border-black">
                                                        +
                                                    </div>
                                                    {showImageInput && <input type='file' onChange={(e) => {
                                                        setShowImageInput(false);
                                                        setFormData({
                                                            ...formData,
                                                            images: [...formData.images, e.target.files[0]]
                                                        });
                                                    }} className={``}/>}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-5">
                                                <h1 className="text-2xl font-bold">Shto Foto (Mobile)</h1>
                                                <div className="flex flex-wrap sm:gap-x-5 sm:gap-y-5 gap-x-2 gap-y-5">
                                                    {
                                                        formData.mobileImages.map((image, index) => (
                                                            <div className="flex flex-col max-w-[250px] gap-3">
                                                                {typeof image === 'string' ? (
                                                                    <img
                                                                        src={`https://vimea.nyc3.cdn.digitaloceanspaces.com/${image}`}
                                                                        className='sm:w-[200px] sm:h-[200px] w-[100px] h-[100px] rounded-lg'
                                                                        alt={image}
                                                                    />
                                                                ) : (
                                                                    <img
                                                                        src={URL.createObjectURL(image)}
                                                                        className='w-[250px] h-[250px] rounded-lg'
                                                                        alt={image.name}
                                                                    />
                                                                )}
                                                                <button type="button" onClick={() => {
                                                                    handleImageDelete(index)
                                                                    setSelectedBlogs(blog);
                                                                }}
                                                                        className="bg-red-500 text-white rounded-lg px-2 py-1">
                                                                    Fshij
                                                                </button>
                                                            </div>
                                                        ))
                                                    }
                                                    <div onClick={() => setShowImageInput(!showImageInput)}
                                                         className="text-xl cursor-pointer hover:shadow-lg h-10 px-3 pt-1 place-self-center rounded-full border-2 border-black">
                                                        +
                                                    </div>
                                                    {showImageInput && <input type='file' onChange={(e) => {
                                                        setShowImageInput(false);
                                                        setFormData({
                                                            ...formData,
                                                            mobileImages: [...formData.mobileImages, e.target.files[0]]
                                                        });
                                                    }} className={``}/>}
                                                </div>
                                            </div>
                                        </div>

                                        <input type="file" ref={fileInput} style={{display: 'none'}}
                                               onChange={handleFileChange}/>
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
