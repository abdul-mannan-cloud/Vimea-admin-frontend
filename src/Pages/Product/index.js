import React, {useState} from 'react';
import NavBar from '../../Components/navbar';
import Sidebar from '../../Components/sidebar';
import AddProduct from '../../resources/addproduct.png';
import {useNavigate} from 'react-router-dom';
import {useEffect} from 'react';
import axios from 'axios';
import {TextField, Button} from '@mui/material';
import Fixed from '../../resources/fixed.png';
import AddPhoto from '../../resources/addphoto.png';
import Plus from '../../resources/Plus.png'
import {useRef} from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import AWS from 'aws-sdk';
import {Input} from "@mui/icons-material";


const Products = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showImageInput, setShowImageInput] = useState(false);
    const [allProducts, setAllProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const types = [
        'Lodra Aktiviteti',
        'Banje dhe ndërrim',
        'Krema për fëmijë dhe të tjera',
        'Karroca dhe sedilje të makinës',
        'Mobilje për fëmijë'
    ]

    const typesEng = [
        'Activity Toyes',
        'Bathing & Changing',
        'Baby Cream and more',
        'Car Seat and Stroller',
        'Nursery Furniture'
    ]

    const brands = [
        'Baby Fehn',
        'Huggies',
        'Mabyen',
        'Stokke',
        'Vimea',
        'Baby Zen',
        'Baby Rotho',
        'MOMCOZY',
        'Doona Stroller & Liki Trike'
        
        
    ]

    useEffect(() => {
        if (localStorage.getItem('token') === null) {
            navigate('/login')
        }
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/products/getallproducts`);
                setProducts(response.data.products);
                setAllProducts(response.data.products);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);


    const onDeleteClick = async () => {
        if (selectedProduct) {
            try {
                const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/products/deleteproduct/${selectedProduct._id}`);
                setProducts(products.filter(product => product._id !== selectedProduct._id));
                setSelectedProduct(null);
                setAllProducts(allProducts.filter(product => product._id !== selectedProduct._id));
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };


    const spacesEndpoint = new AWS.Endpoint("nyc3.digitaloceanspaces.com");
    const s3 = new AWS.S3({
        endpoint: spacesEndpoint,
        accessKeyId: "DO00B86B2J6M8JRAFFMR",
        secretAccessKey: "XxvAhR8M2aF8ZYDliQ5kuvDvKEMwIr1BKUKJi7g7Bv4",
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


    const handleProductClick = (product) => {
        if (selectedProduct === product) {
            setSelectedProduct(null);
            setShowForm(false);
            setFormData({
                id: '',
                productName: '',
                price: '',
                quantity: 0,
                type: '',
                size: '',
                brand: '',
                description: '',
                mainImage: '',
                addonImages: [],
                productNameENG: '',
                descriptionENG: '',
                nameENG: '',
                typeENG: '',
            });
        } else {
            setSelectedProduct(product);
            setShowForm(true);
            setFormData({
                id: product._id || '',
                productName: product.name || '',
                price: product.price || '',
                quantity: product.quantity || 0,
                type: product.type || '',
                size: (product.size) || '',
                brand: product.brand || '',
                description: product.description || '',
                mainImage: product.mainImage || '',
                addonImages: product.addonImages || [],
                productNameENG: product.nameENG || '',
                descriptionENG: product.descriptionENG || '',
                typeENG: product.typeENG || '',
            });
        }
    };

    const handleFileChange = (index, e) => {
        const file = e.target.files;
    };

    const fileInput = useRef(null);
    const [formData, setFormData] = useState({
        id: '',
        productName: '',
        price: '',
        quantity: '',
        type: '',
        brand: '',
        size: '',
        description: '',
        mainImage: '',
        addonImages: [],
        productNameENG: '',
        descriptionENG: '',
        typeENG: '',
    });

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageDelete = (index) => {
        const updatedImages = [...formData.addonImages];
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
            addonImages: updatedImages,
        });
    };

    const handleImageColorChange = (index, e) => {
        var updatedImages = [...formData.addonImages];
        updatedImages[index] = {
            file: updatedImages[index].file ? updatedImages[index].file : updatedImages[index],
            color: e.target.value
        }
        setFormData({
            ...formData,
            addonImages: updatedImages,
        });
    }

    useEffect(() => {
        console.log(formData.addonImages)
    }, [formData.addonImages])

    const handleNewFormSubmit = async (e) => {
        e.preventDefault();
        let imageNames = [];

        // if (formData.images[0]) {
        //     if(typeof formData.images[0] !== 'string') {
        //         const imageUploadResponse = await uploadImage(formData.images[0], 'main-image');
        //         if (imageUploadResponse.success) {
        //             console.log(`Main image uploaded with filename: ${imageUploadResponse.filename}`);
        //             imageNames.push(imageUploadResponse.filename);
        //         } else {
        //             console.error(`Failed to upload main image: ${imageUploadResponse.error}`);
        //             return;
        //         }
        //     }
        // }

        var mainImage = formData.mainImage.file ? formData.mainImage.file : formData.mainImage;
        if (typeof (formData.mainImage.file ? formData.mainImage.file : formData.mainImage) !== 'string') {
            const imageUploadResponse = await uploadImage(formData.mainImage.file ? formData.mainImage.file : formData.mainImage, 'main-image');
            if (imageUploadResponse.success) {
                console.log(`Main image uploaded with filename: ${imageUploadResponse.filename}`);
                mainImage = imageUploadResponse.filename;
            } else {
                console.error(`Failed to upload main image: ${imageUploadResponse.error}`);
                return;
            }
        }

        for (let i = 0; i < formData.addonImages.length; i++) {
            const image = formData.addonImages[i];
            if (typeof (image.file ? image.file : image) !== 'string') {
                console.log('testing here')
                const imageUploadResponse = await uploadImage(image.file ? image.file : image, `addon-image-${i}`);
                if (imageUploadResponse.success) {
                    console.log(`Addon image ${i} uploaded with filename: ${imageUploadResponse.filename}`);
                    imageNames.push({
                        file: imageUploadResponse.filename,
                        color: image.color
                    });
                } else {
                    console.error(`Failed to upload addon image ${i}: ${imageUploadResponse.error}`);
                    return;
                }
            } else {
                imageNames.push(image);
            }
        }

        const updatedFormData = {
            ...formData,
            mainImage: typeof mainImage === 'string' ? mainImage : {},
            addonImages: [...imageNames],
        };

        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/products/editproduct`, updatedFormData);
            if (res.status == 200) {
                // update the state
                const updatedProducts = [...products];
                const productIndex = updatedProducts.findIndex(product => product._id === selectedProduct._id);
                updatedProducts[productIndex] = res.data.updatedProduct;
                setProducts(updatedProducts);
                setAllProducts(updatedProducts);
            }
        } catch (error) {
            console.error(error);
        }

        e.target.reset();
        setSelectedProduct(null);
        setShowForm(false);
        return false;
    };

    useEffect(() => {
        setProducts(allProducts.filter((product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.type.toLowerCase().includes(searchQuery.toLowerCase())
        ));
    }, [searchQuery])

    return (
        <div className='flex h-screen bg-gray-100'>
            <div className='flex flex-col w-full overflow-auto'>
                <div className='flex flex-col items-center space-y-4 w-full sm:px-20 pl-16 pr-1'>
                    <div className='flex sm:flex-row flex-col gap-y-2 items-end justify-end mt-32 w-full'>
                        <input placeholder='Kerko produktin'
                               className='w-[250px] h-[45px] px-2 py-3 rounded-md sm:mr-2 mr-0'
                               onChange={(e) => {
                                   setSearchQuery(e.target.value);
                               }}/>
                        <div
                            onClick={() => navigate('/products/add')}
                            className='flex gap-3 px-3 py-2 bg-[#128F96] rounded-xl justify-center items-center hover:bg-cyan-700 transition-all duration-200 cursor-pointer'
                        >
                            <img src={Plus} className=''/>
                            <span className='sm:text-lg text-base font-bold text-white'>Shto</span>
                        </div>
                    </div>
                    {products.map((product, index) => (
                        <div key={index} className='w-full sm:px-16 overflow-auto'>
                            <div
                                className={`border shadow-lg py-5 sm:px-10 px-5 gap-x-10 gap-y-2 rounded-lg w-full  flex sm:flex-row flex-col sm:items-center sm:justify-between bg-white ${
                                    selectedProduct === product ? 'mb-2' : 'mb-4'
                                }`}
                                onClick={() => handleProductClick(product)}
                            >
                                <h2 className='font-bold text-2xl min-w-[400px] w-[400px] max-w-[400px] overflow-hidden whitespace-nowrap'>{product.name}</h2>
                                <p> {product.type}</p>
                                <p>€ {product.price}</p>
                                <div className='flex flex-row gap-5 overflow-scroll'>
                                    <img src={`https://vimea.nyc3.cdn.digitaloceanspaces.com/${product.mainImage}`}
                                         className='w-[100px] h-[100px] rounded-lg' alt='Foto 1'/>
                                    <img src={`https://vimea.nyc3.cdn.digitaloceanspaces.com/${product.addonImages[1]}`}
                                         className='w-[100px] h-[100px] rounded-lg' alt='Foto 2'/>
                                    <img src={`https://vimea.nyc3.cdn.digitaloceanspaces.com/${product.addonImages[2]}`}
                                         className='w-[100px] h-[100px] rounded-lg' alt='Foto 3'/>
                                </div>
                            </div>
                            {selectedProduct === product && (
                                <form
                                    className='border rounded-lg w-full mb-4'
                                    onSubmit={handleNewFormSubmit}
                                    id='formID'
                                    encType='multipart/form-data'
                                >
                                    <div className='flex sm:flex-row flex-col justify-center'>
                                        <div
                                            className='p-4 sm:max-w-7xl sm:w-3/3 sm:l-1/3 rounded-lg bg-white flex sm:flex-row flex-col justify-between'>
                                            <div>
                                                <div className="grid sm:grid-cols-3 grid-cols-1 gap-5 mb-5">
                                                    <TextField value={formData.productName} onChange={handleInputChange}
                                                               name="productName" label="Emri i Produktit (AL)"
                                                               variant="outlined"
                                                               className='sm:col-span-1 col-span-21'/>
                                                    <TextField value={formData.productNameENG}
                                                               onChange={handleInputChange}
                                                               name="productNameENG" label="Emri i Produktit (EN)"
                                                               variant="outlined"
                                                               className='sm:col-span-1 col-span-2'/>
                                                    <TextField name="price" label="Çmimi" value={formData.price}
                                                               onChange={handleInputChange} variant="outlined"
                                                               className='sm:col-span-1 col-span-2'/>
                                                    <TextField label="Sasia" name="quantity"
                                                               value={formData.quantity} onChange={handleInputChange}
                                                               variant="outlined" className='sm:col-span-1 col-span-2'/>
                                                    <select onChange={e => {
                                                        setFormData({...formData, type: e.target.value})
                                                    }}
                                                            value={formData.type}
                                                            className='sm:col-span-1 col-span-2 border-[1px] border-gray-300 rounded'>
                                                        {types.map((type) => (
                                                            <option value={type}>{type}</option>
                                                        ))}
                                                    </select>


                                                    <select onChange={e => {
                                                        setFormData({...formData, typeENG: e.target.value})
                                                    }}
                                                            value={formData.typeENG}
                                                            className='sm:col-span-1 col-span-2 border-[1px] border-gray-300 rounded'>
                                                        {typesEng.map((type) => (
                                                            <option value={type}>{type}</option>
                                                        ))}
                                                    </select>
                                                    <select name="brand" value={formData.brand}
                                                            onChange={handleInputChange}
                                                            className='sm:col-span-1 col-span-2 border-[1px] border-gray-300 rounded'>
                                                        {brands.map((brand) => (
                                                            <option value={brand}>{brand}</option>
                                                        ))}
                                                    </select>
                                                    <TextField label="Madhësia" name="size"
                                                               value={formData.size}
                                                               onChange={handleInputChange} variant="outlined"
                                                               className='sm:col-span-1 col-span-2'/>
                                                    <TextField
                                                        label="Përshkrimi (AL)"
                                                        name="description"
                                                        value={formData.description}
                                                        onChange={handleInputChange}
                                                        multiline
                                                        rows={4}
                                                        variant="outlined"
                                                        className='col-span-2'
                                                    />
                                                    <TextField
                                                        label="Përshkrimi (EN)"
                                                        name="descriptionENG"
                                                        value={formData.descriptionENG}
                                                        onChange={handleInputChange}
                                                        multiline
                                                        rows={4}
                                                        variant="outlined"
                                                        className='col-span-2'
                                                    />
                                                    <div className='sm:col-span-1 col-span-2'>
                                                        <input
                                                            type="file"
                                                            className=""
                                                            accept="image/png, image/jpg"
                                                            name="mainImage"
                                                            id="mainImage"
                                                            onChange={(e) => setFormData({
                                                                ...formData,
                                                                mainImage: {
                                                                    file: e.target.files[0],
                                                                    color: ''
                                                                }
                                                            })}
                                                        />
                                                        <input
                                                            name="color"
                                                            className="border-2 border-gray-300 rounded-lg px-2"
                                                            value={formData.mainImage.color}
                                                            placeholder={"Ngjyra (Hex Code)"}
                                                            onChange={(e) => {
                                                                setFormData({
                                                                    ...formData,
                                                                    mainImage: {
                                                                        file: formData.mainImage.file,
                                                                        color: e.target.value
                                                                    }
                                                                })
                                                            }}
                                                        />
                                                        <div className='sm:pt-2 pt-4'>
                                                            <img src={AddPhoto} alt='Product'
                                                                 className=' border border-teal-500 rounded-lg w-[150px] h-[50px] mb-4 '/>
                                                        </div>

                                                    </div>
                                                </div>
                                                <div className="flex flex-row gap-5">
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        style={{
                                                            backgroundColor: '#128F96',
                                                            color: 'white',
                                                            height: '55px',
                                                            width: '220px',
                                                            marginBottom: '10px',
                                                        }}
                                                    >
                                                        Ruaj
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        style={{
                                                            backgroundColor: 'red',
                                                            color: 'white',
                                                            height: '55px',
                                                            width: '220px'
                                                        }}
                                                        startIcon={<DeleteIcon/>}
                                                        onClick={onDeleteClick}
                                                    >
                                                        Fshij
                                                    </Button>

                                                </div>
                                                <div className="flex flex-col gap-5">
                                                    <h1 className="text-2xl font-bold">Shto Foto</h1>
                                                    <div className="flex gap-10 flex-wrap items-center justify-center">
                                                        {
                                                            formData.addonImages.map((image, index) => (
                                                                <div className="flex flex-col max-w-[250px] gap-3">
                                                                    {typeof (image.file ? image.file : image) === 'string' ? (
                                                                        <img
                                                                            src={`https://vimea.nyc3.cdn.digitaloceanspaces.com/${image.file ? image.file : image}`}
                                                                            className='w-[250px] h-[250px] rounded-lg'
                                                                            alt={image}
                                                                        />
                                                                    ) : (
                                                                        <img
                                                                            src={URL.createObjectURL(image.file ? image.file : image)}
                                                                            className='w-[250px] h-[250px] rounded-lg'
                                                                            alt={image.file ? image.file.name : image.name}
                                                                        />
                                                                    )}
                                                                    <input name="color"
                                                                           className="border-2 border-gray-300 rounded-lg px-2"
                                                                           placeholder={"Ngjyra (Hex Code)"}
                                                                           value={image.color}
                                                                           onChange={(e) => {
                                                                               handleImageColorChange(index, e)
                                                                           }}/>
                                                                    <button type="button" onClick={() => {
                                                                        handleImageDelete(index)
                                                                        setSelectedProduct(product);
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
                                                            const newImage = {
                                                                file: e.target.files[0],
                                                                color: ''
                                                            }
                                                            setFormData({
                                                                ...formData,
                                                                addonImages: [...formData.addonImages, newImage]
                                                            });
                                                        }} className={``}/>}
                                                    </div>
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

export default Products;
