import {useEffect, useState} from "react";
import emailIcon from '../../resources/EOS_EMAIL_FILLED.png';
import lockIcon from '../../resources/EOS_LOCK_OPEN_OUTLINED.png';
import eyeIcon from '../../resources/eye_icon.png'

export default function Login () {

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);


    
  return (
    <div>
        <div className="flex items-center justify-center w-full p-5 py-40 align-middle md:py-0 md:h-screen md:p-24 md:gap-32">
            <div className="flex flex-wrap bg-gray-100 items-center justify-center w-full gap-10 align-middle md:h-screen">
                <form className="flex flex-col bg-white w-full gap-3 rounded md:border-2 md:p-10 md:w-4/12 h-fit md:border-[#128F96]">
                    <label className="flex gap-3"><img src={emailIcon} className="w-5 h-5"/>Email Adresa</label>
                    <input onChange={e=>setEmail(e.target.value)} type="text" className="w-full p-1 border-2 border-gray-500 rounded-lg"></input>
                    <label  className="flex gap-3"><img src={lockIcon} className="w-5 h-5"/>Fjalëkalimi</label>
                    <div className="relative">
                    <input onChange={e=>setPassword(e.target.value)} type={isPasswordVisible ? 'text' : 'password'} className="w-full p-1 border-2 border-gray-500 rounded-lg"></input>
                    <img src={eyeIcon} onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer"/>
            </div>
                    
                    <div className="flex justify-between my-2">
                        <div className="flex gap-3">
                            <input type="checkbox"></input>
                            <span>Më kujto</span>
                        </div>

                    {/*<Link href="/passwordreset">
                        <span className="font-bold text-[#128F96]">Keni harruar fjalëkalimin ?</span>
  </Link>*/}
                    </div>
                    <button className="w-full p-3 font-bold text-center text-white rounded-lg bg-[#128F96] hover:bg-cyan-700 duration-300 transition-all">Kyqu</button>
                    {/*<Link href="/signup" className="w-full p-3 font-bold text-center text-white bg-gray-400 rounded-lg hover:bg-gray-500 duration-300 transition-all">Krijo një Llogari</Link>*/}
                </form>
                
            </div>
        </div>
    </div>
   )
}

