import React from 'react';
import logo from './logo.svg';
import './App.css';
import Products from './Pages/Product/index';
import AddProduct from './Pages/Product/addproduct';
import Blogs from './Pages/Blogs/index';
import AddBlogs from './Pages/Blogs/addblogs';
import AddClient from './Pages/Client/addClient';
import Clients from './Pages/Client/index';
import Home from './Pages/Home/index';
import Feedback from './Pages/Feedback/index';
import Payments from './Pages/Payments/index';
import Employees from './Pages/Employees/index';
import AddEmployee from './Pages/Employees/addEmployee';
import Orders from './Pages/orders/index';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Sample from './Components/sample';


function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
          <Route path="/products/add" element={<AddProduct/>}/>
        <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/add" element={<AddBlogs />} />
        <Route path="/clients" element={<Clients />} />
            <Route path="/clients/add" element={<AddClient />} />
        <Route path="/feedbacks" element={<Feedback />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/employees" element={<Employees />} />
            <Route path="/employees/add" element={<AddEmployee />} />
        {/* <Route path="/login" element={<Login />} />
        <Route path="/view/:id" element={<Details />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
