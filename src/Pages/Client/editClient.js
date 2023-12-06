import React, {useEffect, useState} from 'react';
import { TextField, Button, Container, Grid } from '@mui/material';
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";

const EditClient = () => {
    const {id} = useParams()

    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        contactNumber: '',
        sales: 0,
        password: '',
    });

    useEffect(() => {
        if(localStorage.getItem('token') === null){
            navigate('/login')
        }
        if(localStorage.getItem('role') !== 'admin'){
            navigate('/clients')
        }
    }, []);

    useEffect(() => {
        const fetchClientDetails = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/client/getclient/${id}`);
                setFormData(response.data);
            } catch (error) {
                console.error('Error fetching client details:', error.message);
            }
        };
        fetchClientDetails();
    }, []);

    const navigate = useNavigate();

    const handleNewFormSubmit = async (e) => {
        e.preventDefault();
        if (formData.clientName === '' || formData.mobileNumber === '' || formData.userName === '' || formData.password === '') {
            alert('Ju lutem plotësoni të gjitha fushat!');
            return;
        }
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/client/editClient`, formData);
        if (res.status === 200) {
            alert('Klienti u shtua me sukses!');
            navigate('/clients')
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
                                    name="clientName"
                                    label="Emri i Klientit"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="clientName"
                                    label="Emri i Klientit"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="mobileNumber"
                                    label="Numri i Telefonit"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.contactNumber}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="userName"
                                    label="Emri i User-it"
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
                                    type="text"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    Edito Klientin
                                </Button>
                            </Grid>
                        </Grid>
                    </Container>
                </div>
            </div>
        </form>
    );
};

export default EditClient;
