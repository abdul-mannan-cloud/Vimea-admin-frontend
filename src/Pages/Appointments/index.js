import React, {useState, useCallback, useEffect} from 'react';
import {DndProvider, useDrag, useDrop} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const times = ['7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM'];
const employees = ['Employee 1', 'Employee 2', 'Employee 3'];

const initialAppointments = [
    {id: 1, employee: 'Employee 1', date: new Date('2023-11-13'), time: '9 AM', content: 'Meeting'},
    {id: 2, employee: 'Employee 2', date: new Date('2023-11-13'), time: '10 AM', content: 'Meeting'},
    {id: 3, employee: 'Employee 2', date: new Date('2023-11-12'), time: '7 AM', content: 'Meeting'},
];

const ItemTypes = {
    APPOINTMENT: 'appointment',
};

function Appointments() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [appointments, setAppointments] = useState(initialAppointments);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    useEffect(() => {
        console.log(appointments)
        console.log(currentDate)
    });

    const moveAppointment = useCallback((id, newEmployee, newTime, newDate) => {
        setAppointments(prevAppointments => prevAppointments.map(appointment => {
            if (appointment.id === id) {
                return { ...appointment, employee: newEmployee, time: newTime, date: newDate };
            }
            return appointment;
        }));
    }, [setAppointments]);

    const handlePrevDay = () => {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() - 1);
        setCurrentDate(date);
    };

    const handleNextDay = () => {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() + 1);
        setCurrentDate(date);    };

    // const formatDate = (date) => {
    //     return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    // };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className='container mx-auto p-4'>
                <h1 className='text-2xl font-bold mb-4'>Appointments</h1>
                {/*change date functionality and next day */}
                <div className='flex justify-between items-center mb-4'>
                    <div className='flex items-center'>
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
                <table className='table-auto w-full'>
                    <thead className='bg-gray-100'>
                        <tr>
                            <th className='border px-4 py-2'></th>
                            {employees.map((employee) => (
                                <th key={employee} className='border px-4 py-2'>{employee}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                    {times.map((time) => (
                        <tr key={time}>
                            <td className='border px-4 py-2'>{time}</td>
                            {employees.map((employee) => (
                                <DropZone
                                    key={`${employee}-${time}-${currentDate}`}
                                    employee={employee}
                                    time={time}
                                    date={currentDate}
                                    moveAppointment={moveAppointment}
                                >
                                    {appointments
                                        .filter(app => app.employee === employee && app.time === time && new Date(currentDate).toLocaleDateString() === new Date(app.date).toLocaleDateString())
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
        <div ref={drag} className='cursor-move bg-white drop-shadow-lg p-2 m-2'>
            <p>{appointment.time}</p>
            <p>{appointment.date.toLocaleDateString()}</p>
            {appointment.content}
        </div>
    );
}

export default Appointments;
