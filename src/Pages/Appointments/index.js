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
            duration: 45,
            category: "Për Fëmijë"
        },
        {
            service: "Plush",
            price: "25",
            duration: 45,
            category: "Për Bebe"
        },
        {
            service: "Plush",
            price: "25",
            duration: 45,
            category: "Për Fëmijë"
        },
        {
            service: "Plush",
            price: "25",
            duration: 45,
            category: "Për Bebe"
        },
        {
            service: "Plush",
            price: "25",
            duration: 45,
            category: "Mami + Bebi"
        },
        {
            service: "Plush",
            price: "25",
            duration: 45,
            category: "Për Fëmijë"
        },
        {
            service: "Plush",
            price: "25",
            duration: 45,
            category: "Mami + Bebi"
        },
        {
            service: "Plush",
            price: "25",
            duration: 45,
            category: "Për Bebe"
        },
        {
            service: "Plush",
            price: "25",
            duration: 45,
            category: "Për Fëmijë"
        },
        {
            service: "Plush",
            price: "25",
            duration: 45,
            category: "Për Bebe"
        },
        {
            service: "Plush",
            price: "25",
            duration: 45,
            category: "Mami + Bebi"
        },
        {
            service: "Plush",
            price: "25",
            duration: 45,
            category: "Group Plush"
        },
        {
            service: "Plush",
            price: "25",
            duration: 45,
            category: "Mami + Bebi"
        },
        {
            service: "Plush",
            price: "25",
            duration: 45,
            category: "Për Bebe"
        },
        {
            service: "Plush",
            price: "25",
            duration: 45,
            category: "Group Plush"
        },
        {
            service: "Plush",
            price: "25",
            duration: 45,
            category: "Për Nënen"
        },
        {
            service: "Plush",
            price: "25",
            duration: 45,
            category: "Për Nënen"
        },
    ]


    const groupAppointments = appointments.filter(appointment => appointment.category === "Group Plush");
    const childrenAppointments = appointments.filter(appointment => appointment.category === "Për Fëmijë");
    const babyAppointments = appointments.filter(appointment => appointment.category === "Për Bebe");
    const motherAppointments = appointments.filter(appointment => appointment.category === "Për Nënen");
    const motherBabyAppointments = appointments.filter(appointment => appointment.category === "Mami + Bebi");



    return(
        <div className='flex h-screen bg-gray-100'>
            <div className='flex flex-col w-full overflow-auto'>
                <div className="flex items-center bg-gray-100 self-center justify-center align-middle w-[90%] ml-16 mt-28 rounded-xl p-10 px-20 flex-col gap-10">
                    <div className='flex flex-col w-full gap-1'>
                        <div className='ml-2 font-bold'>Për Fëmijë</div>
                        {childrenAppointments.map((appointment, index) => 
                            <div className='flex flex-row justify-between rounded-lg h-[50px] w-full bg-white font-bold shadow-xl'>
                                <div className='w-0 h-full border-4 border-yellow-400 rounded-full'></div>
                                <div className='flex flex-row items-center justify-between w-full h-full gap-10 px-5 py-2 align-middle'>
                                    <span>{appointment.service}</span>
                                    <span>{appointment.duration} min</span>
                                    <span>€{appointment.price}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='flex flex-col w-full gap-1'>
                        <div className='ml-2 font-bold'>Group Plush</div>
                        {groupAppointments.map((appointment, index) => 
                            <div className='flex flex-row justify-between rounded-lg h-[50px] w-full bg-white font-bold shadow-xl'>
                                <div className='w-0 h-full border-4 border-green-600 rounded-full'></div>
                                <div className='flex flex-row items-center justify-between w-full h-full gap-10 px-5 py-2 align-middle'>
                                    <span>{appointment.service}</span>
                                    <span>{appointment.time} min</span>
                                    <span>€{appointment.price}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='flex flex-col w-full gap-1'>
                        <div className='ml-2 font-bold'>Për Bebe</div>
                        {babyAppointments.map((appointment, index) => 
                            <div className='flex flex-row justify-between rounded-lg h-[50px] w-full bg-white font-bold shadow-xl'>
                                <div className='w-0 h-full border-4 border-blue-400 rounded-full'></div>
                                <div className='flex flex-row items-center justify-between w-full h-full gap-10 px-5 py-2 align-middle'>
                                    <span>{appointment.service}</span>
                                    <span>{appointment.time} min</span>
                                    <span>€{appointment.price}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='flex flex-col w-full gap-1'>
                        <div className='ml-2 font-bold'>Për Nënen</div>
                        {motherAppointments.map((appointment, index) => 
                            <div className='flex flex-row justify-between rounded-lg h-[50px] w-full bg-white font-bold shadow-xl'>
                                <div className='w-0 h-full border-4 border-purple-600 rounded-full'></div>
                                <div className='flex flex-row items-center justify-between w-full h-full gap-10 px-5 py-2 align-middle'>
                                    <span>{appointment.service}</span>
                                    <span>{appointment.time} min</span>
                                    <span>€{appointment.price}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='flex flex-col w-full gap-1'>
                        <div className='ml-2 font-bold'>Për Nënen</div>
                        {motherBabyAppointments.map((appointment, index) => 
                            <div className='flex flex-row justify-between rounded-lg h-[50px] w-full bg-white font-bold shadow-xl'>
                                <div className='w-0 h-full border-4 border-red-600 rounded-full'></div>
                                <div className='flex flex-row items-center justify-between w-full h-full gap-10 px-5 py-2 align-middle'>
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