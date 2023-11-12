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
    const navigate = useNavigate();

    const toggle = () => {
        setDropDown((prev) => !prev);
        setIsRotated((prev) => !prev);
    };
    const transClass = dropDown ? 'flex' : 'hidden';

    const clients = [
        {
            clientName: 'John',
            mobileNumber: '000 000 000 000',
            sales: 23,
            userName: 'John1243',
            password: '1234',
        },
        {
            clientName: 'John',
            mobileNumber: '000 000 000 000',
            sales: 23,
            userName: 'John1243',
            password: '1234',
        },
        {
            clientName: 'John',
            mobileNumber: '000 000 000 000',
            sales: 23,
            userName: 'John1243',
            password: '1234',
        },
        {
            clientName: 'John',
            mobileNumber: '000 000 000 000',
            sales: 23,
            userName: 'John1243',
            password: '1234',
        },
        {
            clientName: 'John',
            mobileNumber: '000 000 000 000',
            sales: 23,
            userName: 'John1243',
            password: '1234',
        },
        {
            clientName: 'John',
            mobileNumber: '000 000 000 000',
            sales: 23,
            userName: 'John1243',
            password: '1234',
        }
    ]

    return(
        <div className='flex h-screen bg-gray-100'>
            <div className='flex flex-col w-full overflow-auto'>
                <div className="flex items-center bg-gray-100 self-center justify-center align-middle w-[90%] ml-16 mt-32 rounded-xl p-10 px-20">
                    <div className="w-full flex flex-col">
                        <div className='flex flex-row w-full justify-between items-center align-middle'>
                            <div className='text-2xl font-bold'>Lista e Klientëve</div>
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
                                        className='border border-[#128F96] py-2 px-3 h-12 flex flex-row gap-3 items-center align-middle justify-center cursor-pointer rounded-lg'
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
                                    <div  onClick={() => navigate('/clients/add')} className='py-2 px-3 h-12 flex flex-row gap-3 items-center align-middle bg-[#128F96] rounded-lg cursor-pointer hover:bg-cyan-700 transition-all duration-200'>
                                        <img src={plusIcon} className='w-[25px] h-[25px]' />
                                        <span className='font-bold text-white'>SHTO PUNTORIN</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col gap-3 mt-2 w-full bg-white rounded-xl'>
                            
                            <div className='pl-20 flex flex-row w-full px-10 py-5 border-b border-gray-4400 font-bold'>
                                <div className='flex flex-row w-[50%] gap-10 justify-start'>
                                    <div className='w-[20%]'>Client name</div>
                                    <div className='w-[20%]'>Phone number</div>
                                    <div className='ml-10'>Sales</div>
                                </div>
                                <div className='flex flex-row w-[50%] gap-10 justify-start'>
                                    <div className='w-[30%]'>Created at</div>
                                    <div className='w-[30%]'>Username</div>
                                    <div className=''>Password</div>
                                </div>
                            </div>

                            {clients.map((client, index) => (
                                <div key={index} className="flex flex-row py-2 px-8 gap-10 self-start items-center align-middle w-full">
                                    <input type='radio' />
                                    <div>{client.clientName}</div>
                                    <div>{client.mobileNumber}</div>
                                    <div>{client.sales}</div>
                                    <div>12/12/12</div>
                                    <div>{client.userName}</div>
                                    <div>**********</div>
                                </div>
                            ))}


                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Employees;