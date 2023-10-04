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


const handleProductClick = (product) => {
    if (selectedProduct === product) {
      setSelectedProduct(null);
      setShowForm(false);
      setFormData({
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
        productName: product.name || '',
        price: product.price || '',
        quantity: product.quantity || '',
        type: product.type || '',
        size1: (product.size && product.size[0]) || '',
        size2: (product.size && product.size[1]) || '',
        size3: (product.size && product.size[2]) || '',
        description: product.description || '',
        coverimage: '', 
        images: [], 
      });
    }
  };
  

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
});


const handleFileChange = (index, e) => {
}

const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
};

const handleNewFormSubmit = async (e) => {
    e.preventDefault();
    
    console.log(formData);
  
    // let formDataToSend = new FormData();
    // formDataToSend.append('productName', formData.productName);
    // formDataToSend.append('price', formData.price);
    // formDataToSend.append('quantity', formData.quantity);
    // formDataToSend.append('type', formData.type);
    // formDataToSend.append('size1', formData.size1);
    // formDataToSend.append('size2', formData.size2);
    // formDataToSend.append('size3', formData.size3);
    // formDataToSend.append('description', formData.description);
    // formDataToSend.append('coverImage', formData.coverimage); 
    // for (let i = 0; i < formData.images.length; i++) {
    //   formDataToSend.append(`images`, formData.images[i]);
    // }
  
    try {
  
      const response = await axios.post('http://localhost:3001/products/editproduct', formData);
      console.log(response.data.filenames);
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
            <div key={index} className='w-full'>
              <div
                className={`border p-4 rounded-lg w-full ${
                  selectedProduct === product ? 'mb-2' : 'mb-4'
                }`}
                onClick={() => handleProductClick(product)}
              >
                <h2 className='font-bold mb-3'>{product.name}</h2>
                <p> {product.type}</p>
                <p>Є {product.price}</p>
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
                            <TextField label="Size 1" name="size1" value={formData.size0} onChange={handleInputChange} variant="outlined" className='mb-2 w-[100px]' />
                            <TextField label="Size 2" name="size2" value={formData.size1} onChange={handleInputChange} variant="outlined" className='mb-2 w-[100px]' />
                            <TextField label="Size 3" name="size3" value={formData.size2} onChange={handleInputChange} variant="outlined" className='mb-2 w-[100px]' />

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
