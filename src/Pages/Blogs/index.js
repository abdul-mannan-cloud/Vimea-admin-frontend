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

// useEffect(() => {
//   console.log("printning in use effect")
//   console.log(blogs);
// }, [blogs]);

    const handleProductClick = (blog) => {
        if (selectedBlogs === blog) {
            setSelectedBlogs(null);
            setShowForm(false);
            setFormData({
                blogTitle: '',
                description: '',
                coverimage: '',
                images: [],
            });
        } else {
            setSelectedBlogs(blog);
            setShowForm(true);
            setFormData({
                blogTitle: blog.blogTitle || '',
                description: blog.description || '',
                coverimage: blog.coverimage || '',
                images: blog.images || [],
            });
        }
    };


    const onDeleteClick = async () => {
        if (selectedBlogs) {
            try {
                const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/blogs/deleteblog/${selectedBlogs._id}`);
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
                        reject({success: false, error: err});
                    } else {
                        console.log('Upload Success');
                        resolve({success: true, filename: uniqueFileName});
                    }
                });
        });
    };


    const fileInput = useRef(null);
    const [formData, setFormData] = useState({
        blogTitle: '',
        description: '',
        coverimage: '',
        images: [],
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
        const updatedFormData = {
            ...formData,
            imagenames: imageNames,
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
        <div className='flex h-screen bg-gray-100'>
            <div className='flex flex-col w-full overflow-auto'>
                <div className='flex flex-col items-center w-full px-20 space-y-4 '>
                    <div className='flex items-end justify-end w-full mt-32'>
                        <input placeholder="Kërko" onChange={(e)=>setSearchQuery(e.target.value)} className="w-30 h-10 p-4 mr-2 rounded-lg border-black border-[1px]"/>
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
                                <h2 className='text-2xl font-bold'>{blog.blogTitle}</h2>
                                <p className="max-w-[500px] whitespace-nowrap overflow-hidden"> {blog.description}</p>
                                <div className='flex flex-row gap-5'>
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
                                    className='w-full mb-4 border rounded-lg'
                                    onSubmit={handleNewFormSubmit}
                                    id='formID'
                                    encType='multipart/form-data'
                                >
                                    <div className='flex justify-center'>
                                        <div
                                            className='p-4 max-w-7xl w-3/3 min-w-[1000px] l-1/3 rounded-lg bg-white flex flex-col justify-between'>
                                            <TextField value={formData.blogTitle} onChange={handleInputChange}
                                                       name="blogTitle" label="Blog Title" variant="outlined"
                                                       className='mb-4 w-[300px]'/>
                                            <div className='flex items-center justify-center'>
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
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>

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
                                            <div className="flex flex-col gap-5">
                                                <h1 className="text-2xl font-bold">Add-on Images</h1>
                                                <div className="flex gap-10">
                                                    {
                                                        formData.images.map((image, index) => (
                                                            <div className="flex flex-col max-w-[250px] gap-3">
                                                                {typeof image === 'string' ? (
                                                                    <img
                                                                        src={`https://vimea.nyc3.cdn.digitaloceanspaces.com/${image}`}
                                                                        className='w-[250px] h-[250px] rounded-lg'
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
                                                                    Delete
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
