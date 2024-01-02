import React, {useState, useCallback, useEffect} from 'react';
import {DndProvider, useDrag, useDrop} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Avatar from 'react-avatar';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import PlusIcon from "../../resources/Plus.png";
import CrossIcon from "../../resources/close.png";
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

const times = [ '10:00', '11:00', '12:00', '13:00','14:00','15:00','16:00','17:00','18:00'];

const ItemTypes = {
    APPOINTMENT: 'appointment',
};

function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [employees,setEmployees] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');

    const [appointment, setAppointment] = useState({
        category: '',
        type: '',
        date: '',
        time: '',
        parent: '',
        child: '',
        number: '',
        email: '',
    });

    const findColor = (category) => {
        if (category=="Group Plush") return 'blue-400'
        if (category=="Për Fëmijë") return 'yellow-400'
        if (category=="Për Bebe") return 'green-600'
        if (category=="Për Nënen") return 'purple-600'
        if (category=="Mami + Bebi") return 'red-600'
    }

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
                    content: appointment.service,
                    category: appointment.category,
                    parentName: appointment.parent.firstName + ' ' + appointment.parent.lastName,
                    childName: appointment.child.firstName + ' ' + appointment.child.lastName,
                    color: findColor(appointment.category),
                    approved: appointment.approved,
                    status: appointment.status,
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
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/appointment/editappointment/${appointment.id}`, appointment);
        if (res.status === 200) {
            alert('Appointment updated successfully')
        }
    }

    const cancelAppointment = async (appointment) => {
        const res = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/appointment/deleteappointment/${appointment.id}`, appointment);
        if (res.status === 200) {
            alert('Appointment deleted successfully')
        }
    }

    const moveAppointment = useCallback(async (id, newEmployee, newTime, newDate) => {
        if(localStorage.getItem('role') !== 'admin'){
            alert('You are not authorized to update anything')
            return;
        }
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
    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          outerHeight: '100px',
        },
      };
      
    const [modalIsOpen, setIsOpen] = React.useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    const handleInputChange = (field, value) => {
        setAppointment((prevAppointment) => ({
          ...prevAppointment,
          [field]: value,
        }));
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className='container p-4 mx-auto mt-32 ml-20'>
                {/*change date functionality and next day */}
                <div className='flex items-center justify-between mb-4'>
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
                            <button onClick={handlePrevDay} className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300'>
                                <svg className='w-4 h-4 fill-current' viewBox='0 0 20 20'>
                                    <path d='M12.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L9.414 10l4.293 4.293a1 1 0 010 1.414z'/>
                                </svg>
                            </button>
                            <DatePicker
                                selected={currentDate}
                                onChange={date => setCurrentDate(date)}
                                customInput={<span className='mx-4 text-gray-700 cursor-pointer'>{formatDate(currentDate)}</span>}
                            />
                            <button onClick={handleNextDay} className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300'>
                                <svg className='w-4 h-4 fill-current' viewBox='0 0 20 20'>
                                    <path d='M7.707 14.707a1 1 0 01-1.414-1.414L9.586 10 6.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4z' />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="mb-4">
                        <div 
                            onClick={(e) =>
                                {
                                    openModal();
                                }
                            } 
                            className='bg-[#128F96] py-2 px-5 rounded-lg'><img src={PlusIcon} className='w-8 h-8' /></div>
                            <Modal
                                isOpen={modalIsOpen}
                                onRequestClose={closeModal}
                                style={customStyles}
                            >
                                <div className='w-full h-full flex flex-col items-center justify-center align-middle'>
                                    <div className='w-full flex justify-end'>
                                        <img src={CrossIcon} onClick={closeModal} className='w-7 h-7'/>
                                        
                                    </div>

                                    <div className='w-fit mb-10'>
                                        <h className="text-2xl self-center font-bold">Appointment Details</h>
                                    </div>


                                    <form className='w-fit grid grid-cols-2 gap-5 p-5'>
                                        <div className='flex flex-col gap-3'>
                                            <label className='w-[300px]'>Select a Service</label>
                                            <select 
                                                className='w-[300px] p-2 rounded bg-gray-300' 
                                                onChange={(e) => handleInputChange('category', e.target.value)}
                                            >
                                                <option>Plush</option>
                                                <option>Plush</option>
                                                <option>Plush</option>
                                                <option>Plush</option>
                                                <option>Plush</option>
                                                <option>Plush</option>
                                            </select>
                                        </div>
                                        <div className='flex flex-col gap-3'>
                                            <label className='w-[300px]' >Select Service Type</label>
                                            <select 
                                                className='w-[300px] p-2 rounded bg-gray-300'
                                                onChange={(e) => handleInputChange('type', e.target.value)}
                                            >
                                                <option>Plush bebe</option>
                                                <option>Plush bebe</option>
                                                <option>Plush bebe</option>
                                                <option>Plush bebe</option>
                                                <option>Plush bebe</option>
                                                <option>Plush bebe</option>
                                            </select>
                                        </div>
                                        <div className='flex flex-col gap-3'>
                                            <label className='w-[300px]' >Select Date</label>
                                            <input onChange={(e) => handleInputChange('date', e.target.value)} className='w-[300px] p-2 rounded bg-gray-300' type='date'></input>
                                        </div>
                                        <div className='flex flex-col gap-3'>
                                            <label className='w-[300px]' >Select Time</label>
                                            <input onChange={(e) => handleInputChange('time', e.target.value)} className='w-[300px] p-2 rounded bg-gray-300' type='time'></input>
                                        </div>
                                        <div className='flex flex-col gap-3'>
                                            <label className='w-[300px]' >Emri i prinditt</label>
                                            <input onChange={(e) => handleInputChange('parentFirstName', e.target.value)} className='w-[300px] p-2 rounded bg-gray-300' type='text'></input>
                                        </div>
                                        <div className='flex flex-col gap-3'>
                                            <label className='w-[300px]' >Mbiemri i prinditt</label>
                                            <input onChange={(e) => handleInputChange('parentLastName', e.target.value)} className='w-[300px] p-2 rounded bg-gray-300' type='text'></input>
                                        </div>
                                        <div className='flex flex-col gap-3'>
                                            <label className='w-[300px]' >Emri i bebes</label>
                                            <input onChange={(e) => handleInputChange('babyFirstName', e.target.value)} className='w-[300px] p-2 rounded bg-gray-300' type='text'></input>
                                        </div>
                                        <div className='flex flex-col gap-3'>
                                            <label className='w-[300px]' >Mbiemri i bebes</label>
                                            <input onChange={(e) => handleInputChange('babyLastName', e.target.value)} className='w-[300px] p-2 rounded bg-gray-300' type='text'></input>
                                        </div>
                                        <div className='flex flex-col gap-3'>
                                            <label className='w-[300px]' >Date e lindjes së bebes</label>
                                            <input onChange={(e) => handleInputChange('babyBirthDate', e.target.value)} className='w-[300px] p-2 rounded bg-gray-300' type='date'></input>
                                        </div>
                                        <div className='flex flex-col gap-3'>
                                            <label className='w-[300px]' >Numri Kontaktues</label>
                                            <input onChange={(e) => handleInputChange('contactNumber', e.target.value)} className='w-[300px] p-2 rounded bg-gray-300' type='text'></input>
                                        </div>
                                        <div className='flex flex-col gap-3'>
                                            <label className='w-[300px]' >Email</label>
                                            <input onChange={(e) => handleInputChange('email', e.target.value)} className='w-[300px] p-2 rounded bg-gray-300' type='email'></input>
                                        </div>
                                    </form>
                                </div>

                            </Modal>
                    </div>
                </div>
                <table className='w-full'>
                    <thead className=''>
                    <tr>
                        <th className='px-4 py-2 '></th>
                        {employees.map((employee) => (
                            <th key={employee} className='px-4 py-2 border '>
                                <div className="flex flex-col items-center justify-center">
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
                            <td className='h-32 px-4 py-2 border'>{time}</td>
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
                                            <DraggableAppointment key={app.id} appointment={app} updateAppointment={updateAppointment} cancelAppointment={cancelAppointment}/>
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
        <td ref={drop} className='px-4 py-2 border'>
            {children}
        </td>
    );
}

function DraggableAppointment({appointment,updateAppointment,cancelAppointment}) {
    const [, drag] = useDrag(() => ({
        type: ItemTypes.APPOINTMENT,
        item: {id: appointment.id},
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    const [status, setStatus] = useState("pending");

    return (
        <div ref={drag} className={`cursor-move grid grid-cols-2 bg-white drop-shadow-lg p-2 m-2 max-w-[500px] border-l-4 border-${appointment.color}
            ${
                appointment.status == "notShow" || status == "notShow"
                ? 'bg-red-600 text-white'
                : 'bg-white'
            }
            ${
                status == "cancelled"
                ? 'hidden'
                : 'grid'
            }
        `}>
            <p className="col-span-1">Time: {appointment.time}</p>
            <p className="col-span-1">Date: {appointment.date.toLocaleDateString()}</p>
            <p className="col-span-1">Service: {appointment.content}</p>
            <p className="col-span-1">Category: {appointment.category}</p>
            <p className="col-span-1">Parent: {appointment.parentName}</p>
            <p className="col-span-1">Child: {appointment.childName}</p>
            <div className='flex flex-row justify-between w-full col-span-2'>
                <button onClick={()=>{
                    appointment.approved = true
                    updateAppointment(appointment)
                }} disabled={appointment.approved} className={` bg-blue-500 disabled:bg-gray-400 text-white rounded-md p-2 w-[32%]
                    ${
                        appointment.status == "notShow" || status == "notShow"
                        ? "hidden"
                        : "block"
                    }
                `}>{
                    appointment.approved ? 'Approved' : 'Approve'
                }</button>
                
                <button onClick={()=>{
                    appointment.status = "notShow"
                    updateAppointment(appointment)
                    setStatus("notShow");
                }} disabled={appointment.approved} className={` bg-red-600 disabled:bg-gray-400 text-white rounded-md p-2 w-[32%]
                    ${
                        appointment.status == "notShow" || status == "notShow"
                        ? "hidden"
                        : "block"
                    }
                `}>{
                    appointment.status == "notShow" ? 'Show' : 'Not Show'
                }</button>

                <button onClick={()=>{
                    appointment.approved = false
                    appointment.status = "cancelled"
                    setStatus("cancelled");
                    cancelAppointment(appointment)
                }} disabled={appointment.approved} className={` bg-purple-700 disabled:bg-gray-400 text-white rounded-md p-2 w-[32%]
                    ${
                        appointment.status == "notShow" || status == "notShow"
                        ? "hidden"
                        : "block"
                    }
                `}>{
                    appointment.approved ? 'Cancel' : 'Cancel'
                }</button>
            </div>

        </div>
    );
}

export default Calendar;
