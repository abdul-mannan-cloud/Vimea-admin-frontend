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
  const [showForm, setShowForm] = useState(false); // State variable to control form visibility

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

  // Function to handle click on a product div
  const handleProductClick = () => {
    setShowForm(true); // Show the form when a product div is clicked
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
    console.log("Just before sending in function");
  
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
            <div
              key={index}
              className='border p-4 rounded-lg w-full h-20 flex items-center justify-between'
              onClick={handleProductClick} // Add the click handler here
            >
              <h2 className='font-bold mb-3'>{product.name}</h2>
              <p> {product.type}</p>
              <p>Є {product.price}</p>
            </div>
          ))}

          {showForm && (
            /* Render the form when showForm is true */
            <form className='' onSubmit={handleNewFormSubmit} id="formID" enctype="multipart/form-data">

            <div className='flex h-screen'>
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
                                    <TextField label="Size 1" name="size1" value={formData.size1} onChange={handleInputChange} variant="outlined" className='mb-2 w-[100px] ' />
                                    <TextField label="Size 2" name="size2" value={formData.size2} onChange={handleInputChange} variant="outlined" className='mb-2 w-[100px]' />
                                    <TextField label="Size 3" name="size3" value={formData.size3} onChange={handleInputChange} variant="outlined" className='mb-2 w-[100px]' />
                                </div>
                                <Button
  type="submit"
  variant="contained"
  style={{
    background: 'transparent', // Set the background to transparent
    boxShadow: 'none', // Remove any box shadow
    border: 'none', // Remove the border
    padding: 0, // Remove padding
    cursor: 'pointer', // Change cursor to pointer
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
      </div>
    </div>
  );
};

export default Products;
