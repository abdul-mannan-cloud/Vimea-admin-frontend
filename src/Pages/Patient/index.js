import React from 'react';
import NavBar from '../../Components/navbar';
import Sidebar from '../../Components/sidebar';
import './Patients.css'; // Import the CSS file
import { TextField, Button } from '@mui/material';
import { useState } from 'react';

const Patients = () => {
  const patients = [
    { id: 1, name: 'John Doe', age: 30, gender: 'Male' },
    { id: 2, name: 'Jane Smith', age: 25, gender: 'Female' },
    { id: 3, name: 'Bob Johnson', age: 45, gender: 'Male' },
  ];

  return (
    <div className='patient-container'>
      <div className='sidebar'>{/* Sidebar component */}</div>
      <div className='main-content'>
        <NavBar />
        <div className='patient-list'>
          <h1>List of Patients</h1>
          {patients.map((patient) => (
            <div key={patient.id} className='patient-item'>
              <h2>Name: {patient.name}</h2>
              <p>Age: {patient.age}</p>
              <p>Gender: {patient.gender}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Patients;
