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
        phone: '',
        password: '',
    });
    
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('token') === null){
            navigate('/login')
        }
        if(localStorage.getItem('role') !== 'admin'){
            alert('You are not authorized to view this page')
            navigate('/employees')
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    
    const handleAddEmployee = async () => {
        try {
            console.log("Adding an employee...");
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/employee/addemployee`, employeeData);
            console.log('Employee added successfully:', response.data);
            navigate('/employees');
        } catch (error) {
            console.error('Error adding employee:', error.message);
        }
    };

    return(
        <div className='flex h-screen bg-gray-100'>
            <div className='flex flex-col w-full overflow-auto'>
                <div className='mt-32 w-[50%] self-center mx-auto items-start justify-start'>
                    <button onClick={() => navigate('/employees')} className='py-2 px-5 rounded-lg bg-[#128F96] font-bold text-white hover:bg-cyan-700 transition-all duration-200'>Kthehu</button>
                </div>
                <div className="flex flex-col items-center bg-white self-center justify-center align-middle w-[50%] ml-16 mt-10 rounded-xl p-10 px-20">
                    <span className='text-xl font-bold'>Employee Details</span>
                    <div className='self-center w-full p-10 bg-white rounded-xl'>
                        <div className='flex flex-col w-full gap-5 font-bold'>
                            <div className='flex flex-col w-full gap-2'>
                                <label>Emri i/e punonjësit</label>
                                <input type='text' className='w-full px-3 py-2 border border-gray-400 rounded-lg shadow-lg' name='name' id='name' onChange={handleInputChange}></input>
                            </div>
                            <div className='flex flex-col w-full gap-2'>
                                <label>Email i/e punonjësit</label>
                                <input type='email' className='w-full px-3 py-2 border border-gray-400 rounded-lg shadow-lg ' name='email' id='email' onChange={handleInputChange}></input>
                            </div>
                            <div className='flex flex-col w-full gap-2'>
                                <label>Numri i telefonit i/ punonjësit</label>
                                <input className='w-full px-3 py-2 border border-gray-400 rounded-lg shadow-lg' name='phone' id='phone' onChange={handleInputChange}></input>
                            </div>
                            <div className='flex flex-col w-full gap-2'>
                                <label>Fjalëkalimi</label>
                                <input className='w-full px-3 py-2 border border-gray-400 rounded-lg shadow-lg' name='password' id='password' onChange={handleInputChange}></input>
                            </div>
                        </div>
                    </div>
                    <div className='w-full px-10'>
            <button onClick={handleAddEmployee} className='w-full rounded-lg bg-[#128F96] py-2 text-white font-bold shadow-lg'>
                Shto
            </button>
        </div>
                </div>
            </div>
        </div>
    )
}

export default Employee;