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
    Button,
    Box,
    Typography
} from '@mui/material';
import { blue, grey } from '@mui/material/colors';
import { useAuth } from '../User/AuthContext';

const RoleBasedHolidays = () => {
    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { auth } = useAuth(); // Access the auth state from context

    const fetchUserAndHolidays = async () => {
        const authHeader = `Basic ${btoa(`${auth.username}:${auth.password}`)}`;

        try {
            // Fetch holidays based on the user's role
            const holidaysResponse = await axios.get('http://192.168.49.2:30001/api/holiday/role-based-holidays', {
                headers: {
                    Authorization: authHeader
                }
            });
            setHolidays(Array.isArray(holidaysResponse.data) ? holidaysResponse.data : []);
        } catch (err) {
            console.error('Failed to fetch holidays:', err);
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserAndHolidays();
    }, [auth.username, auth.password]);

    const handleApprove = async (holidayId) => {
        const authHeader = `Basic ${btoa(`${auth.username}:${auth.password}`)}`;

        try {
            await axios.post(`http://192.168.49.2:30001/api/holiday/${holidayId}/approve`, null, {
                headers: {
                    Authorization: authHeader,
                }
            });
            console.log(`Holiday Approved: ${holidayId}`);
            // Refetch holidays after update
            fetchUserAndHolidays();
        } catch (error) {
            console.error('Error approving holiday:', error);
        }
    };

    const handleDisapprove = async (holidayId) => {
        const authHeader = `Basic ${btoa(`${auth.username}:${auth.password}`)}`;

        try {
            await axios.post(`http://192.168.49.2:30001/api/holiday/${holidayId}/disapprove`, null, {
                headers: {
                    Authorization: authHeader,
                }
            });
            console.log(`Holiday Disapproved: ${holidayId}`);
            // Refetch holidays after update
            fetchUserAndHolidays();
        } catch (error) {
            console.error('Error disapproving holiday:', error);
        }
    };

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
                <TableContainer component={Paper} sx={{ width: '110%', margin: 'auto', boxShadow: 3, borderRadius: 2 }}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: '#3f51b5', color: 'white' }}>Username</TableCell>
                                <TableCell sx={{ backgroundColor: '#3f51b5', color: 'white' }} align="center">Start Date</TableCell>
                                <TableCell sx={{ backgroundColor: '#3f51b5', color: 'white' }} align="center">End Date</TableCell>
                                <TableCell sx={{ backgroundColor: '#3f51b5', color: 'white' }} align="center">Status</TableCell>
                                <TableCell sx={{ backgroundColor: '#3f51b5', color: 'white' }} align="center">Type</TableCell>
                                <TableCell sx={{ backgroundColor: '#3f51b5', color: 'white' }} align="center">Note</TableCell>
                                <TableCell sx={{ backgroundColor: '#3f51b5', color: 'white' }} align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {holidays.map((holiday) => (
                                <TableRow key={holiday.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        {holiday.userName}
                                    </TableCell>
                                    <TableCell align="center">{holiday.startDate}</TableCell>
                                    <TableCell align="center">{holiday.endDate}</TableCell>
                                    <TableCell align="center">{holiday.status}</TableCell>
                                    <TableCell align="center">{holiday.type}</TableCell>
                                    <TableCell align="center">{holiday.note}</TableCell>
                                    <TableCell align="center">
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            onClick={() => handleApprove(holiday.id)}
                                            sx={{ marginRight: 1 }}
                                        >
                                            Approve
                                        </Button>
                                        <Button 
                                            variant="contained" 
                                            color="secondary" 
                                            onClick={() => handleDisapprove(holiday.id)}
                                        >
                                            Disapprove
                                        </Button>
                                    </TableCell>
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

export default RoleBasedHolidays;
