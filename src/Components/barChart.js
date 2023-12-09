// BarChart.js
import React from 'react';
import ReactApexChart from 'react-apexcharts';

const BarChart = ({ title , data}) => {
    const chartOptions = {
        chart: {
            type: 'bar',
            stacked: true,
        },
        plotOptions: {
            bar: {
                horizontal: false,
            },
        },
        xaxis: {
            categories: [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat','Sun'],
        },
        legend: {
            position: 'bottom',
        },
    };

    const series = [
        {
            name: 'Series 1',
            data: data,
        },
    ];

    return (
        <div className="w-full md:w-1/2 p-4">
            <div className="shadow-lg rounded-lg overflow-hidden">
                <div className="p-8 bg-white">
                    <ReactApexChart options={chartOptions} series={series} type="bar" height={350} />
                </div>
                <div className="bg-gray-50 p-4">
                    <p className="text-indigo-500 text-center text-xl font-semibold">{title}</p>
                </div>
            </div>
        </div>
    );
};

export default BarChart;
