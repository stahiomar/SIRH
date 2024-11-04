import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    TextField, 
    Button, 
    MenuItem, 
    Typography, 
    Box, 
    Alert, 
    Grid 
} from '@mui/material';
import { useAuth } from '../User/AuthContext';

const HolidayForm = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [note, setNote] = useState('');
    const [type, setType] = useState('PAID_LEAVE');
    const [userDetails, setUserDetails] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { auth } = useAuth();

    useEffect(() => {
        const fetchUserDetails = async () => {
            const authHeader = `Basic ${btoa(`${auth.username}:${auth.password}`)}`;
            try {
                const response = await axios.get('http://192.168.49.2:30001/api/users/me', {
                    headers: {
                        Authorization: authHeader
                    }
                });
                setUserDetails(response.data);
                console.log('User details fetched:', response.data);
            } catch (error) {
                console.error('There was an error fetching the user details!', error);
                setErrorMessage('Failed to fetch user details.');
            }
        };

        fetchUserDetails();
    }, [auth.username, auth.password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const authHeader = `Basic ${btoa(`${auth.username}:${auth.password}`)}`;

        const holiday = {
            startDate,
            endDate,
            note,
            type
        };

        try {
            const response = await axios.post('http://192.168.49.2:30001/api/holiday', holiday, {
                headers: {
                    Authorization: authHeader
                }
            });
            console.log('Holiday created:', response.data);
            setErrorMessage('');
            setSuccessMessage('Holiday created successfully!');
        } catch (error) {
            console.error('There was an error creating the holiday!', error);
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message || 'An error occurred while creating the holiday.');
            } else {
                setErrorMessage('An error occurred while creating the holiday.');
            }
            setSuccessMessage('');
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
            <Typography variant="h4" gutterBottom>
                Request Holiday
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {/* Conditionally render Start Date and End Date fields */}
                    {type !== 'MATERNITY_LEAVE' && type !== 'PATERNITY_LEAVE' && (
                        <>
                            <Grid item xs={12}>
                                <TextField
                                    label="Start Date"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    fullWidth
                                    required
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="End Date"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    fullWidth
                                    required
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                        </>
                    )}
                    <Grid item xs={12}>
                        <TextField
                            label="Note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Type"
                            select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            fullWidth
                            required
                        >
                            <MenuItem value="PAID_LEAVE">Paid Leave</MenuItem>
                            <MenuItem value="SICK_LEAVE">Sick Leave</MenuItem>
                            <MenuItem value="MATERNITY_LEAVE">Maternity Leave</MenuItem>
                            <MenuItem value="PATERNITY_LEAVE">Paternity Leave</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" type="submit" fullWidth>
                            Create Holiday
                        </Button>
                    </Grid>
                </Grid>
            </form>

            {errorMessage && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {errorMessage}
                </Alert>
            )}

            {successMessage && (
                <Alert severity="success" sx={{ mt: 2 }}>
                    {successMessage}
                </Alert>
            )}

        
        </Box>
    );
};

export default HolidayForm;
