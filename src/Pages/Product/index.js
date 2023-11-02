import React, { useState } from 'react';
import NavBar from '../../Components/navbar';
import Sidebar from '../../Components/sidebar';
import AddProduct from '../../resources/addproduct.png';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { TextField, Button } from '@mui/material';
import Fixed from '../../resources/fixed.png';
import AddPhoto from '../../resources/addphoto.png';
import { useRef } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import AWS from 'aws-sdk';


const Products = () => {
const navigate = useNavigate();

const [products, setProducts] = useState([]);
const [showForm, setShowForm] = useState(false); 
const [selectedProduct, setSelectedProduct] = useState(null); 

useEffect(() => {
const fetchProducts = async () => {
    try {
    const response = await axios.get('http://localhost:3001/products/getallproducts');
    setProducts(response.data.products);
    } catch (error) {
    console.error('Error fetching products:', error);
    }
};

fetchProducts();
}, []);


  const onDeleteClick = async () => {
    if (selectedProduct) {
      try {
        const response = await axios.delete(`http://localhost:3001/products/deleteproduct/${selectedProduct._id}`);
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




const handleProductClick = (product) => {
  if (selectedProduct === product) {
    setSelectedProduct(null);
    setShowForm(false);
    setFormData({
      id: '',
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
    });
  } else {
    setSelectedProduct(product);
    setShowForm(true);
    setFormData({
      id: product._id || '',
      productName: product.name || '',
      price: product.price || '',
      quantity: product.quantity || '',
      type: product.type || '',
      size1: (product.size && product.size[0]) || '',
      size2: (product.size && product.size[1]) || '',
      size3: (product.size && product.size[2]) || '',
      description: product.description || '',
      coverimage: product.coverimage || '', 
      images: product.images || [], 
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
size1: '',
size2: '',
size3: '',
description: '',
coverimage: '',
images: [],
});

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
  const updatedFormData = {
    ...formData,
    imagenames: imageNames,
};

console.log(updatedFormData);

  try {
    await axios.post('http://localhost:3001/products/editproduct', updatedFormData);
  } catch (error) {
    console.error(error);
  }
  
  e.target.reset();
  setSelectedProduct(null); 
  setShowForm(false); 
  return false;
};


  


return (
    <div className='flex h-screen'>
      <Sidebar />
      <div className='flex flex-col w-full overflow-auto'>
        <NavBar />
        <div className='pl-4 flex-grow bg-gray-100 flex flex-col items-center space-y-4'>
          <div className='pt-16 pr-16 flex items-end justify-end'>
            <img
              src={AddProduct}
              className='w-100 h-10 mb-4 rounded-lg cursor-pointer'
              alt='Image 1'
              onClick={() => navigate('/products/add')}
            />
          </div>
          {products.map((product, index) => (
            <div key={index} className='w-full px-16'>
              <div
                className={`border p-4 rounded-lg w-full h-20 flex items-center justify-between ${
                  selectedProduct === product ? 'mb-2' : 'mb-4'
                }`}
                onClick={() => handleProductClick(product)}
              >
                <h2 className='font-bold mb-3'>{product.name}</h2>
                <p> {product.type}</p>
                <p>Є {product.price}</p>
                <img src={`https://vimea.nyc3.cdn.digitaloceanspaces.com/${product.mainImage}`}  className='w-20 h-20 mb-2 rounded-lg' alt='Product image 1' />
                <img src={`https://vimea.nyc3.cdn.digitaloceanspaces.com/${product.addonImages[0]}`} className='w-20 h-20 rounded-lg' alt='Product image 2' />
              </div>
              {selectedProduct === product && (
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
                            <TextField value={formData.productName} onChange={handleInputChange} name="productName" label="productName" variant="outlined" className='mb-4 w-[300px]' />
                            <div className='flex flex-auto pt-4 pb-4 justify-between '>
                                <TextField name="price" label="price" value={formData.price} onChange={handleInputChange} variant="outlined" className='mb-2 w-[100px] ' />
                                <TextField label="quantity" name="quantity" value={formData.quantity} onChange={handleInputChange} variant="outlined" className='mb-2 w-[100px]' />
                                <TextField label="type" name="type" value={formData.type} onChange={handleInputChange} variant="outlined" className='mb-2 w-[100px]' />
                            </div>
                            <div className='flex flex-auto pb-4 justify-between  '>
                            <TextField label="Size 1" name="size1" value={formData.size1} onChange={handleInputChange} variant="outlined" className='mb-2 w-[100px]' />
                            <TextField label="Size 2" name="size2" value={formData.size2} onChange={handleInputChange} variant="outlined" className='mb-2 w-[100px]' />
                            <TextField label="Size 3" name="size3" value={formData.size3} onChange={handleInputChange} variant="outlined" className='mb-2 w-[100px]' />

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

export default Products;
