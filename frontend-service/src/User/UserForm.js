import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    TextField, Button, Container, Typography, Paper, Grid, MenuItem, Alert
} from '@mui/material';
import { useAuth } from './AuthContext';

const UserForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [team, setTeam] = useState('');
    const [role, setRole] = useState('EMPLOYEE');
    const { auth } = useAuth(); // Access the auth state from context

    const [users, setUsers] = useState([]);
    const [successMessage, setSuccessMessage] = useState(''); // State for success message
    const [errorMessage, setErrorMessage] = useState(''); // State for error message
    const authHeader = `Basic ${btoa(`${auth.username}:${auth.password}`)}`;

    useEffect(() => {
        axios.get('http://192.168.49.2:30001/api/users/me', {
            headers: {
                Authorization: authHeader
            }
        })
        .then(response => {
            setUsers([response.data]);
            console.log('Authenticated user fetched:', response.data);
        })
        .catch(error => {
            if (error.response && error.response.status === 401) {
                console.error('Unauthorized access! Please check your credentials.');
                setErrorMessage('Unauthorized access! Please check your credentials.');
            } else {
                console.error('There was an error fetching the authenticated user!', error);
                setErrorMessage('There was an error fetching the authenticated user.');
            }
        });
    }, [auth]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const newUser = {
            firstName,
            lastName,
            address,
            password,
            email,
            team,
            role
        };

        axios.post('http://192.168.49.2:30001/api/users', newUser, {
            headers: {
                Authorization: authHeader
            }
        })
        .then(response => {
            console.log('User created successfully:', response.data);
            setUsers(prevUsers => [...prevUsers, response.data]);
            setSuccessMessage('User created successfully!'); // Set success message
            setErrorMessage(''); // Clear any error message
        })
        .catch(error => {
            if (error.response && error.response.status === 401) {
                console.error('Unauthorized access while creating user! Please check your credentials.');
                setErrorMessage('Unauthorized access while creating user! Please check your credentials.');
            } else {
                console.error('There was an error creating the user!', error);
                setErrorMessage('There was an error creating the user.');
            }
            setSuccessMessage(''); // Clear success message on error
        });
    };

    return (
        <Container component={Paper} sx={{ padding: 4, maxWidth: 600 }}>
            <Typography variant="h4" component="h2" gutterBottom>
                Create New User
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Team"
                            value={team}
                            onChange={(e) => setTeam(e.target.value)}
                            required
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            select
                            fullWidth
                            label="Role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            variant="outlined"
                        >
                            <MenuItem value="ADMIN">ADMIN</MenuItem>
                            <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
                            <MenuItem value="MANAGER">MANAGER</MenuItem>
                            <MenuItem value="HR">HR</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            Create User
                        </Button>
                    </Grid>
                </Grid>
            </form>

            {successMessage && (
                <Alert severity="success" sx={{ mt: 2 }}>
                    {successMessage}
                </Alert>
            )}

            {errorMessage && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {errorMessage}
                </Alert>
            )}
        </Container>
    );
};

export default UserForm;
