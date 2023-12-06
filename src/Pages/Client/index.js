import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { Container, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import plusIcon from '../../resources/Plus.png';
import editIcon from '../../resources/pencil.svg';

const Employees = () => {
    const [dropDown, setDropDown] = useState(false);
    const [isRotated, setIsRotated] = useState(false);
    const navigate = useNavigate();

    const toggle = () => {
        setDropDown((prev) => !prev);
        setIsRotated((prev) => !prev);
    };
    const transClass = dropDown ? 'flex' : 'hidden';
    
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const getClients = async () => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/client/getallclients`);
                const transformedClients = data.map((user) => {
                    return {
                        id: user._id,
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

    const editClient = (client) => {
        navigate(`/clients/edit/${client.id}`)
    }
    useEffect(() => {
        if(localStorage.getItem('token') === null){
            navigate('/login')
        }
    }, []);
    const deleteClient = async (client) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/client/deleteclient/${client.id}`);
            if(response.status === 200){
                //update client state
                const newClients = clients.filter((c) => c.id !== client.id);
                setClients(newClients);
            }
        } catch (error) {
            console.error('Error deleting client:', error.message);
        }
    }

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
                    <div className="flex flex-col w-full">
                        <div className='flex flex-row items-center justify-between w-full align-middle'>
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
                                <div className='flex flex-row'>
                                    <div  onClick={() => navigate('/clients/add')} className='py-2 px-3 h-12 flex flex-row gap-3 items-center align-middle bg-[#128F96] rounded-lg cursor-pointer hover:bg-cyan-700 transition-all duration-200'>
                                        <img src={plusIcon} className='w-[25px] h-[25px]' />
                                        <span className='font-bold text-white'>SHTO KLIENTIN</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col w-full gap-3 mt-2 bg-white rounded-xl'>
                            
                            <div className='flex flex-row w-full px-5 py-5 font-bold border-b border-gray-4400'>
                                <div className='flex flex-row w-[50%] gap-10 justify-start'>
                                    <div className='w-[20%] px-[6px]'>Emri i Klientit</div>
                                    <div className='w-[20%] px-[5px]'>Numri i Telefonitr</div>
                                    <div className='ml-10'>Shitje</div>
                                </div>
                                <div className='flex flex-row w-[50%] gap-10 justify-start'>
                                    <div className='w-[30%]'>Krijuar në</div>
                                    <div className='w-[30%]'>Emri i User-it</div>
                                    <div className=''>Fjalëkalimi</div>
                                    <div className=''>Actions</div>
                                </div>
                            </div>

                            {clientsToDisplay.map((client, index) => (
                                <div key={index} className="flex flex-row items-center self-start w-full px-5 py-2 align-middle">
                                    <div className='flex flex-row w-[50%] gap-10 justify-start'>
                                        <div className='w-[20%] px-[6px]'>{client.clientName}</div>
                                        <div className='w-[25%] px-[5px]'>{client.mobileNumber}</div>
                                        <div className='ml-10 font-bold'>{client.sales}€</div>
                                    </div>
                                    <div className='flex flex-row w-[50%] gap-10 justify-start'>
                                        <div className='w-[30%]'>12/12/12</div>
                                        <div className='w-[30%]'>{client.userName}</div>
                                        <div className=''>**********</div>
                                        <div className='flex '>
                                            <button onClick={() => editClient(client)} className='py-2 px-3 h-12 flex flex-row gap-3 items-center align-middle bg-[#128F96] rounded-lg cursor-pointer hover:bg-cyan-700 transition-all duration-200'>
                                                <img src={editIcon} className='w-[20px] h-[20px]' />
                                            </button>
                                            <button onClick={()=>deleteClient(client)} className='py-2 px-3 h-12 flex flex-row gap-3 items-center align-middle bg-red-500  rounded-lg cursor-pointer hover:bg-red-700 transition-all duration-200'>
                                                <span className="text-white">X</span>
                                            </button>
                                        </div>
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