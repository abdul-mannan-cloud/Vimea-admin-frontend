import React from 'react';
import NavBar from '../../Components/navbar';
import Sidebar from '../../Components/sidebar';
import { TextField, Button } from '@mui/material';
import AddImage from '../../resources/profilePicture.png';
import Fixed from '../../resources/fixed.png';
import AddPhoto from '../../resources/addphoto.png';
import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import { addProduct } from '../../Services/Product';
import axios from 'axios';


const AddProduct = () => {

const fileInput = useRef(null);
const [images, setImages] = useState([null, null, null, null]);
const [formData, setFormData] = useState({
    productName: '',
    price: '',
    quantity: '',
    type: '',
    size1: '',
    size2: '',
    size3: '',
    description: '',
    mainimage: '',
    image1: '',
    image2: '',
    image3: '',
    image: '',
});

const handlePhotoUpload = (index) => {
    fileInput.current.index = index;
    fileInput.current.click();
}

const imageDivRefs = [useRef(null), useRef(null), useRef(null)];

const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    reader.onloadend = () => {
      const newImages = [...images];
      newImages[index] = reader.result;
      setImages(newImages);
  
      // Set the background image of the corresponding div
      const imageDiv = document.getElementById(`imageDiv${index}`);
      if (imageDiv) {
        imageDiv.style.backgroundImage = `url(${reader.result})`;
        imageDiv.style.backgroundSize = 'cover';
        imageDiv.style.backgroundPosition = 'center';
      }
    };
  
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  

const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
};


