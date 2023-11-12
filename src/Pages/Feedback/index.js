import React, { useState } from 'react';
import NavBar from '../../Components/navbar';
import Sidebar from '../../Components/sidebar';
import AddBlogs from '../../resources/addBlogs.png';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { TextField, Button } from '@mui/material';
import { useRef } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import AWS from 'aws-sdk';
import addPhoto from '../../resources/addphoto.png'
import maleIcon from '../../resources/male.png'
import femaleIcon from '../../resources/female.png'

const Feedback = () => {

    const feedbacks = [
        {
            email: 'abc@gmail.com',
            gender: 'male',
            age: 12,
            buy: 'PO',
            feedback1: 2,
            feedback2: 4,
            feedback3: 2,
            feedback4: 1,
            feedback5: 5,
            descrption1: 'cernfuiervube vieuwbc eriubv eriucbiwq biewqf owq efwq ciewc eci e ciq cew qcuwebqc weubcwe ci rci w qciew qc we cwe ck qc  ubqwefbewqfb bqcwu weq i  ibwebiwefiwfqwefi wqoefnno wqeofwe',
            descrption2: 'cernfuiervube vieuwbc eriubv eriucbiwq',
            service: '1',
            source: 'Facebook'
        },
        {
            email: 'abc@gmail.com',
            gender: 'female',
            age: 12,
            buy: 'PO',
            feedback1: 2,
            feedback2: 4,
            feedback3: 2,
            feedback4: 1,
            feedback5: 5,
            descrption1: 'cernfuiervube vieuwbc eriubv eriucbiwq',
            descrption2: 'cernfuiervube vieuwbc eriubv eriucbiwq',
            service: '1',
            source: 'Mjeku im / Pediatri i bebes'
        },
        {
            email: 'abc@gmail.com',
            gender: 'male',
            age: 12,
            buy: 'PO',
            feedback1: 2,
            feedback2: 4,
            feedback3: 2,
            feedback4: 1,
            feedback5: 5,
            descrption1: 'cernfuiervube vieuwbc eriubv eriucbiwq',
            descrption2: 'cernfuiervube vieuwbc eriubv eriucbiwq',
            service: '1',
            source: 'Instagram'
        },
        {
            email: 'abc@gmail.com',
            gender: 'female',
            age: 12,
            buy: 'PO',
            feedback1: 2,
            feedback2: 4,
            feedback3: 2,
            feedback4: 1,
            feedback5: 5,
            descrption1: 'cernfuiervube vieuwbc eriubv eriucbiwq',
            descrption2: 'cernfuiervube vieuwbc eriubv eriucbiwq',
            service: '1',
            source: 'Miget'
        }
    ]

    const [divStates, setDivStates] = useState(Array(feedbacks.length).fill(false));

    const toggleDiv = (index) => {
        const newDivStates = [...divStates];
        newDivStates[index] = !newDivStates[index];
        setDivStates(newDivStates);
      };

    const ratings = ['1', '2', '3', '4', '5'];

return(
    <div className='flex h-screen bg-gray-100'>
        <div className='flex flex-col w-full overflow-auto'>
            <div className="flex items-center bg-white self-center justify-center align-middle w-[80%] ml-16 mt-32 rounded-xl p-10 px-20">
                <div className="w-full flex flex-col">
                    <div className="flex flex-row justify-between border-gray-500 border-b-2 pb-10">
                        <span className="text-4xl font-bold">VLERSIMET</span>
                        <div className='flex flex-row gap-10'>
                            <div className='rounded-lg border border-gray-200 p-3 px-7 font-bold text-xl'>Aktiviteti Sot</div>
                            <div className='rounded-lg shadow-lg p-3 px-7 font-bold text-xl'>Aktiviteti Sot</div>
                        </div>
                    </div>

                    {feedbacks.map((feedback, index) => 
                    <div className="flex flex-col border-gray-500 border-b-2 pt-5">
                        <div className="flex flex-row justify-between items-center align-middle ">
                            <div className="flex flex-row  items-center align-middle gap-10">
                                <div className='flex flex-col gap-2'>
                                    <label className='text-[#128F96]'>Email</label>
                                    <input readOnly className='border border-gray-200 shadow-lg p-3 text-sm w-[250px] rounded-lg' value={feedback.email} />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-[#128F96]'>Mosha</label>
                                    <input readOnly className='border border-gray-200 shadow-lg p-3 text-sm w-[50px] rounded-lg' value={feedback.age} />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-[#128F96]'>Gjinia</label>
                                    <div className={`p-[11px] bg-[#128F96] rounded-lg flex items-center justify-center
                                        ${
                                            feedback.gender == 'male'
                                            ? 'block'
                                            : 'hidden'
                                        }
                                    `}><img src={maleIcon} className='w-[25px] h-[25px]' /></div>
                                    <div className={`p-[11px] bg-pink-600 rounded-lg flex items-center justify-center
                                        ${
                                            feedback.gender == 'female'
                                            ? 'block'
                                            : 'hidden'
                                        }
                                    `}><img src={femaleIcon} className='w-[25px] h-[25px]' /></div>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-[#128F96]'>Shërbimi</label>
                                    <div className={`p-2 bg-[#128F96] text-white w-[250px] rounded-lg`}>{feedback.service}</div>
                                </div>
                                <div className='flex flex-col gap-[4px] items-center justify-center text-center'>
                                    <label className='text-[#128F96] text-xs w-[120px]'>A keni blerë produkte të vimeas</label>
                                    <div className={`p-2 bg-[#128F96] text-white rounded-lg w-[50px] flex items-center justify-center`}><span>{feedback.buy}</span></div>
                                </div>
                            </div>
                            {
                                divStates[index]
                                ? <button onClick={() => toggleDiv(index)} className="bg-[#128F96] text-white rounded-full px-3 py-2 md:px-10 md:py-3">Close</button>
                                : <div><button onClick={() => toggleDiv(index)} className="md:block hidden bg-[#128F96] text-white rounded-full px-3 py-2 md:px-10 md:py-3">Tap to view</button>
                                <button onClick={() => toggleDiv(index)} className="md:hidden block bg-[#128F96] text-white rounded-full px-3 py-2 md:px-10 md:py-3">View</button>
                                </div>
                                
                            }
                            
                        </div>
                        <div
                            className={`flex flex-col gap-10 justify-between pb-6 px-10 transition-all duration-500 max-h-0 overflow-hidden ${
                                divStates[index] ? "max-h-[1000px]" : "max-h-0"
                            }`}
                        >
                            <div className='py-5'></div>
                            <div className="flex flex-row gap-10 justify-between items-baseline">
                                <div className="w-[300px]">
                                    <label className="text-[#128F96]">1.Sa jeni të kënaqur me përvojën në VIMEA?</label>
                                    <div className="flex items-center justify-center w-full">
                                        <div className="py-3 w-full px-5 flex  flex-col">
                                            <div className="flex justify-between w-full px-[10px] mb-2">
                                                {ratings.map((rating, index) => (
                                                    <span
                                                        key={index}
                                                        className={`cursor-pointer text-[#128F96] ${feedback.feedback1 - 1 === index ? 'opacity-100 font-bold' : 'opacity-100'}`}
                                                    >
                                                    {rating}
                                                </span>
                                                ))}
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="4"
                                                readOnly
                                                name="experience"
                                                value={feedback.feedback1 - 1}
                                                className="w-full .range-input" // Set background color to gray
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-[300px]">
                                    <label className="text-[#128F96] w-full text-justify">2. Sa jeni të kënaqur me benefitet që ka pranuar bebi juaj gjatë vizitave në VIMEA?</label>
                                    <div className="flex items-center justify-center w-full">
                                        <div className="py-3 w-full px-5 flex  flex-col">
                                            <div className="flex justify-between w-full px-[10px] mb-2">
                                                {ratings.map((rating, index) => (
                                                    <span
                                                        key={index}
                                                        className={`cursor-pointer text-[#128F96] ${feedback.feedback2 - 1 === index ? 'opacity-100 font-bold' : 'opacity-100'}`}
                                                    >
                                                    {rating}
                                                </span>
                                                ))}
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="4"
                                                readOnly
                                                name="experience"
                                                value={feedback.feedback2 - 1}
                                                className="w-full .range-input" // Set background color to gray
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-[300px]">
                                    <label className="text-[#128F96] w-full text-justify">3. Si i vlerësoni çmimet e shërbimeve?</label>
                                    <div className="flex items-center justify-center w-full">
                                        <div className="py-3 w-full px-5 flex  flex-col">
                                            <div className="flex justify-between w-full px-[10px] mb-2">
                                                {ratings.map((rating, index) => (
                                                    <span
                                                        key={index}
                                                        className={`cursor-pointer text-[#128F96] ${feedback.feedback3 - 1 === index ? 'opacity-100 font-bold' : 'opacity-100'}`}
                                                    >
                                                    {rating}
                                                </span>
                                                ))}
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="4"
                                                readOnly
                                                name="experience"
                                                value={feedback.feedback3 - 1}
                                                className="w-full .range-input" // Set background color to gray
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row gap-5 justify-between items-baseline">
                                <div className="w-[300px]">
                                    <label className="text-[#128F96]">4.Sa jeni të kënaqur me procesin e realizimit të terminave në VIMEA?</label>
                                    <div className="flex items-center justify-center w-full">
                                        <div className="py-3 w-full px-5 flex  flex-col">
                                            <div className="flex justify-between w-full px-[10px] mb-2">
                                                {ratings.map((rating, index) => (
                                                    <span
                                                        key={index}
                                                        className={`cursor-pointer text-[#128F96] ${feedback.feedback4 - 1 === index ? 'opacity-100 font-bold' : 'opacity-100'}`}
                                                    >
                                                    {rating}
                                                </span>
                                                ))}
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="4"
                                                readOnly
                                                name="experience"
                                                value={feedback.feedback4 - 1}
                                                className="w-full .range-input" // Set background color to gray
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='w-[350px] flex flex-col gap-2'>
                                    <label className="text-[#128F96]">4.Sa jeni të kënaqur me procesin e realizimit të terminave në VIMEA?</label>
                                    <textarea readOnly value={feedback.descrption1} className='rounded border h-[80px] border-gray-400 px-2 overflow-y-hidden'></textarea>
                                </div>
                                <div className='w-[350px] flex flex-col gap-2'>
                                    <label className="text-[#128F96]">6. A keni ndonjë sugjerim/ këshillë për ne që do ta përmirësonte përvojën tuaj në të ardhmën?</label>
                                    <textarea readOnly value={feedback.descrption2} className='rounded border h-[80px] border-gray-400 px-2 overflow-y-hidden'></textarea>
                                </div>
                            </div>
                            <div className="flex flex-row gap-10 justify-between items-baseline">
                                <div className="w-[300px]">
                                    <label className="text-[#128F96]">7.Sa janë gjasat që do të rekomandoni VIMEA të miqët tuaj?</label>
                                    <div className="flex items-center justify-center w-full">
                                        <div className="py-3 w-full px-5 flex  flex-col">
                                            <div className="flex justify-between w-full px-[10px] mb-2">
                                                {ratings.map((rating, index) => (
                                                    <span
                                                        key={index}
                                                        className={`cursor-pointer text-[#128F96] ${feedback.feedback5 - 1 === index ? 'opacity-100 font-bold' : 'opacity-100'}`}
                                                    >
                                                    {rating}
                                                </span>
                                                ))}
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="4"
                                                readOnly
                                                name="experience"
                                                value={feedback.feedback5 - 1}
                                                className="w-full .range-input" // Set background color to gray
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-[400px]">
                                    <label>8. Nga cili burim keni mësuar për VIMEA?</label>
                                    <div className="grid grid-cols-2 gap-2 w-[400px]">
                                        <div className={`p-1 rounded-lg border font-bold shadow-md cursor-pointer ${feedback.source === 'Facebook' ? 'bg-[#128F96] border-white text-white font-bold' : 'bg-white border-[#105955]  text-[#105955]'}`}>Facebook</div>
                                        <div className={`p-1 rounded-lg border font-bold shadow-md cursor-pointer  ${feedback.source === 'Instagram' ? 'bg-[#128F96] border-white text-white font-bold' : 'bg-white border-[#105955] text-[#105955]'}`}>Instagram</div>
                                        <div className={`p-1 rounded-lg border font-bold shadow-md cursor-pointer  ${feedback.source === 'Miget' ? 'bg-[#128F96] border-white text-white font-bold' : 'bg-white border-[#105955] text-[#105955]'}`}>Miget</div>
                                        <div className={`p-1 text-xs rounded-lg font-bold border shadow-md cursor-pointer  ${feedback.source==='Mjeku im / Pediatri i bebes'?'bg-[#128F96] border-white text-white font-bold':'bg-white border-[#105955] text-[#105955]'}`}>Mjeku im / Pediatri i bebes</div>
                                        <div className={`p-1 rounded-lg border font-bold shadow-md cursor-pointer  ${feedback.source==='Tjetër'?'bg-[#128F96] border-white text-white font-bold':'bg-white border-[#105955] text-[#105955]'}`}>Tjetër</div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-bold">PAYMENT DETAILS</span>
                                <div className="flex flex-row text-xs gap-5 p-3 border-2 border-gray-300 rounded-lg">
                                    <div className="flex flex-col">
                                        <span>Card:</span>
                                        <span>Date of transaction:</span>
                                        <span>Aprovation code:</span>
                                    </div>
                                    <div className="flex flex-col">
                                    </div>
                                </div>  
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-bold">Billing Adress</span>
                                <div className="flex flex-row text-xs gap-5 p-3 border-2 border-gray-300 rounded-lg">
                                    <div className="flex flex-col">
                                        <span>Adress:</span>
                                        <span>City:</span>
                                        <span>State:</span>
                                        <span>Postal code:</span>
                                    </div>
                                    <div className="flex flex-col">

                                    </div>
                                </div>  
                            </div>
                        </div>
                    </div>

                    )}
                    
                </div>
                <div className="absolute right-0 bottom-0 -z-50">
                    <img src="/team-bg.png" className="w-[600px]" alt="Team bg" />
                </div>
            </div>

        </div>
    </div>
)
}

export default Feedback;