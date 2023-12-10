import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import {format} from 'date-fns';
import {useNavigate} from "react-router-dom";

const Orders = () => {

    const [orders, setOrders] = useState([]);
    const [allOrders, setAllOrders] = useState([]); // Used for table data
    const [searchQuery, setSearchQuery] = useState(''); // Used for table data
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('token') === null){
            navigate('/login')
        }
    }, []);

    const getData = async ()=>{
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/order/orders/`)
        let data = response.data;
        console.log(data)
        setOrders(data);
        setAllOrders(data)
    }

    useEffect(() => {
        getData();
    }, []); 

    useEffect(() => {
        const filteredOrders = allOrders.filter((order) =>
            order._id.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setOrders(filteredOrders);
    },[searchQuery]);

    const [divStates, setDivStates] = useState(Array(orders.length).fill(false));

    const toggleDiv = (index) => {
        const newDivStates = [...divStates];
        newDivStates[index] = !newDivStates[index];
        setDivStates(newDivStates);
      };

    return(
        <div className='flex h-screen bg-gray-100'>
            <div className='flex flex-col w-full overflow-auto'>
                <div className="flex items-center bg-white self-center justify-center align-middle w-[80%] ml-16 mt-32 rounded-xl p-10 px-20">
                    <div className="flex flex-col w-full">
                        <div className="flex flex-row justify-between pb-5">
                            <span className="text-4xl font-bold">POROSITE</span>
                            <div className='flex flex-row gap-10'>
                               <input className="w-30 h-4 p-4 rounded-lg border-black border-[1px]" placeholder="Search" onChange={(e)=>setSearchQuery(e.target.value)}/>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between w-[90%] border-gray-500 border-b-2 pb-5">
                            </div>

                        {orders.map((order, index) => 
                        <div className="flex flex-col border-gray-500 border-b-2 py-6 w-[90%] self-start">
                            <div className="flex flex-row items-center justify-between align-middle ">
                                <div className="flex flex-row w-[70%] md:w-fit items-center align-middle gap-5 md:gap-12">
                                    <img src={`${process.env.REACT_APP_IMAGE_URL}/${order.products[0].mainImage}`} alt="product-img" className="w-[75px] h-[75px]" />
                                    <span className="text-xl">{order._id}</span>
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
                                    <div className="flex flex-row gap-5 p-3 text-xs border-2 border-gray-300 rounded-lg">
                                        <div className="flex flex-col">
                                            <span>ORDER DATE:</span>
                                            <span>QTY:</span>
                                            <span>ORDER TOTAL:</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span>{format(new Date(order.date), 'yyyy-MM-dd')}</span>
                                            <span>{order.quantity}</span>
                                            <span>{order.total}</span>
                                        </div>
                                    </div>  
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-xs font-bold">Detajet e Produktit</span>
                                    <div
                                        className="flex flex-col text-xs gap-5 p-3 border-2 border-gray-300 rounded-lg w-[300px]">
                                        {
                                            order.products.map(product =>
                                                <div className="flex flex-row gap-10">
                                                    <img src={`${process.env.REACT_APP_IMAGE_URL}/${order.products[0].mainImage}`} className="w-[40px]" alt="Product image"/>
                                                    <div className="flex flex-col">
                                                        <span>{product.name}</span>
                                                        <span>Saisa: {product.quantity}</span>
                                                        <span>Qmimi: {product.price}</span>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 ">
                                    <span className="text-xs font-bold">Billing Adress</span>
                                    <div className="flex flex-row gap-5 p-3 text-xs border-2 border-gray-300 rounded-lg">
                                        <div className="flex flex-col">
                                             <span>Emri:</span>
                                            <span>Mbiemri:</span>
                                            <span>Shteti:</span>
                                            <span>Adress:</span>
                                            <span>Postal code:</span>
                                        </div>
                                        <div className="flex flex-col">
                                        <span>{order.firstName}</span>
                                            <span>{order.lastName}</span>
                                            <span>{order.state}</span>
                                            <span>{order.shippingAddress}</span>
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