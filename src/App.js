import React, {useEffect, useState} from 'react';
import './App.css';
import NavBar from './Components/navbar';
import SideBar from './Components/sidebar';
import Products from './Pages/Product/index';
import AddProduct from './Pages/Product/addproduct';
import Blogs from './Pages/Blogs/index';
import AddBlogs from './Pages/Blogs/addblogs';
import AddClient from './Pages/Client/addClient';
import EditClient from './Pages/Client/editClient';
import Clients from './Pages/Client/index';
import Feedback from './Pages/Feedback/index';
import Employees from './Pages/Employees/index';
import AddEmployee from './Pages/Employees/addEmployee';
import EditEmployee from './Pages/Employees/editEmployee';
import Orders from './Pages/orders/index';
import Login from './Pages/Login/index'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Appointments from "./Pages/Appointments";
import Calendar from "./Pages/Calendar";
import Dashboard from "./Pages/DashBoard";
import {Details} from "@mui/icons-material";
import {AddAppointment} from "./Pages/Appointments/addAppointment";
import {EditAppointment} from "./Pages/Appointments/editAppointment";

function App() {


    return (<Router>
        <SideBar/>
        <NavBar/>
        <Routes>
            <Route path="/home" element={<Dashboard/>}/>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/signin" element={<Login/>}/>
            <Route path="/products" element={
                <Products/>
            }/>
            <Route path="/products/add" element={<AddProduct/>}/>
            <Route path="/blogs" element={<Blogs/>}/>
            <Route path="/blogs/add" element={<AddBlogs/>}/>
            <Route path="/clients" element={<Clients/>}/>
            <Route path="/clients/add" element={<AddClient/>}/>
            <Route path="/clients/edit/:id" element={<EditClient/>}/>
            <Route path="/feedbacks" element={<Feedback/>}/>
            <Route path="/orders" element={<Orders/>}/>
            {/*<Route path="/payments" element={<Payments/>}/>*/}
            <Route path="/employees" element={<Employees/>}/>
            <Route path="/employees/add" element={<AddEmployee/>}/>
            <Route path="/employees/edit/:id" element={<EditEmployee/>}/>
            <Route path="/appointments" element={<Appointments/>}/>
            <Route path="/appointments/add" element={<AddAppointment/>}/>
            <Route path="/appointments/edit/:id" element={<EditAppointment/>}/>
            <Route path="/calendar" element={<Calendar/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/view/:id" element={<Details/>}/>
        </Routes>
    </Router>);
}

export default App;
