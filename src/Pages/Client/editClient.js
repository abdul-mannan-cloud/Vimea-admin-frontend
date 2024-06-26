import React, {useEffect, useState} from 'react';
import {TextField, Button, Container, Grid} from '@mui/material';
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";

const EditClient = () => {
    const {id} = useParams()
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        contactNumber: '',
        sales: 0,
        password: '',
    });

    useEffect(() => {
        if (localStorage.getItem('token') === null) {
            navigate('/login')
        }
        if (localStorage.getItem('role') !== 'admin') {
            navigate('/clients')
        }
    }, []);

    useEffect(() => {
        setLoading(true)
        const fetchClientDetails = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/client/getclient/${id}`);

                const allChildren = [];
                for (const child of response.data.children) {
                    const childResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/client/getChild/${child}`)
                    allChildren.push(childResponse.data)
                }

                setFormData({
                    ...response.data,
                    children: allChildren,
                });
                setLoading(false)
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
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleChildInputChange=(index,e)=>{
        var child = formData.children[index]
        child = {...child,[e.target.name]:e.target.value}
        const children = formData.children.map(c=>{
            if(c._id===child._id){
                return child
            }
            return c
        })
        setFormData({
            ...formData,
            children:children
        })
    }


    return (
        <>
            {loading && <div className="fixed top-0 left-0 w-screen h-screen bg-white opacity-50 z-50 flex justify-center items-center">
                <div className="animate-spin rounded-full h-20 w-20 border-t-2  border-teal-600"></div>
            </div> }
            <form className='pt-40 bg-gray-100 pl-16 sm:pl-0 sm:pr-0 pr-1' onSubmit={handleNewFormSubmit} id="formID"
                  encType="multipart/form-data">
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
                                        label="Mbiemri i Klientit"
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
                                <h1 className="text-4xl font-bold text-center mt-10 mb-5">Childrens</h1>
                                {
                                    formData.children && formData.children.map((index,child) => {
                                        console.log(child)
                                        return <>
                                            <Grid item xs={12}>
                                                <TextField
                                                    name="firstname"
                                                    label="Emri i Femijes"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={child.firstname}
                                                    // onChange={(e)=>handleChildInputChange(index,e)}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    name="lastName"
                                                    label="Mbiemri i Femijes"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={child.lastName}
                                                    onChange={(e)=>handleChildInputChange(index,e)}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    name="gender"
                                                    label="Gender"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={child.gender}
                                                    onChange={(e)=>handleChildInputChange(index,e)}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    name="height"
                                                    label="Height"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={child.height}
                                                    onChange={(e)=>handleChildInputChange(index,e)}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    name="weight"
                                                    label="Weight"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={child.weight}
                                                    onChange={(e)=>handleChildInputChange(index,e)}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    name="insurance"
                                                    label="Insurance"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={child.insurance}
                                                    onChange={(e)=>handleChildInputChange(index,e)}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    name="birthPlace"
                                                    label="Birth Place"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={child.birthPlace}
                                                    onChange={(e)=>handleChildInputChange(index,e)}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>

                                            </Grid>
                                        </>
                                    })
                                }
                            </Grid>
                        </Container>
                    </div>
                </div>
            </form>
        </>
    );
};

export default EditClient;
