import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, CardContent, Typography, CircularProgress, Alert, Box, Avatar, Divider } from '@mui/material';
import { useAuth } from './AuthContext';

// Define custom color palette
const gold = '#FFD700';
const darkTeal = '#004d4d';
const softWhite = '#f8f9fa';
const deepBrown = '#5a3e36';

const UserInfos = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { auth } = useAuth();

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
    }, [auth.username, auth.password]);

    return (
        <Container maxWidth="sm" sx={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
                    <CircularProgress sx={{ color: gold }} />
                </Box>
            ) : error ? (
                <Alert severity="error" variant="filled" sx={{ mb: 2, bgcolor: deepBrown, color: softWhite }}>
                    {error}
                </Alert>
            ) : user ? (
                <Card sx={{ bgcolor: 'darkblue', boxShadow: 4, borderRadius: 3, width: '100%', color: softWhite }}>
                    <CardContent>
                        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                            <Avatar sx={{ bgcolor: gold, width: 72, height: 72, fontSize: 32, mb: 2 }}>
                                {user.username[0].toUpperCase()}
                            </Avatar>
                            <Typography variant="h5" component="h2" sx={{ color: gold }}>
                                {user.firstName} {user.lastName}
                            </Typography>
                            <Typography variant="subtitle1" sx={{ color: softWhite }}>
                                {user.role}
                            </Typography>
                        </Box>
                        <Divider sx={{ mb: 2, bgcolor: gold }} />
                        <Box>
                            <Typography variant="body1" gutterBottom><strong>Username:</strong> {user.username}</Typography>
                            <Typography variant="body1" gutterBottom><strong>Email:</strong> {user.email}</Typography>
                            <Typography variant="body1" gutterBottom><strong>Address:</strong> {user.address}</Typography>
                            <Typography variant="body1" gutterBottom><strong>Team:</strong> {user.team}</Typography>
                            <Typography variant="body1" gutterBottom><strong>Integration Date:</strong> {user.integrationDate}</Typography>
                        </Box>
                    </CardContent>
                </Card>
            ) : (
                <Typography variant="body1" sx={{ color: deepBrown }}>
                    No user information available
                </Typography>
            )}
        </Container>
    );
};

export default UserInfos;
