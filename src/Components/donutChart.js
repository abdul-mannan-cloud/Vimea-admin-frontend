// DonutChart.js
import React from 'react';
import ReactApexChart from 'react-apexcharts';

const DonutChart = ({ title, value }) => {
    const chartOptions = {
        chart: {
            type: 'donut',
        },
        labels: [title],
        colors: ['#128F96'],
        legend: {
            show: false,
        },
        dataLabels: {
            enabled: false,
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '45%',
                },
            },
        },
    };

    const series = [value];

    return (
        <div className="w-full md:w-1/4 p-4">
            <div className="shadow-lg rounded-lg overflow-hidden">
                <div className="p-8 bg-white">
                    <ReactApexChart options={chartOptions} series={series} type="donut" />
                </div>
                <div className="bg-gray-50 p-4">
                    <p className="text-indigo-500 text-center text-xl font-semibold">{title}</p>
                </div>
            </div>
        </div>
    );
};

export default DonutChart;
