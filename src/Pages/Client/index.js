import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useEffect} from 'react';
import axios from 'axios';
import {Container, InputAdornment, TextField} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import plusIcon from '../../resources/Plus.png';
import editIcon from '../../resources/pencil.svg';
import IconButton from '@mui/material/IconButton';
import EditIcon from "@mui/icons-material/Edit";
import {Close} from "@mui/icons-material";

const Employees = () => {
    const [dropDown, setDropDown] = useState(false);
    const [isRotated, setIsRotated] = useState(false);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const toggle = () => {
        setDropDown((prev) => !prev);
        setIsRotated((prev) => !prev);
    };
    const transClass = dropDown ? 'flex' : 'hidden';

    const [clients, setClients] = useState([]);

    const calculatePrice = (order) => {
        if (order.state === 'Kosova') {
            return 2;
        } else if (order.state === 'Shqiperi') {
            return 5;
        } else if (order.state === 'Macedoni') {
            return 5;
        } else {
            return 0;
        }
    };

    const calculateTotal = (order) => {
        return order.products.reduce((acc, product) => acc + product.price * product.quantity, 0) + calculatePrice(order);
    }

    const calculateSales = async (orders) => {
        let totalSales = 0;
        for (const order of orders) {
            const data = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/order/orders/${order}`);
            totalSales += calculateTotal(data.data);
        }
        console.log(totalSales)
        return totalSales;
    }

    const calculateAllSales = async (clients) => {
        for (const client of clients) {
            const sales = await calculateSales(client.orders);
            client.sales = sales;
        }
        setClients(clients);
    }

    useEffect(() => {
    }, [])

    useEffect(() => {
        setLoading(true)
        const getClients = async () => {
            try {
                const {data} = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/client/getallclients`);
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/client/getallchildren`);

                // Extract data and children
                const clients = data;
                const children = response.data;

                //console.log(clients)


                // Transform the clients array and replace children IDs with actual child objects
                const transformedClients = clients.map(user => {
                    const associatedChildren = user.children.map((childId) => {
                        return children.filter((child) => {
                            return childId === child._id; // Use === for comparison
                        });
                    });

                    // Flatten the array of arrays into a single array
                    const flattenedChildren = associatedChildren.flat();

                    //console.log(associatedChildren)
                    return {
                        id: user._id,
                        clientName: user.firstName + ' ' + user.lastName,
                        mobileNumber: user.contactNumber,
                        sales: 0,
                        userName: user.firstName,
                        password: user.password,
                        orders: user.orders,
                        appointments: user.appointments.length,
                        // Replace children IDs with actual child objects in the transformed data
                        children: flattenedChildren,
                    };
                });

                // Update state with the transformed data
                await calculateAllSales(transformedClients)
                setLoading(false)

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        getClients();
    }, []);


    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredClients = clients.filter((client) => {
        const clientNameMatch = client.clientName.toLowerCase().includes(searchQuery.toLowerCase());

        const babyNameMatch = client.children.some(babyName =>
            babyName.firstname.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return clientNameMatch || babyNameMatch;
    });


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
        if (localStorage.getItem('token') === null) {
            navigate('/login')
        }
    }, []);
    const deleteClient = async (client) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/client/deleteclient/${client.id}`);
            if (response.status === 200) {
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

    return (
        <>
            {loading && <div className="fixed top-0 left-0 w-screen h-screen bg-white opacity-50 z-50 flex justify-center items-center">
                <div className="animate-spin rounded-full h-20 w-20 border-t-2  border-teal-600"></div>
            </div> }
            <div className='flex h-screen bg-gray-100'>
                <div className='flex flex-col w-full overflow-auto'>
                    <div
                        className="flex items-center bg-gray-100 self-center justify-center align-middle w-full sm:pl-20 sm:pr-20 pr-1 pl-16 mt-32 rounded-xl py-10">
                        <div className="flex flex-col w-full">
                            <div
                                className='flex sm:flex-row flex-col sm:items-center items-end justify-between w-full align-middle'>
                                <div className='text-2xl font-bold pl-0 sm:pl-3'>Lista e Klientëve</div>
                                <div className='mt-1 rounded-lg'>
                                    <TextField
                                        id="search"
                                        type="search"
                                        label="Kërko"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        style={{borderRadius: '20px'}}
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
                                        <div onClick={() => navigate('/clients/add')}
                                             className='py-2 px-3 h-12 flex flex-row gap-3 items-center align-middle bg-[#128F96] rounded-lg cursor-pointer hover:bg-cyan-700 transition-all duration-200'>
                                            <img src={plusIcon} className='w-[25px] h-[25px]'/>
                                            <span className='font-bold text-white'>Shto Klientin</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flow-root">
                                <div className="overflow-x-auto ">
                                    <div className="inline-block min-w-full py-2 align-middle sm:pl-2 sm:pr-2 ">
                                        <div
                                            className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                                            <table className="min-w-full divide-y divide-gray-300 bg-white">
                                                <thead className="">
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                                                    >
                                                        Emri i Klientit
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                    >
                                                        Emri i bebes
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                    >
                                                        Numri i Telefonit
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                    >
                                                        Shitje
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                    >
                                                        Terminet
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                    >
                                                        Krijuar në
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                    >
                                                        Emri i User-it
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                    >
                                                        Fjalëkalimi
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                    >
                                                        Actions
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 bg-white">
                                                {clientsToDisplay.map((client, index) => (
                                                    <tr key={index}>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                                                            {client.clientName}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {client.children.map((child) => (
                                                                <span key={child.id}>
                                  {child.firstname} {child.lastName}
                                </span>
                                                            ))}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {client.mobileNumber}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-bold">
                                                            {client.sales}€
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-bold">
                                                            {client.appointments}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            12/12/12
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {client.userName}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            **********
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            <IconButton
                                                                onClick={() => editClient(client)}
                                                                color="primary"
                                                            >
                                                                <EditIcon/>
                                                            </IconButton>
                                                            <IconButton
                                                                onClick={() => deleteClient(client)}
                                                                color="error"
                                                            >
                                                                <Close/>
                                                            </IconButton>
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center mt-4">
                                {getPageNumbers().map((pageNumber, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange(pageNumber)}
                                        disabled ={ pageNumber == "..." ? true : false}
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
        </>
    )
}

export default Employees;
