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

    // const clients = [
    //     {
    //         clientName: 'John',
    //         mobileNumber: '000 000 000 000',
    //         sales: 23,
    //         userName: 'John1243',
    //         password: '1234',
    //     },
    //     {
    //         clientName: 'John',
    //         mobileNumber: '000 000 000 000',
    //         sales: 23,
    //         userName: 'John1243',
    //         password: '1234',
    //     },
    //     {
    //         clientName: 'John',
    //         mobileNumber: '000 000 000 000',
    //         sales: 23,
    //         userName: 'John1243',
    //         password: '1234',
    //     },
    //     {
    //         clientName: 'John',
    //         mobileNumber: '000 000 000 000',
    //         sales: 23,
    //         userName: 'John1243',
    //         password: '1234',
    //     },
    //     {
    //         clientName: 'John',
    //         mobileNumber: '000 000 000 000',
    //         sales: 23,
    //         userName: 'John1243',
    //         password: '1234',
    //     },
    //     {
    //         clientName: 'John',
    //         mobileNumber: '000 000 000 000',
    //         sales: 23,
    //         userName: 'John1243',
    //         password: '1234',
    //     },
    //     {
    //         clientName: 'John',
    //         mobileNumber: '000 000 000 000',
    //         sales: 23,
    //         userName: 'John1243',
    //         password: '1234',
    //     },
    //     {
    //         clientName: 'John',
    //         mobileNumber: '000 000 000 000',
    //         sales: 23,
    //         userName: 'John1243',
    //         password: '1234',
    //     },
    //     {
    //         clientName: 'John',
    //         mobileNumber: '000 000 000 000',
    //         sales: 23,
    //         userName: 'John1243',
    //         password: '1234',
    //     },
    //     {
    //         clientName: 'Johnnnnnnn',
    //         mobileNumber: '000 000 000 000',
    //         sales: 23,
    //         userName: 'John1243',
    //         password: '1234',
    //     },
    //     {
    //         clientName: 'Johndsfwe',
    //         mobileNumber: '000 000 000 000',
    //         sales: 23,
    //         userName: 'John1243',
    //         password: '1234',
    //     },
    //     {
    //         clientName: 'Johnathen',
    //         mobileNumber: '000 000 000 000',
    //         sales: 23,
    //         userName: 'John1243',
    //         password: '1234',
    //     },
    //     {
    //         clientName: 'John',
    //         mobileNumber: '000 000 000 000',
    //         sales: 23,
    //         userName: 'John1243',
    //         password: '1234',
    //     },
    //     {
    //         clientName: 'Johndddd',
    //         mobileNumber: '000 000 000 000',
    //         sales: 23,
    //         userName: 'John1243',
    //         password: '1234',
    //     },
    //     {
    //         clientName: 'John',
    //         mobileNumber: '000 000 000 000',
    //         sales: 23,
    //         userName: 'John1243',
    //         password: '1234',
    //     },
    //     {
    //         clientName: 'Johnewewwe',
    //         mobileNumber: '000 000 000 000',
    //         sales: 23,
    //         userName: 'John1243',
    //         password: '1234',
    //     },
    //     {
    //         clientName: 'Johnttttttttt',
    //         mobileNumber: '000 000 000 000',
    //         sales: 23,
    //         userName: 'John1243',
    //         password: '1234',
    //     },
    //     {
    //         clientName: 'John',
    //         mobileNumber: '000 000 000 000',
    //         sales: 23,
    //         userName: 'John1243',
    //         password: '1234',
    //     },
    //     {
    //         clientName: 'John',
    //         mobileNumber: '000 000 000 000',
    //         sales: 23,
    //         userName: 'John1243',
    //         password: '1234',
    //     },
    //     {
    //         clientName: 'Johnrrrrrrrrrrrrrrrr',
    //         mobileNumber: '000 000 000 000',
    //         sales: 23,
    //         userName: 'John1243',
    //         password: '1234',
    //     },
    //     {
    //         clientName: 'Johnyyyyy',
    //         mobileNumber: '000 000 000 000',
    //         sales: 23,
    //         userName: 'John1243',
    //         password: '1234',
    //     },
    // ]
    
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const getClients = async () => {
            try {
                const { data } = await axios.get('http://localhost:3001/client/getallclients');
                const transformedClients = data.map((user) => {
                    return {
                        clientName: user.firstName + ' ' + user.lastName,
                        mobileNumber: user.contactNumber,
                        sales: user.orders.length, 
                        userName: user.firstName,
                        password: user.password, 
                    };
                });
                setClients(transformedClients);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };

        getClients();
    }, []);


    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredClients = clients.filter((client) =>
        client.clientName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const productsPerPage = 10;
    const totalPages = Math.ceil(filteredClients.length / productsPerPage);

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;

    const clientsToDisplay = filteredClients.slice(startIndex, endIndex);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPageButtonsToShow = 5; // Adjust this value as needed

        if (totalPages <= maxPageButtonsToShow) {
            // Show all pages
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Show a limited number of pages with ellipsis
            const leftEllipsis = currentPage > 2;
            const rightEllipsis = currentPage < totalPages - 1;

            if (leftEllipsis) {
                pageNumbers.push(1);
                pageNumbers.push("...");
            }

            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                if (i >= 1 && i <= totalPages) {
                    pageNumbers.push(i);
                }
            }

            if (rightEllipsis) {
                pageNumbers.push("...");
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers;
    };

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
                                    value={searchQuery}
                                    onChange={handleSearchChange}
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
                                        <span className='font-bold text-white'>SHTO KLIENTIN</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col gap-3 mt-2 w-full bg-white rounded-xl'>
                            
                            <div className='flex flex-row w-full px-5 py-5 border-b border-gray-4400 font-bold'>
                                <div className='flex flex-row w-[50%] gap-10 justify-start'>
                                    <input type='radio' className='opacity-0' />
                                    <div className='w-[20%] px-[6px]'>Emri i Klientit</div>
                                    <div className='w-[25%] px-[5px]'>Numri i Telefonitr</div>
                                    <div className='ml-10'>Shitje</div>
                                </div>
                                <div className='flex flex-row w-[50%] gap-10 justify-start'>
                                    <div className='w-[30%]'>Krijuar në</div>
                                    <div className='w-[30%]'>Emri i User-it</div>
                                    <div className=''>Fjalëkalimi</div>
                                </div>
                            </div>

                            {clientsToDisplay.map((client, index) => (
                                <div key={index} className="flex flex-row py-2 px-5 self-start items-center align-middle w-full">
                                    <div className='flex flex-row w-[50%] gap-10 justify-start'>
                                        <input type='radio' />
                                        <div className='w-[20%] px-[6px]'>{client.clientName}</div>
                                        <div className='w-[25%] px-[5px]'>{client.mobileNumber}</div>
                                        <div className='ml-10 font-bold'>{client.sales}€</div>
                                    </div>
                                    <div className='flex flex-row w-[50%] gap-10 justify-start'>
                                        <div className='w-[30%]'>12/12/12</div>
                                        <div className='w-[30%]'>{client.userName}</div>
                                        <div className=''>**********</div>
                                    </div>
                                </div>
                            ))}


                        </div>

                        <div className="flex justify-center mt-4">
                            {getPageNumbers().map((pageNumber, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(pageNumber)}
                                    className={`mx-2 ${
                                        currentPage === pageNumber ? "bg-[#128F96] text-white rounded-full py-1 px-3" : "bg-gray-200 text-black rounded-full py-1 px-3"
                                    } rounded-full`}
                                >
                                    {pageNumber}
                                </button>
                            ))}
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Employees;