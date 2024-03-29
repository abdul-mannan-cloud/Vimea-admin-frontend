import React, {useState} from 'react';
import {useEffect} from 'react';
import axios from 'axios';
import {format} from 'date-fns';
import {useNavigate} from "react-router-dom";

const Orders = () => {

    const [orders, setOrders] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sorted, setSorted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token') === null) {
            navigate('/login')
        }
    }, []);

    const calculateQuantity = (order) => {
        const quantity = order.products.reduce((acc, product) => acc + product.quantity, 0);
        return quantity;
    }

    const calculatePrice = (order) => {
        if (order.state === 'Kosova') {
            return 2;
        } else if (order.state === 'Shqiperi') {
            return 5;
        } else if ( order.state === 'Macedoni') {
            return 5;
        } else {
            return 0;
        }
    };

    const calculateTotal = (order) => {
        return order.products.reduce((acc, product) => acc + product.price * product.quantity, 0)+calculatePrice(order);
    }

    const getData = async () => {
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
            order._id.toLowerCase().includes(searchQuery.toLowerCase()) || order.id?.toLowerCase().includes(searchQuery.toLowerCase()) || order.email.toLowerCase().includes(searchQuery.toLowerCase()) || order.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) || order.lastName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setOrders(filteredOrders);
    }, [searchQuery]);

    const [divStates, setDivStates] = useState(Array(orders.length).fill(false));

    const toggleDiv = (index) => {
        const newDivStates = [...divStates];
        newDivStates[index] = !newDivStates[index];
        setDivStates(newDivStates);
    };

    return (
        <div className='flex h-screen bg-gray-100 sm:px-40 pl-16 pr-1 pb-10'>
            <div className='flex flex-col w-full overflow-auto'>
                <div
                    className="flex items-center bg-white self-center justify-center align-middle w-full mt-32 rounded-xl p-10 sm:px-20">
                    <div className="flex flex-col w-full">
                        <div className="flex sm:flex-row flex-col justify-between sm:pb-5">
                            <span className="sm:text-4xl text-2xl font-bold sm:mb-0 mb-4">POROSITE</span>
                            <div className='flex sm:flex-row flex-col sm:gap-10 gap-3'>
                                <button className="p-2 bg-[#128F96] text-white rounded-lg" onClick={()=>{
                                    if(sorted){
                                        const sortedOrders = orders.sort((a, b) => new Date(a.date) - new Date(b.date));
                                        setOrders(sortedOrders);
                                        setSorted(false);
                                        return;
                                    }
                                    const sortedOrders = orders.sort((a, b) => new Date(b.date) - new Date(a.date));
                                    setOrders(sortedOrders);
                                    setSorted(true);
                                }}>Filtro</button>
                                <input className="w-30 h-4 p-4 rounded-lg border-black border-[1px]" placeholder="Kërko"
                                       onChange={(e) => setSearchQuery(e.target.value)}/>
                            </div>
                        </div>
                        <div className="sm:flex hidden flex-row justify-between w-full border-gray-500 border-b-2 pb-5"></div>
            <div className="overflow-auto h-screen ">

                        {orders.map((order, index) =>
                              <div className="flex flex-col border-gray-500 border-b-2 py-6 w-full self-start">
                              <div className="flex sm:flex-row flex-col gap-y-2 items-center justify-between align-middle ">
                                <div className="flex sm:flex-row flex-col w-full items-center align-middle gap-5 sm:gap-12">
                                        <img src={`${process.env.REACT_APP_IMAGE_URL}/${order.products[0].mainImage}`}
                                             alt="product-img" className="w-[75px] h-[75px]"/>
                                        <span className="w-52 overflow-hidden whitespace-nowrap">{order._id}</span>
                                        <span className="">{order.id}</span>
                                        <span className="">{format(new Date(order.date), 'dd-MM-yyyy')}</span>
                                        <span className="w-40 overflow-hidden whitespace-nowrap">{order.email}</span>
                                        <span className="">{order.firstName + ' '+ order.lastName}</span>
                                    </div>
                                    {
                                        divStates[index]
                                            ? <button onClick={() => toggleDiv(index)}
                                                      className="bg-[#128F96] text-white rounded-full px-3 py-2 md:px-10 md:py-3">Mbyll</button>
                                            : <div>
                                                <button onClick={() => toggleDiv(index)}
                                                        className="md:block hidden bg-[#128F96] text-white rounded-full px-3 py-2 md:px-10 md:py-3">Kliko
                                                </button>
                                                <button onClick={() => toggleDiv(index)}
                                                        className="md:hidden block bg-[#128F96] text-white rounded-full px-3 py-2 md:px-10 md:py-3">View
                                                </button>
                                            </div>

                                    }

                                </div>
                                <div
                                    className={`flex flex-col md:gap-0 gap-5 md:flex-row justify-between pt-6 transition-all duration-500 max-h-0 overflow-hidden w-[80%] ${
                                        divStates[index] ? "max-h-[500px]" : "max-h-0"
                                    }`}
                                >
                                    <div className="flex flex-col gap-2">
                                        <span className="text-xs font-bold">Detajet e Porosisë</span>
                                        <div
                                            className="flex flex-row gap-5 p-3 text-xs border-2 border-gray-300 rounded-lg">
                                            <div className="flex flex-col">
                                                <span>Data e Porosisë:</span>
                                                <span>Sasia:</span>
                                                <span>Totali i Porosisë:</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span>{format(new Date(order.date), 'yyyy-MM-dd')}</span>
                                                <span>{calculateQuantity(order)}</span>
                                                <span>{`${calculateTotal(order)} €`}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <span className="text-xs font-bold">Detajet e Produktit</span>
                                        <div
                                            className="flex flex-col text-xs gap-5 p-3 border-2 border-gray-300 rounded-lg sm:w-[300px] w-full">
                                            {
                                                order.products.map(product =>
                                                    <div className="flex flex-row gap-10">
                                                        <img
                                                            src={`${process.env.REACT_APP_IMAGE_URL}/${order.products[0].mainImage}`}
                                                            className="w-[40px]" alt="Product image"/>
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
                                        <span className="text-xs font-bold">Fatura e Adresesës</span>
                                        <div
                                            className="flex flex-row gap-5 p-3 text-xs border-2 border-gray-300 rounded-lg">
                                            <div className="flex flex-col">
                                                <span>Emri:</span>
                                                <span>Mbiemri:</span>
                                                <span>Shteti:</span>
                                                <span>Adresa:</span>
                                                <span>Kodi Postar:</span>
                                                <span>Phone Number:</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span>{order.firstName}</span>
                                                <span>{order.lastName}</span>
                                                <span>{order.state ? order.state : "state not entered"}</span>
                                                <span>{order.shippingAddress}</span>
                                                <span>{order.postalCode}</span>
                                                <span>{order.phoneNumber}</span>
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
        </div>
    )
}

export default Orders;
