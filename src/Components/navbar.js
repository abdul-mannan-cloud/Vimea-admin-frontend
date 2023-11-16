import React from 'react';
import logo from '../resources/VIMEA.png'
import bellIcon from '../resources/bell.png'
import profile from '../resources/profile.png'
import arrow from '../resources/arrow.png'
import { Container, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

const NavBar = () => {
    const login = false;
return (
<div className='fixed top-0 left-0 flex flex-row justify-between w-screen gap-20 p-2 bg-white'>
    <div className=''>
        <img
            src={logo}
            width="50"
            height="50"
            alt="Logo"
        />   
    </div>  
    <div className='flex flex-row gap-10'>
        <div className='mt-1 rounded-lg'> 
                <TextField 
                    id="search"
                    type="search"
                    label="Kërko"
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
        </div>
        <div className='relative p-3 mt-1'>
            <img
                src={bellIcon}
                width="35"
                height="35"
                alt="Logo"
            />
            <div className='absolute top-1 right-1 rounded-full bg-white w-7 h-7 text-center items-center justify-center p-[2px] z-50'>
                <div className='bg-[#128F96] rounded-full'>
                    <span className='text-white'>1</span>
                </div>
            </div>   
        </div>
        <div>
            {
                login
                ?
                <div>
                    <img src={profile} className='w-[50px] h-[50px]' />
                </div>
                
                :    
                <div className='flex flex-row gap-5 items-center px-5 py-1'>
                    <div className='w-[50px] h-[50px] bg-[#C4C4C4] text-xl text-[#128F96] font-bold text-center items-center rounded-xl py-[10px]'><span>DH</span></div>
                    <div className='flex flex-col justify-between py-1 h-[50px]'>
                        <span className='text-md font-bold'>Daim Hoti</span>
                        <span className='text-gray-400 text-xs'>Super Admin</span>
                    </div>
                    <img src={arrow}></img>
                </div>
            }
        </div>   
    </div>  
</div>
);
}

export default NavBar;