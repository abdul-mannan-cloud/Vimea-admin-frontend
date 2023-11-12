// Dashboard.js
import React from 'react';
import DonutChart from '../Components/donutChart';
import BarChart from '../Components/barChart';

const Dashboard = () => {
    return (
        <div className="container mx-auto mt-20 p-4">
            <div className="flex flex-wrap justify-around">
                {/* Donut Charts */}
                <div className="bg-white drop-shadow-lg p-4 flex flex-col justify-center gap-2 rounded-lg w-[40vw]">
                    <h2 className="text-4xl font-bold text-start">8</h2>
                    <h1 className="text-4xl font-bold text-[#34D399]">Total Appointments</h1>
                </div>
                <div className="bg-white drop-shadow-lg p-4 flex flex-col justify-center gap-2 rounded-lg w-[40vw]">
                    <h2 className="text-4xl font-bold text-start">8</h2>
                    <h1 className="text-4xl font-bold text-[#34D399]">Total Sales</h1>
                </div>
            </div>
            <div className="flex flex-wrap justify-around mt-8">
                {/* Bar Charts */}
                <BarChart title="Total Appointments" data={[44, 55, 41, 67, 22, 43, 21]}/>
                <BarChart title="Total Sales" data={[44, 55, 41, 67, 22, 43, 21]} />
            </div>
        </div>
    );
};

export default Dashboard;
