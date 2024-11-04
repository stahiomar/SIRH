import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    TextField, Button, Container, Typography, Paper, Grid, Alert
} from '@mui/material';
import { useAuth } from './AuthContext';

const ModifyInfos = () => {
    const [user, setUser] = useState({
        username: '',
        email: '',
        team: '',
        role: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const { auth } = useAuth(); // Access the auth state from context


    const fetchUserInfo = async () => {
        const authHeader = `Basic ${btoa(`${auth.username}:${auth.password}`)}`;

        try {
            const response = await axios.get('http://192.168.49.2:30001/api/users/me', {
                headers: {
                    Authorization: authHeader
                }
            });
            setUser(response.data);
        } catch (err) {
            console.error('Failed to fetch user information:', err);
            setError('Failed to fetch user information');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const authHeader = `Basic ${btoa(`${auth.username}:${auth.password}`)}`;


        try {
            await axios.put('http://192.168.49.2:30001/api/users/me', user, {
                headers: {
                    Authorization: authHeader
                }
            });
            setSuccessMessage('User updated successfully!');
        } catch (err) {
            console.error('Failed to update user information:', err);
            setError('Failed to update user information');
        }
    };

    if (loading) return <Typography>Loading user information...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Container component={Paper} sx={{ padding: 4, maxWidth: 600 }}>
            <Typography variant="h4" component="h2" gutterBottom>
                Edit User Information
            </Typography>
            {successMessage && (
                <Alert severity="success" sx={{ marginBottom: 2 }}>
                    {successMessage}
                </Alert>
            )}
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Address"
                            name="address"
                            value={user.address}
                            onChange={handleChange}
                            required
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={user.email}
                            onChange={handleChange}
                            required
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            Update Information
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default ModifyInfos;
