import React from 'react';
import logo from './logo.svg';
import './App.css';
import Products from './Pages/Product/index';
import AddProduct from './Pages/Product/addproduct';
import Home from './Pages/Home/index';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
          <Route path="/products/add" element={<AddProduct/>}/>
        {/* <Route path="/login" element={<Login />} />
        <Route path="/view/:id" element={<Details />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
