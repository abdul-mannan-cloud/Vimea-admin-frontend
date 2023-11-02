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
        <form className='' onSubmit={handleNewFormSubmit} id="formID" encType="multipart/form-data">
            <div className='flex h-screen'>
                <Sidebar />
                <div className='flex flex-col w-full overflow-auto'>
                    <NavBar />
                    <Container maxWidth="md">
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item xs={12}>
                                <TextField
                                    name="clientName"
                                    label="Client Name"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.clientName}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="mobileNumber"
                                    label="Mobile Number"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.mobileNumber}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="userName"
                                    label="User Name"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.userName}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="password"
                                    label="Password"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    Add Client
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
