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

const Appointments = () => {

    const appointments = [
        {
            service: "Plush",
            price: "25",
            time: 45,
            category: "children"
        },
        {
            service: "Plush",
            price: "25",
            time: 45,
            category: "mother"
        },
        {
            service: "Plush",
            price: "25",
            time: 45,
            category: "baby"
        },
        {
            service: "Plush",
            price: "25",
            time: 45,
            category: "group"
        },
        {
            service: "Plush",
            price: "25",
            time: 45,
            category: "children"
        },
        {
            service: "Plush",
            price: "25",
            time: 45,
            category: "children"
        },
        {
            service: "Plush",
            price: "25",
            time: 45,
            category: "group"
        },
        {
            service: "Plush",
            price: "25",
            time: 45,
            category: "group"
        },
        {
            service: "Plush",
            price: "25",
            time: 45,
            category: "group"
        },
        {
            service: "Plush",
            price: "25",
            time: 45,
            category: "mother"
        },
        {
            service: "Plush",
            price: "25",
            time: 45,
            category: "mother"
        },
        {
            service: "Plush",
            price: "25",
            time: 45,
            category: "mother"
        },
        {
            service: "Plush",
            price: "25",
            time: 45,
            category: "mother"
        },
        {
            service: "Plush",
            price: "25",
            time: 45,
            category: "mother"
        },
        {
            service: "Plush",
            price: "25",
            time: 45,
            category: "mother"
        },
        {
            service: "Plush",
            price: "25",
            time: 45,
            category: "mother"
        },
        {
            service: "Plush",
            price: "25",
            time: 45,
            category: "group"
        },
    ]


    const groupAppointments = appointments.filter(appointment => appointment.category === "group");
    const childrenAppointments = appointments.filter(appointment => appointment.category === "children");
    const babyAppointments = appointments.filter(appointment => appointment.category === "baby");
    const motherAppointments = appointments.filter(appointment => appointment.category === "mother");



    return(
        <div className='flex h-screen bg-gray-100'>
            <div className='flex flex-col w-full overflow-auto'>
                <div className="flex items-center bg-gray-100 self-center justify-center align-middle w-[90%] ml-16 mt-28 rounded-xl p-10 px-20 flex-col gap-10">
                    <div className='flex flex-col gap-1 w-full'>
                        <div className='font-bold ml-2'>Për Fëmijë</div>
                        {childrenAppointments.map((appointment, index) => 
                            <div className='flex flex-row justify-between rounded-lg h-[50px] w-full bg-white font-bold shadow-xl'>
                                <div className='border-4 w-0 h-full border-yellow-400 rounded-full'></div>
                                <div className='py-2 px-5 flex flex-row gap-10 justify-between h-full w-full items-center align-middle'>
                                    <span>{appointment.service}</span>
                                    <span>{appointment.time} min</span>
                                    <span>€{appointment.price}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='flex flex-col gap-1 w-full'>
                        <div className='font-bold ml-2'>Group Plush</div>
                        {groupAppointments.map((appointment, index) => 
                            <div className='flex flex-row justify-between rounded-lg h-[50px] w-full bg-white font-bold shadow-xl'>
                                <div className='border-4 w-0 h-full border-green-600 rounded-full'></div>
                                <div className='py-2 px-5 flex flex-row gap-10 justify-between h-full w-full items-center align-middle'>
                                    <span>{appointment.service}</span>
                                    <span>{appointment.time} min</span>
                                    <span>€{appointment.price}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='flex flex-col gap-1 w-full'>
                        <div className='font-bold ml-2'>Për Bebe</div>
                        {babyAppointments.map((appointment, index) => 
                            <div className='flex flex-row justify-between rounded-lg h-[50px] w-full bg-white font-bold shadow-xl'>
                                <div className='border-4 w-0 h-full border-blue-500 rounded-full'></div>
                                <div className='py-2 px-5 flex flex-row gap-10 justify-between h-full w-full items-center align-middle'>
                                    <span>{appointment.service}</span>
                                    <span>{appointment.time} min</span>
                                    <span>€{appointment.price}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='flex flex-col gap-1 w-full'>
                        <div className='font-bold ml-2'>Për Nënen</div>
                        {motherAppointments.map((appointment, index) => 
                            <div className='flex flex-row justify-between rounded-lg h-[50px] w-full bg-white font-bold shadow-xl'>
                                <div className='border-4 w-0 h-full border-pink-400 rounded-full'></div>
                                <div className='py-2 px-5 flex flex-row gap-10 justify-between h-full w-full items-center align-middle'>
                                    <span>{appointment.service}</span>
                                    <span>{appointment.time} min</span>
                                    <span>€{appointment.price}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Appointments;