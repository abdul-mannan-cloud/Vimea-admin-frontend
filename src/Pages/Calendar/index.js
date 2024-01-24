import React, {useState, useCallback, useEffect} from 'react';
import {DndProvider, useDrag, useDrop} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Avatar from 'react-avatar';
import axios, {get} from "axios";
import {useNavigate} from "react-router-dom";
import PlusIcon from "../../resources/Plus.png";
import CrossIcon from "../../resources/close.png";
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import app from "../../App";

const times = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

const ItemTypes = {
    APPOINTMENT: 'appointment',
};

function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [employees, setEmployees] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [options, setOptions] = useState([]);
    const [clients, setClients] = useState([]);
    const [children, setChildren] = useState([]);
    const [showParentInput, setShowParentInput] = useState(false);
    const [showChildInput, setShowChildInput] = useState(false);

    const [appointment, setAppointment] = useState({
        category: 'Hidroterapi',
        service: 'Hidroterapi për bebe',
        serviceType: 'Hidroterapi',
        date: '',
        time: '',
        parentFirstName: '',
        parentLastName: '',
        babyFirstName: '',
        babyLastName: '',
        number: '',
        email: '',
        duration: 20,
        newUser: false,
        notRegistered: false,
    });

    const getClients = async () => {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/client/getallclients`);
        if (res.status === 200) {
            setClients(res.data)
            return res.data
        }
    }

    const getChildren = async (client) => {
        const children = []
        for (var child of client.children) {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/client/getchild/${child}`);
            if (res.status === 200) {
                children.push({...res.data, firstName: res.data.firstname})
            }
        }
        setChildren(children)
    }


    useEffect(() => {
        if (localStorage.getItem('token') === null) {
            navigate('/login')
        }
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/service/getallservices`);
                setOptions(response.data);
            } catch (error) {
                console.error('Error fetching appointments:', error.message);
            }
        }
        fetchAppointments();
    }, [])

    const findColor = (category) => {
        if (category == "Group Plush") return 'blue-400'
        if (category == "Për Fëmijë") return 'yellow-400'
        if (category == "Për Bebe") return 'green-600'
        if (category == "Për Nënen") return 'purple-600'
        if (category == "Mami + Bebi") return 'red-600'
    }

    const findBackgroundColor = async (category) => {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/service/getallservices`);
        if (response.status === 200) {
            const option = response.data.find(option => option.name === category)
            console.log(option.onlyParent?'bg-[#e2a6e6]':option.child?'bg-[#FFBF69]':option.baby?'bg-[#6cd5cb]':'bg-white')
            return option.onlyParent?'bg-[#e2a6e6]':option.child?'bg-[#FFBF69]':option.baby?'bg-[#6cd5cb]':'bg-white'
        }
    }

    const getAppointmentsDurationAtTime = (employee, time) => {
        var duration = 0;
        for (let appointment of appointments) {
            if (appointment.time === time && appointment.employee === employee) {
                duration += appointment.duration;
            }
        }
        return duration;
    }

    const findFreeEmployee = (time) => {
        for (let employee of employees) {
            if (appointment.duration + getAppointmentsDurationAtTime(employee.name, time) <= 60) {
                return employee.name;
            }
        }
        return employees[0].name;
    }

    const isAvailable = (employee, time) => {
        var available = true;
        for (let appointment of appointments) {
            if (appointment.time === time && appointment.employee === employee) {
                console.log('here')
                if (appointment.duration + getAppointmentsDurationAtTime(employee, time) > 60) {
                    available = false;
                    break;
                }
            }
        }
        return available;
    }


    const submitAppointment = async () => {
        const [hours, minutes] = appointment.time.split(':');

        if (hours < 10 || hours > 18) {
            alert('Please select a time between 10:00 and 18:00')
            return;
        }

        var employee = appointment.employee;
        if(employee == undefined){
            employee = findFreeEmployee(`${hours}:00`)
            setAppointment({
                ...appointment,
                employee: employee
            })
        }

        if (!isAvailable(employee, `${hours}:00`)) {
            alert('This time is not available')
            return;
        }

        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/appointment/addappointment`, {
            service: appointment.serviceType,
            date: appointment.date,
            time: `${hours}:00`,
            serviceType: appointment.service,
            duration: appointment.duration,
            employee: employee,
            parent: {
                email: appointment.email,
                firstName: appointment.parentFirstName,
                lastName: appointment.parentLastName,
            },
            child: {
                firstName: appointment.babyFirstName,
                lastName: appointment.babyLastName,
                birthDate: appointment.babyBirthDate,
                id: children.find(child => child.firstName === appointment.babyFirstName) ? children.find(child => child.firstName === appointment.babyFirstName)._id : '',
            },
            contactNumber: appointment.contactNumber,
            showHistory: !showParentInput,
        });
        if (res.status === 200) {
            alert('Appointment added successfully')
            closeModal()
            window.location.reload()
        }
        closeModal()
        window.location.reload()
    }

    const getData = async () => {

        const clients = await getClients()
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/employee/getallemployee`);
        if (res.status === 200) {
            setEmployees(res.data)
        }
        const appointmentRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/appointment/getallappointments`);
        if (appointmentRes.status === 200) {
            setAppointments(await Promise.all(appointmentRes.data.map(async appointment => {
                return {
                    id: appointment._id,
                    employee: appointment.employee ? appointment.employee : res.data[0].name,
                    date: new Date(appointment.date),
                    time: appointment.time,
                    service: appointment.service,
                    category: appointment.category,
                    duration: appointment.duration,
                    serviceType: appointment.serviceType,
                    email: appointment.parent.email,
                    parentName: appointment.parent.firstName + ' ' + appointment.parent.lastName,
                    childName: appointment.child.firstName + ' ' + appointment.child.lastName,
                    color: findColor(appointment.serviceType),
                    backgroundColor: await findBackgroundColor(appointment.serviceType),
                    approved: appointment.approved,
                    status: appointment.status,
                    notShow: appointment.notShow,
                    newUser: checkIfNewUser(clients, appointment),
                    notRegistered: checkIfNotRegistered(clients, appointment),
                }
            })))
        }

    }

    const checkIfNotRegistered = (clients,appointment) => {
        const client = clients.find(client => client.email === appointment.parent.email)
        if (!client) {
            return true
        }
        return false
    }

    const checkIfNewUser = (clients,appointment) => {
        const client = clients.find(client => client.email === appointment.parent.email)
        if (client && client.appointments.length === 1) {
            return true
        }
        return false
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
    }, [])

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    useEffect(() => {
        if (localStorage.getItem('token') === null) {
            navigate('/login')
        }
    }, []);
    const updateAppointment = async (appointment) => {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/appointment/editappointment/${appointment.id}`, appointment);
        if (res.status === 200) {
            setAppointments(prevAppointments => prevAppointments.map(app => {
                if (app.id === appointment.id) {
                    return appointment;
                }
                return app;
            }))
            alert('Appointment updated successfully')
        }
    }

    const cancelAppointment = async (appointment) => {
        const res = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/appointment/deleteappointment/${appointment.id}`, appointment);
        if (res.status === 200) {
            setAppointments(prevAppointments => prevAppointments.filter(app => app.id !== appointment.id))
            alert('Appointment deleted successfully')
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
        if (appointmentTemp)
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

    const getGroups = () => {
        const groups = []
        options.forEach(option => {
            if (!groups.includes(option.displayGroup)) {
                groups.push(option.displayGroup)
            }
        })
        return groups
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className='container sm:p-4 p-0 mx-auto mt-32 pl-16 sm:pr-0 pr-1 '>
                {/*change date functionality and next day */}
                <div className='flex items-center justify-between mb-4'>
                    <div
                        className='flex sm:flex-row flex-col sm:items-center items-end justify-end gap-x-5 gap-y-2 w-full'>
                        <select
                            value={selectedEmployee.name}
                            onChange={(e) => setSelectedEmployee(e.target.value)}
                            className="p-2 border rounded"
                        >
                            <option value="">Stafi</option>
                            {employees.map((employee) => (
                                <option key={employee._id} value={employee.name}>
                                    {employee.name}
                                </option>
                            ))}
                        </select>
                        <div className="flex items-center">
                            <button onClick={handlePrevDay} className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300'>
                                <svg className='w-4 h-4 fill-current' viewBox='0 0 20 20'>
                                    <path
                                        d='M12.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L9.414 10l4.293 4.293a1 1 0 010 1.414z'/>
                                </svg>
                            </button>
                            <DatePicker
                                selected={currentDate}
                                onChange={date => setCurrentDate(date)}
                                customInput={<span
                                    className='mx-4 text-gray-700 cursor-pointer'>{formatDate(currentDate)}</span>}
                            />
                            <button onClick={handleNextDay} className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300'>
                                <svg className='w-4 h-4 fill-current' viewBox='0 0 20 20'>
                                    <path
                                        d='M7.707 14.707a1 1 0 01-1.414-1.414L9.586 10 6.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4z'/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="mb-4">
                        <div
                            onClick={(e) => {
                                openModal();
                            }
                            }
                            className='bg-[#128F96] py-2 px-5 rounded-lg'><img src={PlusIcon} className='w-8 h-8'/>
                        </div>
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
                                    <h className="text-2xl self-center font-bold">Detajet e Terminit</h>
                                </div>


                                <form className='w-fit grid grid-cols-2 gap-5 p-5'>
                                    <div className='flex flex-col gap-3'>
                                        <label className='w-[300px]'>Zgjedh Servisin</label>
                                        <select
                                            className='w-[300px] p-2 rounded bg-gray-300'
                                            onChange={(e) => {
                                                handleInputChange('serviceType', e.target.value)
                                                handleInputChange('duration', options.find(option => option.displayGroup === e.target.value).duration)
                                            }}
                                        >
                                            {
                                                getGroups().map((option) => (
                                                    <option value={option} key={option}
                                                    >{option}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className='flex flex-col gap-3'>
                                        <label className='w-[300px]'>Zgjedh tipin e Servisit </label>
                                        <select
                                            className='w-[300px] p-2 rounded bg-gray-300'
                                            onChange={(e) => {
                                                handleInputChange('service', e.target.value)
                                                handleInputChange('duration', options.find(option => option.name === e.target.value).duration)
                                            }}
                                        >
                                            {
                                                options.map((option, index) => (
                                                    option.displayGroup === appointment.serviceType &&
                                                    <option value={option.name} key={index}>{option.name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className='flex flex-col gap-3'>
                                        <label className='w-[300px]'>Zgjedh datën</label>
                                        <input onChange={(e) => handleInputChange('date', e.target.value)}
                                               className='w-[300px] p-2 rounded bg-gray-300' type='date'></input>
                                    </div>
                                    <div className='flex flex-col gap-3'>
                                        <label className='w-[300px]'>Zgjedh kohën</label>
                                        <input onChange={(e) => handleInputChange('time', e.target.value)}
                                               className='w-[300px] p-2 rounded bg-gray-300' type='time'></input>
                                    </div>
                                    {!showParentInput && <div className='flex flex-col gap-3'>
                                        <label className='w-[300px]'>Emri i prindit</label>
                                        <div className='flex gap-1'>
                                            <select className='w-[300px] p-2 rounded bg-gray-300'
                                                    onChange={async (e) => {
                                                        setAppointment({
                                                            ...appointment,
                                                            parentFirstName: e.target.value,
                                                            parentLastName: clients.find(client => client.firstName === e.target.value).lastName,
                                                            contactNumber: clients.find(client => client.firstName === e.target.value).contactNumber,
                                                            email: clients.find(client => client.firstName === e.target.value).email
                                                        })
                                                        await getChildren(clients.find(client => client.firstName === e.target.value))
                                                    }}>
                                                <option value="">Zgjedh Prindin</option>
                                                {
                                                    clients.map((client, index) => (
                                                        <option value={client.firstName}
                                                                key={index}>{client.firstName}</option>
                                                    ))
                                                }
                                            </select>
                                            <button
                                                className='rounded p-2 bg-teal-600 text-whtie text-2xl text-white'
                                                onClick={() => setShowParentInput(true)}>+
                                            </button>
                                        </div>

                                    </div>}
                                    {showParentInput && <div className='flex flex-col gap-3'>
                                        <label className='w-[300px]'>Emri i prindit</label>
                                        <div className="flex gap-1">
                                            <input
                                                onChange={(e) => handleInputChange('parentFirstName', e.target.value)}
                                                className='w-[300px] p-2 rounded bg-gray-300' type='text'></input>
                                            <button
                                                type="button"
                                                className='rounded p-2 bg-teal-600 text-whtie text-2xl text-white'
                                                onClick={() => setShowParentInput(false)}>    &lt;
                                            </button>
                                        </div>
                                    </div>}
                                    <div className='flex flex-col gap-3'>
                                        <label className='w-[300px]'>Mbiemri i prinditt</label>
                                        <input value={appointment.parentLastName}
                                               onChange={(e) => handleInputChange('parentLastName', e.target.value)}
                                               className='w-[300px] p-2 rounded bg-gray-300' type='text'></input>
                                    </div>
                                    {!showParentInput && <div className='flex flex-col gap-3'>
                                        <label className='w-[300px]'>Emri i bebes</label>
                                        <select className='w-[300px] p-2 rounded bg-gray-300'
                                                onChange={async (e) => {
                                                    setAppointment({
                                                        ...appointment,
                                                        babyFirstName: e.target.value,
                                                        babyLastName: children.find(child => child.firstName === e.target.value).lastName,
                                                        babyBirthDate: new Date(children.find(child => child.firstName === e.target.value).birthDate).toISOString().split('T')[0]
                                                    })
                                                    console.log(children.find(child => child.firstName === e.target.value).birthDate)
                                                }}>
                                            <option value="">Zgjedh Beben</option>
                                            {
                                                children.map((child, index) => (
                                                    <option value={child.firstName}
                                                            key={index}>{child.firstName}</option>
                                                ))
                                            }
                                        </select>
                                    </div>}
                                    {showParentInput && <div className='flex flex-col gap-3'>
                                        <label className='w-[300px]'>Emri i bebes</label>
                                        <input onChange={(e) => handleInputChange('babyFirstName', e.target.value)}
                                               className='w-[300px] p-2 rounded bg-gray-300' type='text'></input>
                                    </div>}
                                    <div className='flex flex-col gap-3'>
                                        <label className='w-[300px]'>Mbiemri i bebes</label>
                                        <input value={appointment.babyLastName ? appointment.babyLastName : ''}
                                               onChange={(e) => handleInputChange('babyLastName', e.target.value)}
                                               className='w-[300px] p-2 rounded bg-gray-300' type='text'></input>
                                    </div>
                                    <div className='flex flex-col gap-3'>
                                        <label className='w-[300px]'>Data e lindjes së bebes</label>
                                        <input value={appointment.babyBirthDate ?? appointment.babyBirthDate}
                                               onChange={(e) => handleInputChange('babyBirthDate', e.target.value)}
                                               className='w-[300px] p-2 rounded bg-gray-300' type='date'></input>
                                    </div>
                                    <div className='flex flex-col gap-3'>
                                        <label className='w-[300px]'>Numri Kontaktues</label>
                                        <input value={appointment.contactNumber ?? appointment.contactNumber}
                                               onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                                               className='w-[300px] p-2 rounded bg-gray-300' type='text'></input>
                                    </div>
                                    <div className='flex flex-col gap-3'>
                                        <label className='w-[300px]'>E-mail</label>
                                        <input value={appointment.email ?? appointment.email}
                                               onChange={(e) => handleInputChange('email', e.target.value)}
                                               className='w-[300px] p-2 rounded bg-gray-300' type='email'></input>
                                    </div>
                                    <div>&nbsp;</div>
                                    <div>&nbsp;</div>
                                    <button onClick={submitAppointment}
                                            className='w-[300px] p-2 rounded bg-[#128F96] text-white font-bold'
                                            type="button">Rezervo
                                    </button>
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
                                        .filter(app => (selectedEmployee === '' || app.employee === selectedEmployee) && app.employee === employee.name && compareTimes(app.time, time) === 0 && new Date(currentDate).toLocaleDateString() === new Date(app.date).toLocaleDateString())
                                        .map(app => (
                                            <DraggableAppointment key={app.id} appointment={app}
                                                                  updateAppointment={updateAppointment}
                                                                  cancelAppointment={cancelAppointment}/>
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

function DraggableAppointment({appointment, updateAppointment, cancelAppointment}) {
    const [, drag] = useDrag(() => ({
        type: ItemTypes.APPOINTMENT,
        item: {id: appointment.id},
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));


    return (
        <div ref={drag}
             className={`cursor-move grid grid-cols-2  drop-shadow-lg p-2 m-2 max-w-[500px]  border-l-4 border-${appointment.color}
                 
                ${appointment.notShow ? 'bg-red-300' : appointment.backgroundColor}
        `}>
            <p className="col-span-1">Koha: {appointment.time}</p>
            <p className="col-span-1">Data: {appointment.date.toLocaleDateString()}</p>
            <p className="col-span-1">Shërbimi: {appointment.serviceType}</p>
            <p className="col-span-1">Kategoria: {appointment.service}</p>
            <p className="col-span-1">Prindi: {appointment.parentName}</p>
            <p className="col-span-1">Fëmiju: {appointment.childName}</p>
            <div className='flex gap-2 min-w-max py-2'>
                {appointment.newUser && <p className="col-span-2 bg-blue-200 text-blue-500 rounded px-2 ">New Client</p>}
                {appointment.notRegistered && <p className="col-span-2 bg-red-200 text-red-500 rounded px-2 ">Not Registered</p>}
            </div>
            <div className='flex flex-row justify-between w-full col-span-2'>
                <button onClick={() => {
                    appointment.approved = true
                    updateAppointment(appointment)
                }} disabled={appointment.approved || appointment.notShow}
                        className={` bg-blue-500 disabled:bg-gray-400 text-white rounded-md p-2 w-[32%]`}>{
                    appointment.approved ? 'Aprovuar' : 'Aprovo'
                }</button>

                <button onClick={() => {
                    console.log(appointment.notShow)
                    appointment.notShow = !appointment.notShow
                    updateAppointment(appointment)
                }} className={` bg-red-600 disabled:bg-gray-400 text-white rounded-md p-2 w-[32%]
                `}>{
                    appointment.notShow == true ? 'show' : 'not show'
                }</button>

                <button onClick={() => {
                    appointment.approved = false
                    cancelAppointment(appointment)
                }} className={` bg-purple-700 disabled:bg-gray-400 text-white rounded-md p-2 w-[32%]
                `}>Fshij
                </button>
            </div>

        </div>
    );
}

export default Calendar;
