// Dashboard.js
import React, {useEffect, useState} from 'react';
import BarChart from '../../Components/barChart';
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Dashboard = () => {

    const [appointments, setAppointments] = useState(0);
    const [todayAppointments, setTodayAppointments] = useState(0);
    const [sales, setSales] = useState(0);
    const [todaySales, setTodaySales] = useState(0);
    const [appointmentsData, setAppointmentsData] = useState([44, 55, 41, 67, 22, 43, 21]);
    const [salesData, setSalesData] = useState([44, 55, 41, 67, 22, 43, 21]);
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('token') === null){
            navigate('/login')
        }
    }, []);

    const getData = async () => {

        //orders data
        const orderTodayRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/order/today`);
        const totalOrderRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/order/orders`);
        if (orderTodayRes.status === 200) {
            setTodaySales(orderTodayRes.data.length);
        }
        if (totalOrderRes.status === 200) {
            setSales(totalOrderRes.data.length);
        }

        //appointments data
        const appointmentTodayRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/appointment/gettodayappointments`);
        const totalAppointmentRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/appointment/getallappointments`);
        if (appointmentTodayRes.status === 200) {
            setTodayAppointments(appointmentTodayRes.data.length);
        }
        if (totalAppointmentRes.status === 200) {
            setAppointments(totalAppointmentRes.data.length);
        }


        // table orders data
       const today = new Date();
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);

        const lastWeekOrders = totalOrderRes.data.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= oneWeekAgo && orderDate <= today;
        });

        const dailyOrderCounts = Array(7).fill(0); // Initialize an array with 7 elements (representing days of the week) with initial count 0

        lastWeekOrders.forEach(order => {
            const orderDate = new Date(order.date);
            const dayOfWeek = orderDate.getDay(); // 0 (Sunday) to 6 (Saturday)

            dailyOrderCounts[dayOfWeek]++;
        });
        setSalesData(dailyOrderCounts);

        // table appointments data
        const lastWeekAppointments = totalAppointmentRes.data.filter(appointment => {
            const appointmentDate = new Date(appointment.date);
            return appointmentDate >= oneWeekAgo && appointmentDate <= today;
        });

        const dailyAppointmentCounts = Array(7).fill(0); // Initialize an array with 7 elements (representing days of the week) with initial count 0

        lastWeekAppointments.forEach(appointment => {
            const appointmentDate = new Date(appointment.date);
            const dayOfWeek = appointmentDate.getDay(); // 0 (Sunday) to 6 (Saturday)

            dailyAppointmentCounts[dayOfWeek]++;
        });
        setAppointmentsData(dailyAppointmentCounts);

    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="container mx-auto mt-20 p-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-around">
                {/* Donut Charts */}
                <div className="bg-white drop-shadow-lg p-4 flex flex-col justify-center gap-2 rounded-lg w-[40vw]">
                    <div className="flex flex-row gap-10">
                        <div>
                            <h2 className="text-4xl font-bold text-start">{todayAppointments}</h2>
                            <h1 className="text-4xl font-bold text-[#128F96]">Terminet Ditore</h1>
                        </div>
                        <div className="border-[1px] min-h-max border-gray-200"></div>
                        <div>
                            <h2 className="text-4xl font-bold text-start">{appointments}</h2>
                            <h1 className="text-4xl font-bold text-[#128F96]">Totali i Termineve</h1>
                        </div>
                    </div>
                </div>
                <div className="bg-white drop-shadow-lg p-4 flex flex-col justify-center gap-2 rounded-lg w-[40vw]">
                    <div className="flex flex-row gap-10">
                        <div>
                            <h2 className="text-4xl font-bold text-start">{todaySales}</h2>
                            <h1 className="text-4xl font-bold text-[#128F96]">Shitjet Ditore</h1>
                        </div>
                        <div className="border-[1px] min-h-max border-gray-200"></div>
                        <div>
                            <h2 className="text-4xl font-bold text-start">{sales}</h2>
                            <h1 className="text-4xl font-bold text-[#128F96]">Totali i Shitjeve</h1>
                        </div>
                    </div>

                </div>
            </div>
            <div className="flex flex-wrap justify-around mt-8">
                {/* Bar Charts */}
                <BarChart title="Total Appointments" data={appointmentsData}/>
                <BarChart title="Total Sales" data={salesData}/>
            </div>
        </div>
    );
};

export default Dashboard;