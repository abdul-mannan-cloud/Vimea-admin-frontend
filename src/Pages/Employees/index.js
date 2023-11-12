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

const Employees = () => {

    const [dropDown, setDropDown] = useState(false);
    const [isRotated, setIsRotated] = useState(false);
    const toggle = () => {
        setDropDown(old => !old);
        setIsRotated(!isRotated);
    }
    const transClass = dropDown
        ?
        "flex"
        :
        "hidden";

    const employees = [
        {
            name: 'Daim Hotie',
            phone: '000 000 000',
            email: 'abc@gamil.com',
        },
        {
            name: 'Daim Hotie',
            phone: '000 000 000',
            email: 'abc@gamil.com',
        },
        {
            name: 'Daim Hotie',
            phone: '000 000 000',
            email: 'abc@gamil.com',
        },
        {
            name: 'Daim Hotie',
            phone: '000 000 000',
            email: 'abc@gamil.com',
        },
        {
            name: 'Daim Hotie',
            phone: '000 000 000',
            email: 'abc@gamil.com',
        },
    ]

    const navigate = useNavigate();

    return(
        <div className='flex h-screen bg-gray-100'>
            <div className='flex flex-col w-full overflow-auto'>
                <div className="flex items-center bg-gray-100 self-center justify-center align-middle w-[90%] ml-16 mt-32 rounded-xl p-10 px-20">
                    <div className="w-full flex flex-col">
                        <div className='flex flex-row w-full justify-between'>
                            <div className='mt-1 rounded-lg'> 
                                <TextField 
                                    id="search"
                                    type="search"
                                    label="Search"
                                    // value={searchTerm}
                                    // onChange={handleChange}
                                    style={{ borderRadius: '20px' }}
                                    InputProps={{
                                        endAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color=''/>
                                        </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                            <div className='flex flex-row gap-5'>
                                <div className="relative flex flex-row gap-5">
                                    <div
                                        onClick={(e) => {toggle()}}
                                        className='border border-[#128F96] py-2 px-3 h-10 flex flex-row gap-3 items-center align-middle justify-center cursor-pointer rounded-lg'
                                    >
                                        <span>Option</span>
                                        <img
                                            src={arrowIcon}
                                            className={`w-3 h-2 transition-transform ${
                                            isRotated ? 'rotate-180' : '' // Add rotate-180 class conditionally
                                            }`}
                                            alt=''
                                        />
                                    </div>

                                    <div className={`absolute top-10 z-30 w-[200px] flex flex-col py-4 bg-[#FAF8F5] rounded-md ${transClass}`}>
                                        <p
                                            className="px-4 py-1 hover:bg-zinc-300 hover:text-zinc-500"
                                            value="a"
                                            onClick={(e)=>{
                                                {toggle()}
                                            }}
                                        >a</p>
                                        <p
                                            className="px-4 py-1 hover:bg-zinc-300 hover:text-zinc-500"
                                            value="b"
                                            onClick={(e)=>{
                                                {toggle()}
                                            }}
                                        >b</p>
                                    </div>
                                </div>
                                <div className='flex flex-row'>
                                    <div  onClick={() => navigate('/employees/add')} className='py-2 px-3 flex flex-row gap-3 items-center align-middle bg-[#128F96] h-10 rounded-lg cursor-pointer hover:bg-cyan-700 transition-all duration-200'>
                                        <img src={plusIcon} className='w-[25px] h-[25px]' />
                                        <span className='font-bold text-white'>SHTO PUNTORIN</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='mt-10'>
                            <span className='text-xl font-bold'>Team Members</span>
                        </div>

                        <div className='flex flex-col gap-3 mt-2 w-full'>

                            {employees.map((employee, index) => 
                                <div className="flex row bg-white rounded-lg py-2 px-8 gap-10 self-start items-center align-middle justify-center w-full">
                                    <div className='w-[50%] flex items-start align-middle justify-start'>
                                        <div className='flex flex-col gap-2 items-center'>
                                            <div className='h-[70px] w-[70px] border border-[#128F96] rounded-full flex items-center justify-center align-middle text-4xl font-bold text-[#128F96]'><span>DH</span></div>
                                            <div className='text-[#128F96]'>{employee.name}</div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col w-[50%]'>
                                        <span>{employee.email}</span>
                                        <span>{employee.phone}</span>
                                    </div>
                                </div>
                            )}

                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Employees;