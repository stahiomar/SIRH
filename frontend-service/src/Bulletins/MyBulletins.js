import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper,
    Container, IconButton
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useAuth } from '../User/AuthContext';

const MyBulletins = () => {
    const [bulletins, setBulletins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { auth } = useAuth();

    // Retrieve credentials from localStorage
    const authHeader = `Basic ${btoa(`${auth.username}:${auth.password}`)}`;

    const fetchBulletins = async () => {
        try {
            if (auth.username && auth.password) {
                // Fetch authenticated user details
                const userResponse = await axios.get('http://192.168.49.2:30001/api/users/me', {
                    headers: {
                        Authorization: authHeader
                    }
                });

                const user = userResponse.data;

                // Fetch bulletins for the employee
                const bulletinsResponse = await axios.get(`http://192.168.49.2:30001/s3/buckets/bulletins/folders/${user.username}/pdfs`, {
                    headers: {
                        Authorization: authHeader
                    }
                });

                const bulletinsData = Array.isArray(bulletinsResponse.data) ? bulletinsResponse.data : [];

                // Split each entry into date and URL
                const parsedBulletins = bulletinsData.map(entry => {
                    const [formattedDate, pdfUrl] = entry.split('+');
                    return { formattedDate, pdfUrl };
                });

                setBulletins(parsedBulletins);
            } else {
                setError('User credentials are not available.');
            }
        } catch (err) {
            setError('Failed to fetch bulletins');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBulletins();
    }, []);

    if (loading) return <p>Loading bulletins...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Container maxWidth="md" style={{ marginTop: '2rem' }}>
            <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ backgroundColor: '#3f51b5', color: 'white', width: "40%"}}>Month</TableCell>
                            <TableCell sx={{ backgroundColor: '#3f51b5', color: 'white' }}>Bulletin</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bulletins.map((bulletin, index) => (
                            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">{bulletin.formattedDate}</TableCell>
                                <TableCell>
                                    <a href={bulletin.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <IconButton>
                                            <PictureAsPdfIcon sx={{ color: 'red' }} />
                                        </IconButton>
                                        {` View PDF ${index + 1}`}
                                    </a>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default MyBulletins;
