// Dashboard.js
import React, { useEffect, useState } from 'react';
import BarChart from '../../Components/barChart';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [appointments, setAppointments] = useState(0);
    const [todayAppointments, setTodayAppointments] = useState(0);
    const [sales, setSales] = useState(0);
    const [todaySales, setTodaySales] = useState(0);
    const [appointmentsData, setAppointmentsData] = useState([44, 55, 41, 67, 22, 43, 21]);
    const [salesData, setSalesData] = useState([44, 55, 41, 67, 22, 43, 21]);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token') === null) {
            navigate('/login');
        }
    }, []);

    const getData = async () => {
        // ... (existing code)
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="container mx-auto mt-10 p-4">
            <div className="flex flex-col gap-4 md:flex-row md:justify-around">
                {/* Donut Charts */}
                <div className="bg-white drop-shadow-lg p-4 flex flex-col justify-center gap-2 rounded-lg md:w-[40vw]">
                    <div className="flex flex-row gap-10">
                        {/* ... (existing code) */}
                    </div>
                </div>
                <div className="bg-white drop-shadow-lg p-4 flex flex-col justify-center gap-2 rounded-lg md:w-[40vw]">
                    <div className="flex flex-row gap-10">
                        {/* ... (existing code) */}
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap justify-around mt-8">
                {/* Bar Charts */}
                <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 mb-4">
                    <BarChart title="Total Appointments" data={appointmentsData} />
                </div>
                <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 mb-4">
                    <BarChart title="Total Sales" data={salesData} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;