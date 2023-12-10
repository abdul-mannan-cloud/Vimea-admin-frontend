import React, {useState} from 'react';
import NavBar from '../../Components/navbar';
import Sidebar from '../../Components/sidebar';
import AddBlogs from '../../resources/addBlogs.png';
import {useNavigate} from 'react-router-dom';
import {useEffect} from 'react';
import axios from 'axios';
import {useRef} from 'react';
import {Container, InputAdornment, TextField} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import arrowIcon from '../../resources/arrowIcon.png';
import plusIcon from '../../resources/Plus.png';
import AWS from 'aws-sdk';

import femaleIcon from '../../resources/female.png'
import Plus from "../../resources/Plus.png";

const Appointments = () => {

    const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token') === null) {
            navigate('/login')
        }
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/service/getallservices`);
                setAppointments(response.data);
            } catch (error) {
                console.error('Error fetching appointments:', error.message);
            }
        }
        fetchAppointments();
    }, [])

    // const appointments = [
    //     {
    //         service: "Plush",
    //         price: "25",
    //         duration: 45,
    //         category: "Për Fëmijë"
    //     },
    //     {
    //         service: "Plush",
    //         price: "25",
    //         duration: 45,
    //         category: "Për Bebe"
    //     },
    //     {
    //         service: "Plush",
    //         price: "25",
    //         duration: 45,
    //         category: "Për Fëmijë"
    //     },
    //     {
    //         service: "Plush",
    //         price: "25",
    //         duration: 45,
    //         category: "Për Bebe"
    //     },
    //     {
    //         service: "Plush",
    //         price: "25",
    //         duration: 45,
    //         category: "Mami + Bebi"
    //     },
    //     {
    //         service: "Plush",
    //         price: "25",
    //         duration: 45,
    //         category: "Për Fëmijë"
    //     },
    //     {
    //         service: "Plush",
    //         price: "25",
    //         duration: 45,
    //         category: "Mami + Bebi"
    //     },
    //     {
    //         service: "Plush",
    //         price: "25",
    //         duration: 45,
    //         category: "Për Bebe"
    //     },
    //     {
    //         service: "Plush",
    //         price: "25",
    //         duration: 45,
    //         category: "Për Fëmijë"
    //     },
    //     {
    //         service: "Plush",
    //         price: "25",
    //         duration: 45,
    //         category: "Për Bebe"
    //     },
    //     {
    //         service: "Plush",
    //         price: "25",
    //         duration: 45,
    //         category: "Mami + Bebi"
    //     },
    //     {
    //         service: "Plush",
    //         price: "25",
    //         duration: 45,
    //         category: "Group Plush"
    //     },
    //     {
    //         service: "Plush",
    //         price: "25",
    //         duration: 45,
    //         category: "Mami + Bebi"
    //     },
    //     {
    //         service: "Plush",
    //         price: "25",
    //         duration: 45,
    //         category: "Për Bebe"
    //     },
    //     {
    //         service: "Plush",
    //         price: "25",
    //         duration: 45,
    //         category: "Group Plush"
    //     },
    //     {
    //         service: "Plush",
    //         price: "25",
    //         duration: 45,
    //         category: "Për Nënen"
    //     },
    //     {
    //         service: "Plush",
    //         price: "25",
    //         duration: 45,
    //         category: "Për Nënen"
    //     },
    // ]

    const groups = ["Për Fëmijë", "Për Bebe", "Group Plush", "Për Nënen","Mami + Bebi"];

    const deleteAppointment = async (id) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/service/deleteservice/${id}`);
            if (response.status === 200) {
                alert("Service deleted successfully!")
                window.location.reload();
            } else {
                alert("Something went wrong!")
            }
        } catch (error) {
            console.error('Error deleting appointment:', error.message);
        }
    }


    const groupAppointments = appointments.filter(appointment => appointment.group === "Group Plush");
    const childrenAppointments = appointments.filter(appointment => appointment.group === "Për Fëmijë");
    const babyAppointments = appointments.filter(appointment => appointment.group === "Për Bebe");
    const motherAppointments = appointments.filter(appointment => appointment.group === "Për Nënen");
    const motherBabyAppointments = appointments.filter(appointment => appointment.group === "Mami + Bebi");

    return (
        <div className='flex flex-col pt-32 h-screen bg-gray-100'>
            <button
                onClick={() => navigate('/appointments/add')}
                className='flex gap-3 px-3 py-2 bg-[#128F96] rounded-xl justify-center items-center hover:bg-cyan-700 transition-all duration-200 cursor-pointer w-48 ml-32'
            >
                <img src={Plus} className=''/>
                <span className='text-lg font-bold text-white'>SHTO Service</span>
            </button>
            <div className='flex flex-col w-full overflow-auto'>
                <div
                    className="flex items-center bg-gray-100 self-center justify-center align-middle w-[90%] ml-16  rounded-xl p-10 px-20 flex-col gap-10">
                    <div className='flex flex-col w-full gap-1'>
                        <div className='ml-2 font-bold'>Për Fëmijë</div>
                        {childrenAppointments.map((appointment, index) =>
                            <div
                                className='flex flex-row justify-between rounded-lg h-[50px] w-full bg-white font-bold shadow-xl'>
                                <div className='w-0 h-full border-4 border-yellow-400 rounded-full'></div>
                                <div
                                    className='flex flex-row items-center justify-between w-full h-full gap-10 px-5 py-2 align-middle'>
                                    <span>{appointment.name}</span>
                                    <span>{appointment.duration} min</span>
                                    <div>
                                        <span>
                                        €{appointment.price}
                                        </span>
                                        <span>
                                            <button onClick={() => {
                                                //delete
                                                deleteAppointment(appointment._id)
                                            }}
                                                    className='text-xs font-normal bg-red-500 rounded-lg text-white p-2 hover:text-red-700'>Delete</button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='flex flex-col w-full gap-1'>
                        <div className='ml-2 font-bold'>Për Bebe</div>
                        {groupAppointments.map((appointment, index) =>
                            <div
                                className='flex flex-row justify-between rounded-lg h-[50px] w-full bg-white font-bold shadow-xl'>
                                <div className='w-0 h-full border-4 border-green-600 rounded-full'></div>
                                <div
                                    className='flex flex-row items-center justify-between w-full h-full gap-10 px-5 py-2 align-middle'>
                                    <span>{appointment.name}</span>
                                    <span>{appointment.duration} min</span>
                                    <div>
                                        <span>
                                        €{appointment.price}
                                        </span>
                                        <span>
                                            <button onClick={() => {
                                                //delete
                                                deleteAppointment(appointment._id)
                                            }}
                                                    className='text-xs font-normal bg-red-500 rounded-lg text-white p-2 hover:text-red-700'>Delete</button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='flex flex-col w-full gap-1'>
                        <div className='ml-2 font-bold'>Group Plush </div>
                        {babyAppointments.map((appointment, index) =>
                            <div
                                className='flex flex-row justify-between rounded-lg h-[50px] w-full bg-white font-bold shadow-xl'>
                                <div className='w-0 h-full border-4 border-blue-400 rounded-full'></div>
                                <div
                                    className='flex flex-row items-center justify-between w-full h-full gap-10 px-5 py-2 align-middle'>
                                    <span>{appointment.name}</span>
                                    <span>{appointment.duration} min</span>
                                    <div>
                                        <span>
                                        €{appointment.price}
                                        </span>
                                        <span>
                                            <button onClick={() => {
                                                //delete
                                                deleteAppointment(appointment._id)
                                            }}
                                                    className='text-xs font-normal bg-red-500 rounded-lg text-white p-2 hover:text-red-700'>Delete</button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='flex flex-col w-full gap-1'>
                        <div className='ml-2 font-bold'>Për Nënen</div>
                        {motherAppointments.map((appointment, index) =>
                            <div
                                className='flex flex-row justify-between rounded-lg h-[50px] w-full bg-white font-bold shadow-xl'>
                                <div className='w-0 h-full border-4 border-purple-600 rounded-full'></div>
                                <div
                                    className='flex flex-row items-center justify-between w-full h-full gap-10 px-5 py-2 align-middle'>
                                    <span>{appointment.name}</span>
                                    <span>{appointment.duration} min</span>
                                    <div>
                                        <span>
                                        €{appointment.price}
                                        </span>
                                        <span>
                                            <button onClick={() => {
                                                //delete
                                                deleteAppointment(appointment._id)
                                            }}
                                                    className='text-xs font-normal bg-red-500 rounded-lg text-white p-2 hover:text-red-700'>Delete</button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='flex flex-col w-full gap-1'>
                        <div className='ml-2 font-bold'>Mami + Bebi</div>
                        {motherBabyAppointments.map((appointment, index) =>
                            <div
                                className='flex flex-row justify-between rounded-lg h-[50px] w-full bg-white font-bold shadow-xl'>
                                <div className='w-0 h-full border-4 border-red-600 rounded-full'></div>
                                <div
                                    className='flex flex-row items-center justify-between w-full h-full gap-10 px-5 py-2 align-middle'>
                                    <span>{appointment.name}</span>
                                    <span>{appointment.duration} min</span>
                                    <div>
                                        <span>
                                        €{appointment.price}
                                        </span>
                                        <span>
                                            <button onClick={() => {
                                                //delete
                                                deleteAppointment(appointment._id)
                                            }}
                                                    className='text-xs font-normal bg-red-500 rounded-lg text-white p-2 hover:text-red-700'>Delete</button>
                                        </span>
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

export default Appointments;