import React, {useEffect} from 'react';
import logo from '../resources/VIMEA.png'
import bellIcon from '../resources/bell.png'
import profile from '../resources/profile.png'
import arrow from '../resources/arrow.png'
import { Container, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

const NavBar = () => {
    const login = false;
    const [name, setName] = useState(null);
    const [role, setRole] = useState(null);
    const [dropdown, setDropdown] = useState(false);


    useEffect(() => {
        setName(localStorage.getItem('name'));
        setRole(localStorage.getItem('role'));
    }, []);

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
                        <span className='text-md font-bold'>{name?name:"Not Signed in"}</span>
                        <span className='text-gray-400 text-xs'>{role?role:''}</span>
                    </div>
                    <div className="flex flex-col">
                        <button onClick={()=>setDropdown(!dropdown)}><img src={arrow}></img></button>
                        {dropdown && <div className="absolute mt-10 right-10 w-40 shadow-lg bg-white flex flex-col gap-2">
                            <div className="flex flex-row items-center gap-2 p-2">
                                <img src={profile} className='w-[50px] h-[50px]'/>
                                <div className='flex flex-col justify-between py-1 h-[50px]'>
                                    <span className='text-md font-bold'>{name ? name : "Not Signed in"}</span>
                                    <span className='text-gray-400 text-xs'>{role ? role : ''}</span>
                                </div>
                            </div>
                            <div className="border-b-2 border-gray-300"></div>
                            <div className="flex flex-col gap-2 p-2">
                                <span className='text-md font-bold'>Settings</span>
                                <span className='text-md font-bold'>Logout</span>
                            </div>
                        </div>}
                    </div>
                </div>
            }
        </div>   
    </div>  
</div>
);
}

export default NavBar;