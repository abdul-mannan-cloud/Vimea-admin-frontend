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
            title : "BABY BIO MANDELÖL 200ml",
            image : "/product1.png",
            date : "12.12.23",
            quantity : 5,
            total: 13,
            card : "MC,XXXXXX3421",
            trasactionDate : "12.12.23",
            code : "123456",
            address : "Str.noname nr.5",
            city : "Prishtina",
            state : "Kosova",
            postalCode : 10000
        },
        {
            title : "BABY BIO MANDELÖL 200ml",
            image : "/product1.png",
            date : "12.12.23",
            quantity : 5,
            total: 13,
            card : "MC,XXXXXX3421",
            trasactionDate : "12.12.23",
            code : "123456",
            address : "Str.noname nr.5",
            city : "Prishtina",
            state : "Kosova",
            postalCode : 10000
        },
        {
            title : "BABY BIO MANDELÖL 200ml",
            image : "/product1.png",
            date : "12.12.23",
            quantity : 5,
            total: 13,
            card : "MC,XXXXXX3421",
            trasactionDate : "12.12.23",
            code : "123456",
            address : "Str.noname nr.5",
            city : "Prishtina",
            state : "Kosova",
            postalCode : 10000
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
            <Sidebar />
            <div className='flex flex-col w-full overflow-auto'>
                <NavBar />
                <div className="flex items-center bg-white self-center justify-center align-middle w-[80%] ml-16 mt-32 rounded-xl p-10 px-20">
                    <div className="w-full flex flex-col">
                        <div className="flex flex-row justify-between pb-5">
                            <span className="text-4xl font-bold">POROSITE</span>
                            <div className='flex flex-row gap-10'>
                                <div className='rounded-lg border border-gray-200 p-3 px-7 font-bold text-xl'>Aktiviteti Sot</div>
                                <div className='rounded-lg shadow-lg p-3 px-7 font-bold text-xl'>Aktiviteti Sot</div>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between w-[90%] border-gray-500 border-b-2 pb-5">
                            </div>

                        {orders.map((order, index) => 
                        <div className="flex flex-col border-gray-500 border-b-2 py-6 w-[90%] self-start">
                            <div className="flex flex-row justify-between items-center align-middle ">
                                <div className="flex flex-row w-[70%] md:w-fit items-center align-middle gap-5 md:gap-12">
                                    <img src={order.image} alt="product-img" className="w-[75px] h-[75px]" />
                                    <span className="text-xl">{order.title}</span>
                                </div>
                                {
                                    divStates[index]
                                    ? <button onClick={() => toggleDiv(index)} className="bg-[#128F96] text-white rounded-full px-3 py-2 md:px-10 md:py-3">Close</button>
                                    : <div><button onClick={() => toggleDiv(index)} className="md:block hidden bg-[#128F96] text-white rounded-full px-3 py-2 md:px-10 md:py-3">Tap to view</button>
                                    <button onClick={() => toggleDiv(index)} className="md:hidden block bg-[#128F96] text-white rounded-full px-3 py-2 md:px-10 md:py-3">View</button>
                                    </div>
                                    
                                }
                                
                            </div>
                            <div
                                className={`flex flex-col md:gap-0 gap-5 md:flex-row justify-between pt-6 transition-all duration-500 max-h-0 overflow-hidden w-[80%] ${
                                    divStates[index] ? "max-h-[500px]" : "max-h-0"
                                }`}
                            >
                                <div className="flex flex-col gap-2">
                                    <span className="text-xs font-bold">ORDER DETAILS</span>
                                    <div className="flex flex-row text-xs gap-5 p-3 border-2 border-gray-300 rounded-lg">
                                        <div className="flex flex-col">
                                            <span>ORDER DATE:</span>
                                            <span>QTY:</span>
                                            <span>ORDER TOTAL:</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span>{order.date}</span>
                                            <span>{order.quantity}</span>
                                            <span>{order.total}</span>
                                        </div>
                                    </div>  
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-xs font-bold">PAYMENT DETAILS</span>
                                    <div className="flex flex-row text-xs gap-5 p-3 border-2 border-gray-300 rounded-lg">
                                        <div className="flex flex-col">
                                            <span>Card:</span>
                                            <span>Date of transaction:</span>
                                            <span>Aprovation code:</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span>{order.card}</span>
                                            <span>{order.trasactionDate}</span>
                                            <span>{order.code}</span>
                                        </div>
                                    </div>  
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-xs font-bold">Billing Adress</span>
                                    <div className="flex flex-row text-xs gap-5 p-3 border-2 border-gray-300 rounded-lg">
                                        <div className="flex flex-col">
                                            <span>Adress:</span>
                                            <span>City:</span>
                                            <span>State:</span>
                                            <span>Postal code:</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span>{order.address}</span>
                                            <span>{order.city}</span>
                                            <span>{order.state}</span>
                                            <span>{order.postalCode}</span>
                                        </div>
                                    </div>  
                                </div>
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