import React, { useState } from 'react';
import NavBar from '../../Components/navbar';
import Sidebar from '../../Components/sidebar';
import { TextField, Button, Container, Grid } from '@mui/material';

const AddClient = () => {
    const [formData, setFormData] = useState({
        clientName: '',
        mobileNumber: '',
        sales: 0,
        userName: '',
        password: '',
    });

    const handleNewFormSubmit = (e) => {    
        e.preventDefault();
        

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
                                    value={formData.clientName}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="mobileNumber"
                                    label="Numri i Telefonit"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.mobileNumber}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="userName"
                                    label="Emri i User-it"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.userName}
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
