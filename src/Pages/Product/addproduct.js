import React from 'react';
import NavBar from '../../Components/navbar';
import Sidebar from '../../Components/sidebar';
import { TextField, Button } from '@mui/material';
// import AddImage from '../../resources/profilePicture.png';
import Fixed from '../../resources/fixed.png';
import AddPhoto from '../../resources/addphoto.png';
// import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
// import { addProduct } from '../../Services/Product';
import axios from 'axios';

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
});

const handlePhotoUpload = (index) => {
    fileInput.current.index = index;
    fileInput.current.click();
}

const handleFileChange = (index, e) => {
    // const file = e.target.files[0];
    // const reader = new FileReader();
  
    // reader.onloadend = () => {
    //   const newImages = [...images];
    //   newImages[index] = reader.result;
    //   setImages(newImages);
    //     const imageDiv = document.getElementById(`imageDiv${index}`);
    //   if (imageDiv) {
    //     imageDiv.style.backgroundImage = `url(${reader.result})`;
    //     imageDiv.style.backgroundSize = 'cover';
    //     imageDiv.style.backgroundPosition = 'center';
    //   }
    // };
  
    // if (file) {
    //   reader.readAsDataURL(file);
    // }
  };
  

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
    let formDataToSend = new FormData();
    formDataToSend.append('productName', formData.productName);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('quantity', formData.quantity);
    formDataToSend.append('type', formData.type);
    formDataToSend.append('size1', formData.size1);
    formDataToSend.append('size2', formData.size2);
    formDataToSend.append('size3', formData.size3);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('images', formData.coverimage);
    for (let i = 0; i < formData.images.length; i++) {
        formDataToSend.append(`images`, formData.images[i]);
    }

    console.log(formDataToSend)
  
    try {
      const response = await axios.post('http://localhost:3001/products/addproduct', formDataToSend);
      console.log(response.data.filenames);
      
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
                                {/* <div className="w-24 h-24 bg-gray-300 relative" id="imageDiv0">
                            <input
                            type="file"
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                            accept="image/png, image/jpg"
                            name="image0"
                            id="file0"
                            onChange={(e) => handleFileChange(0, e)}
                            />
                            <label
                            className="absolute inset-0 flex items-center justify-center cursor-pointer"
                            htmlFor="file0"
                            >
                            Choose file
                            </label>
                        </div> */}
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
  {/* <p className='text-gray-500 text-sm font-semibold pl-4'>Foto e produktit</p> */}
  <input
      type="file"
      className=""
      accept="image/png, image/jpg"
      name="coverImage"
      id="coverImage"
      onChange={(e) => setFormData({ ...formData, coverimage: e.target.files[0] })}
    />
  {/* <div
    className='w-44 h-56 rounded-lg bg-gray-300 mx-2 pb-4 relative'
  >
    <input
      type="file"
      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
      accept="image/png, image/jpg"
      name="imagemain"
      id="filemain"
      onChange={(e) => handleFileChange(3, e)}
    />
    <label
      className="absolute inset-0 flex items-center justify-center cursor-pointer"
      htmlFor="filemain"
      style={{ cursor: 'pointer' }}
    >
      Choose file
    </label>
  </div> */}
  <div className='pl-5 pt-2'>
    <img src={AddPhoto} alt='Product' className=' border border-teal-500 rounded-lg w-[150px] h-[50px] mb-4 ' />
  </div>
</div>

                        </div>

                    </div>
                </div>
                <input type="file" ref={fileInput} style={{ display: 'none' }} onChange={handleFileChange} />
            </div>       
             </form>

)
}
export default AddProduct;