const handleSubmit = async (e) => {
    e.preventDefault();
    const imageAddresses = [];
    console.log(images);
    const uploadImages = async () => {
        for (let i = 0; i < images.length; i++) {
            if (images[i]) {
                const formDataToSend = new FormData();
                formDataToSend.append('image', images[i]);
                console.log(formDataToSend.get('image'));
                try {
                    const response = await axios.post('http://localhost:3001/upload', formDataToSend);
                    console.log(response.data.address);
                    imageAddresses.push(response.data.address);
                } catch (error) {
                    console.error(error);
                }
            }
        }
    };

    // Upload images and then send the form data with image addresses
    await uploadImages();

    const formDataToSend = new FormData();
    formDataToSend.append('productName', formData.productName);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('quantity', formData.quantity);
    formDataToSend.append('type', formData.type);
    formDataToSend.append('size1', formData.size1);
    formDataToSend.append('size2', formData.size2);
    formDataToSend.append('size3', formData.size3);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('mainimage', images[0]);
    formDataToSend.append('image1', images[1]);
    formDataToSend.append('image2', images[2]);
    formDataToSend.append('image3', images[3]);
    formDataToSend.append('imageaddresses', JSON.stringify(imageAddresses));

    try {
        const response = await axios.post('http://localhost:3001/products/addproducts', formDataToSend);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

const handleNewFormSubmit = async (e) => {
    e.preventDefault();
    console.log("Just before sending in function");
    let formDataToSend = new FormData(document.getElementById("formID"));
    console.log(formDataToSend);
    try {
      const response = await axios.post('http://localhost:3001/upload', formDataToSend);
      console.log(response.data.address);
    } catch (error) {
      console.error(error);
    }
    e.target.reset();
    return false;
  };
  

return (
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
            <form className='' onSubmit={handleNewFormSubmit} id="formID" enctype="multipart/form-data">

                    <div className="w-24 h-24 bg-gray-300 relative" id="imageDiv0">
            <input
            type="file"
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            accept="image/png, image/jpg"
            name="image"
            id="file0"
            onChange={(e) => handleFileChange(0, e)}
            />
            <label
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            htmlFor="file0"
            >
            Choose file
            </label>
        </div>
        </form>

      <div className="w-24 h-24 bg-gray-300 relative" id="imageDiv1">
        <input
          type="file"
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          accept="image/png, image/jpg"
          name="image1"
          id="file1"
          onChange={(e) => handleFileChange(1, e) }
        />
        <label
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          htmlFor="file1"
        >
          Choose file
        </label>
      </div>

      <div className="w-24 h-24 bg-gray-300 relative" id="imageDiv2">
        <input
          type="file"
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          accept="image/png, image/jpg"
          name="image2"
          id="file2"
          onChange={(e) => handleFileChange(2, e)}
        />
        <label
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          htmlFor="file2"
        >
          Choose file
        </label>
      </div>

                                {/* <div className='w-24 h-24 bg-gray-300' onClick={() => handlePhotoUpload(0)} style={{ backgroundImage: `url(${images[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                            <div className=''>
                                                <label className="custom-file-label" htmlFor="file" style={{ cursor: 'pointer' }}>
                                                <input
                                                    type="file"
                                                    className="custom-file-input"
                                                    id="file"
                                                    accept='image/png; image/jpg'
                                                    name="image"
                                                    onChange={(e) => handleFileChange(0, e)}
                                                    style={{ display: 'none' }}
                                                />
                                                Choose file
                                                </label>
                                            </div>
                                            </div> */}

                                            {/* <div className='w-24 h-24 bg-gray-300 mx-2' onClick={() => handlePhotoUpload(1)} style={{ backgroundImage: `url(${images[1]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                                    <div className=''>
                                                        <label className="custom-file-label" htmlFor="file1" style={{ cursor: 'pointer' }}>
                                                        <input
                                                            type="file"
                                                            className="custom-file-input"
                                                            id="file1"
                                                            accept='image/png; image/jpg'
                                                            name="image1"
                                                            onChange={(e) => handleFileChange(1, e)}
                                                            style={{ display: 'none' }}
                                                        />
                                                        Choose file
                                                        </label>
                                                    </div>
                                                    </div>
                                                    <div className='w-24 h-24 bg-gray-300' onClick={() => handlePhotoUpload(2)} style={{ backgroundImage: `url(${images[2]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                                    <div className=''>
                                                        <label className="custom-file-label" htmlFor="file2" style={{ cursor: 'pointer' }}>
                                                        <input
                                                            type="file"
                                                            className="custom-file-input"
                                                            id="file2"
                                                            accept='image/png; image/jpg'
                                                            name="image2"
                                                            onChange={(e) => handleFileChange(2, e)}
                                                            style={{ display: 'none' }}
                                                        />
                                                        Choose file
                                                        </label>
                                                    </div>
                                                    </div> */}
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
                                <Button type="submit" variant="contained" color="primary">
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
                                <p className='text-gray-500 text-sm font-semibold pl-4'>Foto e produktit</p>
                                {/* <div className='w-44 h-56 rounded-lg bg-gray-300 mx-2 pb-4' onClick={() => handlePhotoUpload(3)} style={{ backgroundImage: `url(${images[3]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
<div className='pl-5 pt-2'>
<label className="custom-file-label" htmlFor="file3" style={{ cursor: 'pointer' }}>
    <input
    type="file"
    className="custom-file-input"
    id="file3"
    accept='image/png; image/jpg'
    name="image3"
    onChange={(e) => handleFileChange(3, e)}
    style={{ display: 'none' }}
    />
    Choose file
</label>
</div>
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
            //  </form>
            

)
}

export default AddProduct;




        {/* <form className='' onSubmit={handleNewFormSubmit} id="formID" enctype="multipart/form-data">
            <div className=''>

                <div className="input-group mb-3">
                    <div className="custom-file py-1">
                        <input type="file" className="custom-file-input" id="file" accept='image/png; image/jpg' name="image"  />
                        <div className="custom-file-label" for="file"></div>
                    </div>
                </div>
            </div>

            <div className='d-flex justify-content-end'>
                <button type='submit' className='btn btn-primary'>Send</button>
            </div>
        </form> */}