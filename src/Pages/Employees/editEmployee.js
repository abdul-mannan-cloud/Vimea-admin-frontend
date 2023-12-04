import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, InputAdornment, TextField } from "@mui/material";
import plusIcon from '../../resources/Plus.png';

const EditEmployee = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [employeeData, setEmployeeData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
    });

    useEffect(() => {
        if(localStorage.getItem('token') === null){
            navigate('/login')
        }
        if(localStorage.getItem('role') !== 'admin'){
            navigate('/employees')
        }
    }, []);

    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            try {
                console.log(id);
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/employee/getemployee/${id}`);
                setEmployeeData(response.data);
            } catch (error) {
                console.error('Error fetching employee details:', error.message);
            }
        };
        fetchEmployeeDetails();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleEditEmployee = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/employee/editemployee/${id}`, employeeData);
            console.log('Employee edited successfully:', response.data);
            navigate('/employees');
        } catch (error) {
            console.error('Error editing employee:', error.message);
        }
    };

    console.log(id)

    return (
        <div className='flex h-screen bg-gray-100'>
            <div className='flex flex-col w-full overflow-auto'>
                <div className='mt-32 w-[50%] self-center mx-auto items-start justify-start'>
                    <button onClick={() => navigate('/employees')} className='py-2 px-5 rounded-lg bg-[#128F96] font-bold text-white hover:bg-cyan-700 transition-all duration-200'>Kthehu</button>
                </div>
                <div className="flex flex-col items-center bg-white self-center justify-center align-middle w-[50%] ml-16 mt-10 rounded-xl p-10 px-20">
                    <span className='text-xl font-bold'>Employee Details</span>
                    <div className='p-10 rounded-xl bg-white self-center w-full'>
                        <div className='flex flex-col gap-5 w-full font-bold'>
                            <div className='flex flex-col gap-2 w-full'>
                                <label>Emri i/e punonjësit</label>
                                <input type='text' className='border rounded-lg border-gray-400 shadow-lg py-2 px-3 w-full' value={employeeData.name} name='name' id='name' onChange={handleInputChange}></input>
                            </div>
                            <div className='flex flex-col gap-2 w-full'>
                                <label>Email i/e punonjësit</label>
                                <input type='email' className='border rounded-lg border-gray-400 shadow-lg py-2 px-3 w-full ' value={employeeData.email} name='email' id='email' onChange={handleInputChange}></input>
                            </div>
                            <div className='flex flex-col gap-2 w-full'>
                                <label>Numri i telefonit i/ punonjësit</label>
                                <input className='border rounded-lg border-gray-400 shadow-lg py-2 px-3 w-full' name='phone' value={employeeData.phone} id='phone' onChange={handleInputChange}></input>
                            </div>
                            <div className='flex flex-col gap-2 w-full'>
                                <label>Password</label>
                                <input className='border rounded-lg border-gray-400 shadow-lg py-2 px-3 w-full' name='password' value={employeeData.password} id='password' onChange={handleInputChange}></input>
                            </div>
                        </div>
                    </div>
                <div className='w-full px-10'>
                    <button onClick={handleEditEmployee} className='w-full rounded-lg bg-[#128F96] py-2 text-white font-bold shadow-lg'>
                        Ruaj Ndryshimet
                    </button>
                </div>
            </div>
        </div>
    </div>
    );
}

export default EditEmployee;
