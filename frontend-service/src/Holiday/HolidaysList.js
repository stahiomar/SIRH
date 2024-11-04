import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Alert,
    Box,
    Typography
} from '@mui/material';
import { blue, grey } from '@mui/material/colors';
import { useAuth } from '../User/AuthContext';

const HolidaysList = () => {
    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { auth } = useAuth(); // Access the auth state from context

    const fetchHolidays = async () => {
        const authHeader = `Basic ${btoa(`${auth.username}:${auth.password}`)}`;

        try {
            const response = await axios.get('http://192.168.49.2:30001/api/holiday/me/holidays', {
                headers: {
                    Authorization: authHeader
                }
            });
            setHolidays(response.data);
        } catch (err) {
            console.error('Failed to fetch holidays:', err);
            setError('Failed to fetch holidays');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHolidays();
    }, [auth.username, auth.password]);

    return (
        <Container maxWidth="md" style={{ marginTop: '2rem' }}>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
                    <CircularProgress color="primary" />
                </Box>
            ) : error ? (
                <Alert severity="error" variant="filled" style={{ marginBottom: '1rem' }}>
                    {error}
                </Alert>
            ) : holidays.length > 0 ? (
                <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: '#3f51b5', color: 'white' }}>Start Date</TableCell>
                                <TableCell sx={{ backgroundColor: '#3f51b5', color: 'white' }} align="center">End Date</TableCell>
                                <TableCell sx={{ backgroundColor: '#3f51b5', color: 'white' }} align="center">Status</TableCell>
                                <TableCell sx={{ backgroundColor: '#3f51b5', color: 'white' }} align="center">Type</TableCell>
                                <TableCell sx={{ backgroundColor: '#3f51b5', color: 'white' }} align="center">Note</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {holidays.map((holiday) => (
                                <TableRow key={holiday.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        {holiday.startDate}
                                    </TableCell>
                                    <TableCell align="center">{holiday.endDate}</TableCell>
                                    <TableCell align="center">{holiday.status}</TableCell>
                                    <TableCell align="center">{holiday.type}</TableCell>
                                    <TableCell align="center">{holiday.note}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="body1" color={grey[700]}>
                    No holidays available
                </Typography>
            )}
        </Container>
    );
};

export default HolidaysList;
