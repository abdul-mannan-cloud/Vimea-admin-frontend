import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import maleIcon from '../../resources/male.png'
import femaleIcon from '../../resources/female.png'

const Feedback = () => {

    const [feedbacks, setFeedbacks] = useState([]);
    const [realFeedbacks, setRealFeedbacks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('token') === null){
            navigate('/login')
        }
    }, []);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/feedback/`)
            .then(response => response.json())
            .then(data => {
                setRealFeedbacks(data)
                const newFeedbacks = data.map(item => ({
                    id: item._id,
                    email: item.email,
                    gender: item.gender,
                    age: item.age,
                    buy: item.purchase,
                    feedback1: item.experience,
                    feedback2: item.benefits,
                    feedback3: item.prices,
                    feedback4: item.appointments,
                    feedback5: item.recommendation,
                    descrption1: item.suggestion,
                    descrption2: item.improvement,
                    service: item.service,
                    source: item.source,
                    approved: item.approved
                }));
                setFeedbacks(newFeedbacks);
            })
            .catch(error => console.error('Error:', error));
    }, []); 

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
                                <div className='flex flex-col gap-[4px] items-center justify-center text-center'>
                                    {!feedback.approved && <button  onClick={() => {
                                        let updatedFeedback = realFeedbacks.find(item => item._id === feedback.id);
                                        console.log(updatedFeedback)
                                        fetch(`${process.env.REACT_APP_BACKEND_URL}/feedback`, {
                                            method: 'PUT',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                                            },
                                            body: JSON.stringify({
                                                ...updatedFeedback,
                                                approved: true
                                            })
                                        })
                                            .then(response => response.json())
                                            .then(data => {
                                                //update state
                                                const newFeedbacks = feedbacks.map(item => {
                                                    if (item.id === feedback.id) {
                                                        return {
                                                            ...item,
                                                            approved: true
                                                        }
                                                    }
                                                    return item;
                                                })
                                                setFeedbacks(newFeedbacks);
                                                console.log('Success:', data);
                                            })
                                            .catch((error) => {
                                                console.error('Error:', error);
                                            });
                                    }} className='bg-[#128F96] text-white rounded-lg px-3 py-2 hover:bg-teal-700'>Aprovo</button>}
                                    {feedback.approved && <button onClick={() => {
                                        let updatedFeedback = realFeedbacks.find(item => item._id === feedback.id);
                                        fetch(`${process.env.REACT_APP_BACKEND_URL}/feedback`, {
                                            method: 'PUT',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                                            },
                                            body: JSON.stringify({
                                                ...updatedFeedback,
                                                approved: false
                                            })
                                        })
                                            .then(response => response.json())
                                            .then(data => {
                                                const newFeedbacks = feedbacks.map(item => {
                                                    if (item.id === feedback.id) {
                                                        return {
                                                            ...item,
                                                            approved: false
                                                        }
                                                    }
                                                    return item;
                                                })
                                                setFeedbacks(newFeedbacks);
                                                console.log('Success:', data);
                                            })
                                            .catch((error) => {
                                                console.error('Error:', error);
                                            });
                                    }} className='bg-red-500 text-white rounded-lg px-3 py-2 hover:bg-red-700'>DisApprove</button>}
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
                                                max="5"
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
                                    <label className="text-[#128F96]">5.Sa jeni të kënaqur me procesin e realizimit të terminave në VIMEA?</label>
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