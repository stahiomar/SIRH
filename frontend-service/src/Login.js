import React, { useState } from 'react';
import { useAuth } from './User/AuthContext'; // Import useAuth
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Paper,
    Grid
} from '@mui/material';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate(); // Hook for programmatic navigation

    const handleLogin = (e) => {
        e.preventDefault();
        login(username, password);
        navigate('/profil');
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 4, mt: 8 }}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Typography variant="h4" component="h1" gutterBottom>
                        Login
                    </Typography>
                    <form onSubmit={handleLogin}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Username"
                                    variant="outlined"
                                    fullWidth
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Password"
                                    variant="outlined"
                                    type="password"
                                    fullWidth
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                >
                                    Login
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;
