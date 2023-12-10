import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export const AddAppointment = () => {

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        duration: "",
        group: "",
    });

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

        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/service/addservice`, formData);
        if (response.status === 201) {
            setFormData({
                service: "",
                price: "",
                duration: "",
                category: "",
            })
            navigate('/appointments')
        } else {
            alert("Ka ndodhur një gabim!")
        }
    };

    const groups = ["Për Fëmijë", "Për Bebe", "Mami + Bebi", "Group Plush", "Për Nënen"];

    return (
        <>
            <div className="flex flex-col justify-center items-center min-h-screen">
                <h1 className="text-4xl font-bold text-center mt-10 mb-5">Shto një Service</h1>
                <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center">
                    <div className="flex flex-col justify-center items-center">
                        <label htmlFor="name" className="text-xl font-bold">Shërbimi</label>
                        <input type="text" name="name" id="name" className="border-2 border-black rounded-md p-2"
                               onChange={handleChange}/>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <label htmlFor="price" className="text-xl font-bold">Çmimi</label>
                        <input type="number" name="price" id="price" className="border-2 border-black rounded-md p-2"
                               onChange={handleChange}/>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <label htmlFor="duration" className="text-xl font-bold">Koha e shërbimit</label>
                        <input type="number" name="duration" id="duration"
                               className="border-2 border-black rounded-md p-2"
                               onChange={handleChange}/>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <label htmlFor="category" className="text-xl font-bold">Kategoria</label>
                        <select name="group" id="group" className="border-2 border-black rounded-md p-2"
                                onChange={handleChange}>
                            <option value="" disabled selected>Zgjidhni një kategori</option>
                            {groups.map((group) => (
                                <option value={group}>{group}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="border-2 border-black rounded-md p-2 mt-5">Shto Service</button>
                </form>
            </div>
        </>
    )
}
