import React from 'react';
import NavBar from '../../Components/navbar';
import Sidebar from '../../Components/sidebar';
import {TextField, Button} from '@mui/material';
import AddImage from '../../resources/profilePicture.png';
import Fixed from '../../resources/fixed.png';
import AddPhoto from '../../resources/addphoto.png';

const AddProduct = () => {  
return (
    <div className='flex h-screen'>
        <Sidebar />
        <div className='flex flex-col w-full overflow-auto'>
            <NavBar />
            <div className='pl-4 flex-grow bg-gray-100 flex flex-col items-center space-y-4'>
                <br/>
                <div className='p-18 w-2/3 h-18 items-center rounded-lg bg-white '>
<div className='p-10 flex justify-between items-center '>
    <h2 className='text-2xl font-bold'>Add Product</h2>
    <div className='flex justify-end items-center'>
        <div className='w-24 h-24 bg-gray-300'></div>
        <div className='w-24 h-24 bg-gray-300 mx-2'></div>
        <div className='w-24 h-24 bg-gray-300'></div>
    </div>
</div>
</div>

                <br/>
                <div className='p-36 max-w-7xl w-2/3 l-1/3 h-[450px] rounded-lg bg-white flex justify-between'>
                    <div>
                        <TextField label="Product Name" variant="outlined" className='mb-4 w-[300px]' />
                        <div className='flex flex-auto pt-4 pb-4 justify-between '>
                            <TextField label="Price" variant="outlined" className='mb-2 w-[100px] ' />
                            <TextField label="Quantity" variant="outlined" className='mb-2 w-[100px]' />
                            <TextField label="Type" variant="outlined" className='mb-2 w-[100px]' />
                        </div>
                        <div className='flex flex-auto pb-4 justify-between  '>
                            <TextField label="Size 1" variant="outlined" className='mb-2 w-[100px] ' />
                            <TextField label="Size 2" variant="outlined" className='mb-2 w-[100px]' />
                            <TextField label="Size 3" variant="outlined" className='mb-2 w-[100px]' />
                        </div>
                        <img src={Fixed} alt='Product' className='mb-4' />
                    </div>
                    <div>
                        <TextField
                            label="Description"
                            multiline
                            rows={4}
                            variant="outlined"
                            className='mb-4  w-[300px]'
                        />
                    </div>
                    <div className=''>
                    <p className='text-gray-500 text-sm font-semibold pl-4'>Foto e produktit</p>
                    <div className='w-44 h-56 rounded-lg bg-gray-300 mx-2 pb-4'></div>
                      <div className='pl-5 pt-2'>
                        <img src={AddPhoto} alt='Product' className=' border border-teal-500 rounded-lg w-[150px] h-[50px] mb-4 ' />
                        </div>
                        </div>
                </div>
            </div>
        </div>
    </div>
)
}

export default AddProduct;
