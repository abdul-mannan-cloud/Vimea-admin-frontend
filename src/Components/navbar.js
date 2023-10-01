import React from 'react';
import logo from '../resources/VIMEA.png'
import notification from '../resources/notification.png'
import profile from '../resources/profile.png'
import { Container, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

const NavBar = () => {
return (
<div className='flex items-center '>
    <div className='flex justify-start p-6 pr-96'>
    <img
        src={logo}
        width="70"
        height="70"
        alt="Logo"
    />   
    </div>  
<div className='flex rounded-lg pl-96'>
    <Container> 
        <TextField 
        id="search"
        type="search"
        label="Search"
        // value={searchTerm}
        // onChange={handleChange}
        InputProps={{
            endAdornment: (
            <InputAdornment position="start">
                <SearchIcon color=''/>
            </InputAdornment>
            ),
        }}
        />
    </Container>
</div>
<div className='flex p-6 pl-96'>
    <img
        src={notification}
        width="35"
        height="35"
        alt="Logo"
    />   
    </div>  

    <div className='flex p-6'>
    <img
        src={profile}
        width="180"
        height="40"
        alt="Logo"
    />   
    </div>  
</div>
);
}

export default NavBar;