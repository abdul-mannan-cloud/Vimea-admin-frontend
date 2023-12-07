import React, { useState } from 'react';
import NavBar from '../../Components/navbar';
import Sidebar from '../../Components/sidebar';
import AddBlogs from '../../resources/addBlogs.png';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { useRef } from 'react';
import { Container, InputAdornment, TextField, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import arrowIcon from '../../resources/arrowIcon.png';
import plusIcon from '../../resources/Plus.png';
import AWS from 'aws-sdk';
import femaleIcon from '../../resources/female.png'

const Employees = () => {
    const [dropDown, setDropDown] = useState(false);
    const [isRotated, setIsRotated] = useState(false);
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        if(localStorage.getItem('token') === null){
            navigate('/login')
        }
    }, []);

    const toggle = () => {
        setDropDown((prev) => !prev);
        setIsRotated((prev) => !prev);
    };

    const handleEdit = (employeeId) => {
        navigate(`/employees/edit/${employeeId}`);
    };

    const handleDelete = async (employeeId) => {
        try {
            console.log(employeeId)
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/employee/deleteemployee/${employeeId}`);
            
            setEmployees((prevEmployees) => prevEmployees.filter((employee) => employee._id !== employeeId));
        } catch (error) {
            console.error('Error deleting employee:', error.message);
        }
    };

    const [searchQuery, setSearchQuery] = useState("");

    const filteredEmployees = employees.filter((employee) =>
        employee.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/employee/getallemployee`);
                setEmployees(response.data);
            } catch (error) {
                console.error('Error fetching employees:', error.message);
            }
        };

        fetchData();
    }, []);

    const transClass = dropDown ? 'flex' : 'hidden';


    return(
        <div className='flex h-screen bg-gray-100'>
            <div className='flex flex-col w-full overflow-auto'>
                <div className="flex items-center bg-gray-100 self-center justify-center align-middle w-[90%] ml-16 mt-32 rounded-xl p-10 px-20">
                    <div className="flex flex-col w-full">
                        <div className='flex flex-row justify-between w-full'>
                            <div className='mt-1 rounded-lg'> 
                                <TextField 
                                    id="search"
                                    type="search"
                                    label="Kërko"
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
                                    <div  onClick={() => navigate('/employees/add')} className='py-2 px-3 flex flex-row gap-3 items-center align-middle bg-[#128F96] h-10 rounded-lg cursor-pointer hover:bg-cyan-700 transition-all duration-200'>
                                        <img src={plusIcon} className='w-[25px] h-[25px]' />
                                        <span className='font-bold text-white'>SHTO PUNTORIN</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='mt-10'>
                            <span className='text-xl font-bold'>Stafi</span>
                        </div>

                        <div className='flex flex-col w-full gap-3 mt-2'>

                        {filteredEmployees.map((employee, index) => (
                                <div key={index} className="flex items-center self-start justify-center w-full gap-10 px-8 py-2 align-middle bg-white rounded-lg row">
                                    <div className='w-[50%] flex items-start align-middle justify-start'>
                                        <div className='flex flex-col items-center gap-2'>
                                            <div className='h-[70px] w-[70px] border border-[#128F96] rounded-full flex items-center justify-center align-middle text-4xl font-bold text-[#128F96]'>
                                                <span>
                                                    {employee.name.length === 1
                                                        ? employee.name.toUpperCase() 
                                                        : `${employee.name[0].toUpperCase()}${employee.last_name ? employee.last_name[0].toUpperCase() : ''}`
                                                    }
                                                </span>
                                            </div>
                                            <div className='text-[#128F96]'>{employee.name}</div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col w-[50%]'>
                                        <span>{employee.email}</span>
                                        <span>{employee.phone}</span>
                                    </div>
                                    <div className='flex flex-col w-[20%]'>
                                        <Button
                                            variant="outlined"
                                            startIcon={<EditIcon />}
                                            onClick={() => handleEdit(employee._id)}
                                        >
                                            Edit
                                        </Button>
                                        <br/>
                                        <Button
                                            variant="outlined"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => handleDelete(employee._id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
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