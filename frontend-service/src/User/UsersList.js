import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Container
} from '@mui/material';
import { useAuth } from './AuthContext';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { auth } = useAuth(); // Access the auth state from context


    const fetchUsers = async () => {
        try {
            const authHeader = `Basic ${btoa(`${auth.username}:${auth.password}`)}`;

            if (auth.username && auth.password) {
                const response = await axios.get('http://192.168.49.2:30001/api/users', {
                    headers: {
                        Authorization: authHeader
                    }
                    
                });
                setUsers(response.data);
            } else {
                setError('User credentials are not available.');
            }
        } catch (err) {
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);


    if (loading) return <p>Loading data...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Container maxWidth="md" style={{ marginTop: '2rem' }}>
            <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ backgroundColor: '#3f51b5', color: 'white' }}>First Name</TableCell>
                            <TableCell sx={{ backgroundColor: '#3f51b5', color: 'white' }}>Last Name</TableCell>
                            <TableCell sx={{ backgroundColor: '#3f51b5', color: 'white' }} align="center">Email</TableCell>
                            <TableCell sx={{ backgroundColor: '#3f51b5', color: 'white' }} align="center">Address</TableCell>
                            <TableCell sx={{ backgroundColor: '#3f51b5', color: 'white' }} align="center">Role</TableCell>
                            <TableCell sx={{ backgroundColor: '#3f51b5', color: 'white' }} align="center">Team</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">{user.firstName}</TableCell>
                                <TableCell>{user.lastName}</TableCell>
                                <TableCell align="center">{user.email}</TableCell>
                                <TableCell align="center">{user.address}</TableCell>
                                <TableCell align="center">{user.role}</TableCell>
                                <TableCell align="center">{user.team}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default UsersList;