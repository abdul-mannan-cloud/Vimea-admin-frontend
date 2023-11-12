import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import your images
import img1 from '../resources/1.png';
import img1b from '../resources/🦆 icon _home_.png';
import img2 from '../resources/2.png';
import img2b from '../resources/Group 18.png';
import img3 from '../resources/3.png';
import img3b from '../resources/🦆 icon _person_.png';
import img4 from '../resources/4.png';
import img4b from '../resources/Bookmark.png';
import img5 from '../resources/5.png';
import img5b from '../resources/People.png';
import img6 from '../resources/6.png';
import img6b from '../resources/Layer 56.png';
import img7 from '../resources/7.png';
import img7b from '../resources/Vector1.png';
import img8 from '../resources/8.png';
import img8b from '../resources/Online Shopping.png';
import img9 from '../resources/9.png';
import img9b from '../resources/Comments.png';
import img10 from '../resources/10.png';
import img10b from '../resources/Shop.png';

const Sidebar = () => {

  const navigate = useNavigate();
  const [navItem,setNavItem] = useState(1);

  return (
    <div className='flex flex-col  items-start pt-40 bg-white fixed top-0 left-0 h-screen gap-5'>
      <div 
        onClick={() => {
          setNavItem(1)
          navigate('/home')
        }} 
        className='flex flex-row justify-between gap-2 pl-3 items-center align-middle h-8 cursor-pointer'>
        <div className=''></div>
        <img src={navItem == 1 ? img1b : img1} className='w-6 h-6' alt='Image 1' />
        <div className={`border-4 rounded-full w-0 h-full ${navItem == 1 ? 'border-[#128F96]' : 'border-transparent'}`}></div>
      </div>

      <div 
        onClick={() => {
          setNavItem(2)
          navigate('/calendar')
        }}
        className='flex flex-row justify-between gap-2 pl-3 items-center align-middle h-8 cursor-pointer'>
        <div className=''></div>
        <img src={navItem == 2 ? img2b : img2} className='w-6 h-6' alt='Image 2' />
        <div className={`border-4 rounded-full w-0 h-full ${navItem == 2 ? 'border-[#128F96]' : 'border-transparent'}`}></div>
      </div>

      <div 
        onClick={() => {
          setNavItem(3)
          navigate('/clients')
        }} 
        className='flex flex-row justify-between gap-2 pl-3 items-center align-middle h-8 cursor-pointer'>
        <div className=''></div>
        <img src={navItem == 3 ? img3b : img3} className='w-6 h-6' alt='Image 3' />
        <div className={`border-4 rounded-full w-0 h-full ${navItem == 3 ? 'border-[#128F96]' : 'border-transparent'}`}></div>
      </div>

      <div 
        onClick={() => {
          setNavItem(4)
          navigate('/appointments')
          }} 
        className='flex flex-row justify-between gap-2 pl-3 items-center align-middle h-8 cursor-pointer'>
        <div className=''></div>
        <img src={navItem == 4 ? img4b : img4} className='w-6 h-6' alt='Image 4' />
        <div className={`border-4 rounded-full w-0 h-full ${navItem == 4 ? 'border-[#128F96]' : 'border-transparent'}`}></div>
      </div>

      <div 
        onClick={() => {
          setNavItem(5)
          navigate('/employees')
          }} 
        className='flex flex-row justify-between gap-2 pl-3 items-center align-middle h-8 cursor-pointer'>
        <div className=''></div>
        <img src={navItem == 5 ? img5b : img5} className='w-6 h-6' alt='Image 5' />
        <div className={`border-4 rounded-full w-0 h-full ${navItem == 5 ? 'border-[#128F96]' : 'border-transparent'}`}></div>
      </div>

      <div 
        onClick={() => {
          setNavItem(6)
          navigate('/blogs')
          }} 
        className='flex flex-row justify-between gap-2 pl-3 items-center align-middle h-8 cursor-pointer'>
        <div className=''></div>
        <img src={navItem == 6 ? img6b : img6} className='w-6 h-6' alt='Image 6' />
        <div className={`border-4 rounded-full w-0 h-full ${navItem == 6 ? 'border-[#128F96]' : 'border-transparent'}`}></div>
      </div>

      <div 
        onClick={() => {
          setNavItem(10)
          navigate('/products')
          }} 
        className='flex flex-row justify-between gap-2 pl-3 items-center align-middle h-8 cursor-pointer'>
        <div className=''></div>
        <img src={navItem == 10 ? img10b : img10} className='w-6 h-6' alt='Image 10' />
        <div className={`border-4 rounded-full w-0 h-full ${navItem == 10 ? 'border-[#128F96]' : 'border-transparent'}`}></div>
      </div>
      <div 
        onClick={() => {
          setNavItem(7)
          navigate('/payments')
          }} 
          className='flex flex-row justify-between gap-2 pl-3 items-center align-middle h-8 cursor-pointer'>
        <div className=''></div>
        <img src={navItem == 7 ? img7b : img7} className='w-6 h-6' alt='Image 7' />
        <div className={`border-4 rounded-full w-0 h-full ${navItem == 7 ? 'border-[#128F96]' : 'border-transparent'}`}></div>
      </div>

      <div 
        onClick={() => {
          setNavItem(8)
          navigate('/orders')
          }} 
        className='flex flex-row justify-between gap-2 pl-3 items-center align-middle h-8 cursor-pointer'>
        <div className=''></div>
        <img src={navItem == 8 ? img8b : img8} className='w-6 h-6' alt='Image 8' />
        <div className={`border-4 rounded-full w-0 h-full ${navItem == 8 ? 'border-[#128F96]' : 'border-transparent'}`}></div>
      </div>

      <div 
        	onClick={() => {
            setNavItem(9)
            navigate('/feedbacks')
            }} 
          className='flex flex-row justify-between gap-2 pl-3 items-center align-middle h-8 cursor-pointer'>
        <div className=''></div>
        <img src={navItem == 9 ? img9b : img9} className='w-6 h-6' alt='Image 9' />
        <div className={`border-4 rounded-full w-0 h-full ${navItem == 9 ? 'border-[#128F96]' : 'border-transparent'}`}></div>
      </div>
    </div>
    
  );
}

export default Sidebar;

       {/* <Sidebar collapsed={true}>
  <Menu>
    <SubMenu label="Charts">
      <MenuItem>     <img
        src={homeicon}
        width="180"
        height="40"
        alt="Logo"
    />
      </MenuItem>
      <MenuItem> Line charts </MenuItem>
    </SubMenu>
    <MenuItem> Documentation </MenuItem>
    <MenuItem> Calendar </MenuItem>
  </Menu>
</Sidebar> */}











