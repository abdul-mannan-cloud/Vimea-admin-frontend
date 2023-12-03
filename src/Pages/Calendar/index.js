import React, {useState, useCallback, useEffect} from 'react';
import {DndProvider, useDrag, useDrop} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Avatar from 'react-avatar';
import axios from "axios";
import {useNavigate} from "react-router-dom";

const times = ['7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'];

const ItemTypes = {
    APPOINTMENT: 'appointment',
};

function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [employees,setEmployees] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');

    const getData = async () => {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/employee/getallemployee`);
        if (res.status === 200) {
            setEmployees(res.data)
        }
        const appointmentRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/appointment/getallappointments`);
        if(appointmentRes.status === 200) {
            setAppointments(appointmentRes.data.map(appointment => {
                return {
                    id: appointment._id,
                    employee: appointment.employee?appointment.employee:res.data[0].name,
                    date: new Date(appointment.date),
                    time: appointment.time,
                    content: appointment.content
                }
            }))
            console.log(appointmentRes.data.map(appointment => {
                return {
                    id: appointment._id,
                    employee: appointment.employee?appointment.employee:res.data[0].name,
                    date: new Date(appointment.date),
                    time: appointment.time,
                    content: appointment.content
                }
            }))
        }
    }

    function convertTimeTo24HourFormat(timeString) {
        const [time, period] = timeString.split(' ');

        let [hours, minutes] = time.split(':');

        if (period === 'PM' && hours < 12) {
            hours = parseInt(hours, 10) + 12;
        } else if (period === 'AM' && hours === '12') {
            hours = '00';
        }

        return `${hours}:${minutes}`;
    }

    function compareTimes(time1, time2) {
        const formattedTime1 = convertTimeTo24HourFormat(time1);
        const formattedTime2 = convertTimeTo24HourFormat(time2);

        if (formattedTime1 < formattedTime2) {
            return 1
        } else if (formattedTime1 > formattedTime2) {
            return -1
        } else {
            return 0
        }
    }

    const navigate = useNavigate()
    useEffect(() => {
        getData()
    },[])

    useEffect(() => {

    }, [appointments]);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    useEffect(() => {
        if(localStorage.getItem('token') === null){
            navigate('/login')
        }
    }, []);
    const updateAppointment = async (appointment) => {
        if(localStorage.getItem('role') !== 'admin'){
            alert('You are not authorized to update anything')
            return;
        }
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/appointment/editappointment/${appointment.id}`, appointment);
        if (res.status === 200) {
            console.log('Appointment updated successfully');
        }
    }

    const moveAppointment = useCallback(async (id, newEmployee, newTime, newDate) => {
        let appointmentTemp = null
        setAppointments(prevAppointments => prevAppointments.map(appointment => {
            if (appointment.id === id) {
                appointmentTemp = {...appointment, employee: newEmployee, time: newTime, date: newDate};
                return {...appointment, employee: newEmployee, time: newTime, date: newDate};
            }
            return appointment;
        }));
        if(appointmentTemp)
            await updateAppointment(appointmentTemp)
    }, [setAppointments]);

    const handlePrevDay = () => {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() - 1);
        setCurrentDate(date);
    };

    const handleNextDay = () => {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() + 1);
        setCurrentDate(date);
    };

    useEffect(()=>{
        console.log(appointments)
    })
    // const formatDate = (date) => {
    //     return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    // };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className='container mx-auto p-4 mt-32 ml-20'>
                {/*change date functionality and next day */}
                <div className='flex justify-between items-center mb-4'>
                    <div className='flex items-center gap-5'>
                        <select
                            value={selectedEmployee.name}
                            onChange={(e) => setSelectedEmployee(e.target.value)}
                            className="p-2 border rounded"
                        >
                            <option value="">All Employees</option>
                            {employees.map((employee) => (
                                <option key={employee._id} value={employee.name}>
                                    {employee.name}
                                </option>
                            ))}
                        </select>
                        <div className="flex items-center">
                            <button onClick={handlePrevDay} className='bg-gray-200 hover:bg-gray-300 rounded px-4 py-2'>
                                <svg className='h-4 w-4 fill-current' viewBox='0 0 20 20'>
                                    <path d='M12.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L9.414 10l4.293 4.293a1 1 0 010 1.414z'/>
                                </svg>
                            </button>
                            <DatePicker
                                selected={currentDate}
                                onChange={date => setCurrentDate(date)}
                                customInput={<span className='mx-4 text-gray-700 cursor-pointer'>{formatDate(currentDate)}</span>}
                            />
                            <button onClick={handleNextDay} className='bg-gray-200 hover:bg-gray-300 rounded px-4 py-2'>
                                <svg className='h-4 w-4 fill-current' viewBox='0 0 20 20'>
                                    <path d='M7.707 14.707a1 1 0 01-1.414-1.414L9.586 10 6.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4z' />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="mb-4">

                    </div>
                </div>
                <table className='w-full'>
                    <thead className=''>
                    <tr>
                        <th className=' px-4 py-2'></th>
                        {employees.map((employee) => (
                            <th key={employee} className='border px-4 py-2 '>
                                <div className="flex flex-col justify-center items-center">
                                    <Avatar name={employee.name} size="100" round={true}/>
                                    {employee.name}
                                </div>
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {times.map((time) => (
                        <tr key={time}>
                            <td className='border px-4 py-2 h-32'>{time}</td>
                            {employees.map((employee) => (
                                <DropZone
                                    key={`${employee._id}-${time}-${currentDate}`}
                                    employee={employee.name}
                                    time={time}
                                    date={currentDate}
                                    moveAppointment={moveAppointment}
                                >

                                    {appointments
                                        .filter(app =>( selectedEmployee === '' || app.employee === selectedEmployee) && app.employee === employee.name && compareTimes(app.time,time)===0 && new Date(currentDate).toLocaleDateString() === new Date(app.date).toLocaleDateString())
                                        .map(app => (
                                            <DraggableAppointment key={app.id} appointment={app}/>
                                        ))}
                                </DropZone>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </DndProvider>
    );
}

function DropZone({children, employee, time, date, moveAppointment}) {
    const [, drop] = useDrop(() => ({
        accept: ItemTypes.APPOINTMENT,
        drop: (item) => {
            moveAppointment(item.id, employee, time, date);
        },
    }));

    return (
        <td ref={drop} className='border px-4 py-2'>
            {children}
        </td>
    );
}

function DraggableAppointment({appointment}) {
    const [, drag] = useDrag(() => ({
        type: ItemTypes.APPOINTMENT,
        item: {id: appointment.id},
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    return (
        <div ref={drag} className='cursor-move bg-white drop-shadow-lg p-2 m-2 border-l-2 border-red-500'>
            <p>{appointment.time}</p>
            <p>{appointment.date.toLocaleDateString()}</p>
            {appointment.content}
        </div>
    );
}

export default Calendar;
