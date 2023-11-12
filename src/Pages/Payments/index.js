import React, { useState } from 'react';
import NavBar from '../../Components/navbar';
import Sidebar from '../../Components/sidebar';
import AddBlogs from '../../resources/addBlogs.png';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { TextField, Button } from '@mui/material';
import { useRef } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import AWS from 'aws-sdk';
import addPhoto from '../../resources/addphoto.png'
import maleIcon from '../../resources/male.png'
import femaleIcon from '../../resources/female.png'

const Orders = () => {
    const orders = [
        {
            time: "2",
            date: "June 31 2020",
            day: "Monday",
            price: 123,
            payment: false,
            person: {
                name:"Daim Hotie",
                phone: "000 000 000"
            },
            product: {
                name: "kerma"
            },
        },
        {
            time: "2",
            date: "June 31 2020",
            day: "Monday",
            price: 123,
            payment: true,
            person: {
                name:"Daim Hotie",
                phone: "000 000 000"
            },
            product: {
                name: "kerma"
            },
        },
        {
            time: "2",
            date: "June 31 2020",
            day: "Monday",
            price: 123,
            payment: false,
            person: {
                name:"Daim Hotie",
                phone: "000 000 000"
            },
            product: {
                name: "kerma"
            },
        },
        {
            time: "2",
            date: "June 31 2020",
            day: "Monday",
            price: 123,
            payment: true,
            person: {
                name:"Daim Hotie",
                phone: "000 000 000"
            },
            product: {
                name: "kerma"
            },
        },
        {
            time: "2",
            date: "June 31 2020",
            day: "Monday",
            price: 123,
            payment: true,
            person: {
                name:"Daim Hotie",
                phone: "000 000 000"
            },
            product: {
                name: "kerma"
            },
        },
        {
            time: "2",
            date: "June 31 2020",
            day: "Monday",
            price: 123,
            payment: true,
            person: {
                name:"Daim Hotie",
                phone: "000 000 000"
            },
            product: {
                name: "kerma"
            },
        },
        {
            time: "2",
            date: "June 31 2020",
            day: "Monday",
            price: 123,
            payment: true,
            person: {
                name:"Daim Hotie",
                phone: "000 000 000"
            },
            product: {
                name: "kerma"
            },
        },
        {
            time: "2",
            date: "June 31 2020",
            day: "Monday",
            price: 123,
            payment: false,
            person: {
                name:"Daim Hotie",
                phone: "000 000 000"
            },
            product: {
                name: "kerma"
            },
        },
    ]

    const [divStates, setDivStates] = useState(Array(orders.length).fill(false));

    const toggleDiv = (index) => {
        const newDivStates = [...divStates];
        newDivStates[index] = !newDivStates[index];
        setDivStates(newDivStates);
      };

    return(
        <div className='flex h-screen bg-gray-100'>
            <div className='flex flex-col w-full overflow-auto'>
                <div className="flex items-center bg-white self-center justify-center align-middle w-[90%] ml-16 mt-32 rounded-xl p-10 px-20">
                    <div className="w-full flex flex-col">
                        <div className="flex flex-row justify-between pb-5">
                            <span className="text-4xl font-bold">Pagesat</span>
                            <div className='flex flex-row gap-10'>
                                <div className='rounded-lg border border-gray-200 p-3 px-7 font-bold text-xl'>Aktiviteti Sot</div>
                                <div className='rounded-lg shadow-lg p-3 px-7 font-bold text-xl'>Aktiviteti Sot</div>
                            </div>
                        </div>
                        <div className='flex flex-row gap-5 items-center justify-center align-middle'>
                            <span className='text-xl font-bold'>Today</span>
                            <div className='border-b-2 h-0 border-gray-300 border-dotted w-full'></div>
                        </div>

                        {orders.map((order, index) => 
                            <div className="flex flex-row py-6 w-full justify-center items-center h-28 gap-10">
                                <div className='w-20'>{order.time}m ago</div>
                                <div className={` border-4 w-0 h-full rounded-full
                                    ${
                                        order.payment == true
                                        ? 'border-green-500'
                                        : 'border-red-500'
                                    }
                                `}></div>
                                <div className='flex flex-col gap-2 justify-between h-full w-full'>
                                    <div className='flex flex-row gap-2 w-full text-xl items-center align-baseline'>
                                        <span className='font-bold max-w-fit min-w-[270px]'>{order.person.name} purchase <span className='text-blue-400'>{order.product.name}</span></span>
                                        <div className='border-b-4 h-0 border-blue-400 border-dotted w-full mt-2'></div>
                                        <div className='font-bold text-blue-400'>{order.price}€</div>
                                    </div>
                                    <div className='flex flex-row text-xl text-gray-400'>
                                        <span>{order.day}, {order.date} / {order.person.phone}</span>
                                    </div>
                                </div>
                                <div>
                                    <button className={`py-3 px-10 font-bold text-white rounded-2xl w-[180px]
                                        ${
                                            order.payment == true
                                            ? 'bg-green-500'
                                            : 'bg-red-500'
                                        }
                                    `}>{order.payment ? 'Approved' : 'Declined'}</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Orders;