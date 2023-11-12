import React, { useState } from 'react';
import NavBar from '../../Components/navbar';
import Sidebar from '../../Components/sidebar';
import AddBlogs from '../../resources/addBlogs.png';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { useRef } from 'react';
import { Container, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import arrowIcon from '../../resources/arrowIcon.png';
import plusIcon from '../../resources/Plus.png';
import AWS from 'aws-sdk';

import femaleIcon from '../../resources/female.png'

const Employee = () => {

    const [employeeData, setEmployeeData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    
    const navigate = useNavigate();
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return(
        <div className='flex h-screen bg-gray-100'>
            <div className='flex flex-col w-full overflow-auto'>
                <div className='mt-32 w-[50%] self-center mx-auto items-start justify-start'>
                    <button onClick={() => navigate('/employees')} className='py-2 px-5 rounded-lg bg-[#128F96] font-bold text-white hover:bg-cyan-700 transition-all duration-200'>Back</button>
                </div>
                <div className="flex flex-col items-center bg-white self-center justify-center align-middle w-[50%] ml-16 mt-10 rounded-xl p-10 px-20">
                    <span className='text-xl font-bold'>Employee Details</span>
                    <div className='p-10 rounded-xl bg-white self-center w-full'>
                        <div className='flex flex-col gap-5 w-full font-bold'>
                            <div className='flex flex-col gap-2 w-full'>
                                <label>Employee Name</label>
                                <input type='text' className='border rounded-lg border-gray-400 shadow-lg py-2 px-3 w-full' name='name' id='name' onChange={handleInputChange}></input>
                            </div>
                            <div className='flex flex-col gap-2 w-full'>
                                <label>Employee Email</label>
                                <input type='email' className='border rounded-lg border-gray-400 shadow-lg py-2 px-3 w-full ' name='email' id='email' onChange={handleInputChange}></input>
                            </div>
                            <div className='flex flex-col gap-2 w-full'>
                                <label>Employee Phone</label>
                                <input className='border rounded-lg border-gray-400 shadow-lg py-2 px-3 w-full' name='phone' id='phone' onChange={handleInputChange}></input>
                            </div>
                        </div>
                    </div>
                    <div className='w-full px-10'>
                        <button className='w-full rounded-lg bg-[#128F96] py-2 text-white font-bold shadow-lg'>Add</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Employee;