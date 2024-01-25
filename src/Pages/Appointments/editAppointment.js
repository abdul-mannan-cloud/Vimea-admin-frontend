import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";

export const EditAppointment = () => {

    const {id} = useParams()

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        duration: "",
        group: "",
        displayGroup: "",
        onlyParent: false,
        baby: false,
        child: false,
        displayGroupAlb: "",
    });

    useEffect(() => {
        if(localStorage.getItem('token') === null){
            navigate('/login')
        }
        if(localStorage.getItem('role') !== 'admin'){
            navigate('/employees')
        }
    }, []);

    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            try {
                console.log(id);
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/service/getservice/${id}`);
                setFormData(response.data);
            } catch (error) {
                console.error('Error fetching employee details:', error.message);
            }
        };
        fetchEmployeeDetails();
    }, [id]);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.service === "" || formData.price === "" || formData.duration === "" || formData.group === "") {
            alert("Ju lutem mbushni të gjitha fushat!")
            return;
        }
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/service/editservice/${id}`, formData);
        if (response.status === 200) {
            navigate('/appointments')
        } else {
            alert("Ka ndodhur një gabim!")
        }
    };

    const groups = ["Për Fëmijë", "Për Bebe", "Mami + Bebi", "Group Plush", "Për Nënen"];
   const displayGroups= ["HYDROTHERAPY", "BABY MASSAGE", "PLUSH", "VIP PLUSH", "MOM + BABY","MASSAGE FOR MOTHER"];
    const displayGroupsAlb= ["HIDROTERAPI", "MASAZHA PËR BEBE", "PLUSH", "VIP PLUSH", "MAMI + BEBI","MASAZHË PËR NËNA"];

    return (
        <>   
            <div className="sm:pl-0 pl-16">
            <div className="flex flex-col justify-center items-center min-h-screen">
                <h1 className="sm:text-4xl text-2xl font-bold text-center mt-10 mb-5">Shto një Service</h1>
                <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center">
                    <div className="flex flex-col justify-center items-center">
                        <label htmlFor="name" className="text-xl font-bold">Shërbimi</label>
                        <input value={formData.name} type="text" name="name" id="name"
                               className="border-2 border-black rounded-md p-2"
                               onChange={handleChange}/>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <label htmlFor="price" className="text-xl font-bold">Çmimi</label>
                        <input value={formData.price} type="number" name="price" id="price"
                               className="border-2 border-black rounded-md p-2"
                               onChange={handleChange}/>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <label htmlFor="duration" className="text-xl font-bold">Koha e shërbimit</label>
                        <input value={formData.duration} type="number" name="duration" id="duration"
                               className="border-2 border-black rounded-md p-2"
                               onChange={handleChange}/>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <label htmlFor="category" className="text-xl font-bold">Kategoria</label>
                        <select value={formData.group} name="group" id="group"
                                className="border-2 border-black rounded-md p-2"
                                onChange={handleChange}>
                            <option value="" disabled selected>Zgjidhni një kategori</option>
                            {groups.map((group) => (
                                <option value={group}>{group}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <label htmlFor="displayGroup" className="text-xl font-bold">Kategoria e shfaqur</label>
                        <select value={formData.displayGroup} name="displayGroup" id="displayGroup"
                                className="border-2 border-black rounded-md p-2"
                                onChange={handleChange}>
                            <option value="" disabled selected>Zgjidhni një kategori</option>
                            {displayGroups.map((group) => (
                                <option value={group}>{group}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <label htmlFor="displayGroupAlb" className="text-xl font-bold">Kategoria e shfaqur
                            Albanian</label>
                        <select value={formData.displayGroupAlb} name="displayGroupAlb" id="displayGroupAlb"
                                className="border-2 border-black rounded-md p-2"
                                onChange={handleChange}>
                            <option value="" disabled selected>Zgjidhni një kategori</option>
                            {displayGroupsAlb.map((group) => (
                                <option value={group}>{group}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <label htmlFor="onlyParent" className="text-xl font-bold">Vetëm prind</label>
                        <input checked={formData.onlyParent} type="checkbox" name="onlyParent" id="onlyParent"
                               className="border-2 border-black rounded-md p-2"
                               onChange={e => setFormData({...formData, onlyParent: e.target.checked})}/>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <label htmlFor="baby" className="text-xl font-bold">For Baby</label>
                        <input checked={formData.baby} type="checkbox" name="baby" id="baby"
                               className="border-2 border-black rounded-md p-2"
                               onChange={e => setFormData({...formData, baby: e.target.checked})}/>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <label htmlFor="child" className="text-xl font-bold">For Child</label>
                        <input checked={formData.child} type="checkbox" name="child" id="child"
                               className="border-2 border-black rounded-md p-2"
                               onChange={e => setFormData({...formData, child: e.target.checked})}/>
                    </div>
                    <button type="submit" className="border-2 border-black rounded-md p-2 mt-5">Shto Service</button>
                </form>
            </div>
            </div>
        </>
    )
}
