import React, {useEffect, useState} from 'react';
import NavBar from '../../Components/navbar';
import Sidebar from '../../Components/sidebar';
import { TextField, Button, Container, Grid } from '@mui/material';
import axios from "axios";
import {useNavigate} from "react-router-dom";

const AddClient = () => {
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        contactNumber: '',
        sales: 0,
        password: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('token') === null){
            navigate('/login')
        }
        if(localStorage.getItem('role') !== 'admin'){
            alert('You are not authorized to view this page')
            navigate('/clients')
        }
    }, []);

    const handleNewFormSubmit = async (e) => {
        e.preventDefault();
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/client/addclient`, formData);
        if(res.status === 200){
            alert('Klienti u shtua me sukses!');
            navigate('/clients');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <form className='pt-40 bg-gray-100' onSubmit={handleNewFormSubmit} id="formID" encType="multipart/form-data">
            <div className='flex h-screen'>
                <div className='flex flex-col w-full overflow-auto'>
                    <Container maxWidth="md" className='bg-white rounded-xl p-14'>
                        <Grid container spacing={2} justifyContent="center">
                            <span className='text-3xl font-bold mb-5'>Detajet e Klientit</span>
                            <Grid item xs={12}>
                                <TextField
                                    name="firstName"
                                    label="First Name"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="lastName"
                                    label="Last Name"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="contactNumber"
                                    label="Numri i Telefonit"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.contactNumber}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="email"
                                    label="Emri i Email"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="password"
                                    label="Fjalëkalimi"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    Shto Klientin
                                </Button>
                            </Grid>
                        </Grid>
                    </Container>
                </div>
            </div>
        </form>
    );
};

export default AddClient;
