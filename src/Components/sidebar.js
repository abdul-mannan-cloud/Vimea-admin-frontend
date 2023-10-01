import React from 'react';
// import your images
import img1 from '../resources/1.png';
import img2 from '../resources/2.png';
import img3 from '../resources/3.png';
import img4 from '../resources/4.png';
import img5 from '../resources/5.png';
import img6 from '../resources/6.png';
import img7 from '../resources/7.png';
import img8 from '../resources/8.png';
import img9 from '../resources/9.png';
import img10 from '../resources/10.png';

const Sidebar = () => {
  return (
    <div className='flex flex-col  items-start pl-6 pt-40 pr-6'>
        <img src={img1} className='w-6 h-6 mb-4' alt='Image 1' />
        <img src={img2} className='w-6 h-6 mb-4' alt='Image 2' />
        <img src={img3} className='w-6 h-6 mb-4' alt='Image 3' />
        <img src={img4} className='w-6 h-6 mb-4' alt='Image 4' />
        <img src={img5} className='w-6 h-6 mb-4' alt='Image 5' />
        <img src={img6} className='w-6 h-6 mb-4' alt='Image 6' />
        <img src={img10} className='w-6 h-6 mb-4' alt='Image 10' />
        <img src={img7} className='w-6 h-6 mb-4' alt='Image 7' />
        <img src={img8} className='w-6 h-6 mb-4' alt='Image 8' />
        <img src={img9} className='w-6 h-6 mb-4' alt='Image 9' />
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