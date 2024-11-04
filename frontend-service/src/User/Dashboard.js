import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card, CardContent, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useAuth } from './AuthContext';

const Dashboard = () => {
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);
  const [solde, setSolde] = useState(0);
  const [latestBulletin, setLatestBulletin] = useState(null);
  const { auth } = useAuth();
  const authHeader = `Basic ${btoa(`${auth.username}:${auth.password}`)}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const soldeResponse = await axios.get('http://192.168.49.2:30001/api/users/me/solde', {
          headers: {
            Authorization: authHeader
          }
        });
        setSolde(soldeResponse.data);

        const holidaysResponse = await axios.get('http://192.168.49.2:30001/api/holiday/me/upcoming-holidays', {
          headers: {
            Authorization: authHeader
          }
        });
        setUpcomingHolidays(holidaysResponse.data);

        const bulletinResponse = await axios.get('http://192.168.49.2:30001/api/bulletins/latest', {
          headers: {
            Authorization: authHeader
          }
        });
        setLatestBulletin(bulletinResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 'bold', marginBottom: '24px' }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Remaining Leave Balance */}
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: '#ffffff', color: '#333', boxShadow: 3, borderRadius: '8px' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
                Remaining Leave Balance
              </Typography>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                {solde} days
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Next Holiday */}
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: '#ffffff', color: '#333', boxShadow: 3, borderRadius: '8px' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '16px' }}>
                Next Holiday
              </Typography>
              <TableContainer component={Paper} sx={{ boxShadow: 'none', backgroundColor: '#f9f9f9' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#e3f2fd' }}>Start Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#e3f2fd' }}>End Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#e3f2fd' }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#e3f2fd' }}>Notes</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#e3f2fd' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {upcomingHolidays.map((holiday) => (
                      <TableRow key={holiday.id}>
                        <TableCell>{holiday.startDate}</TableCell>
                        <TableCell>{holiday.endDate}</TableCell>
                        <TableCell>{holiday.type}</TableCell>
                        <TableCell>{holiday.note || '-'}</TableCell>
                        <TableCell>{holiday.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Last Pay Slip */}
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: '#ffffff', color: '#333', boxShadow: 3, borderRadius: '8px' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '16px' }}>
                Last Pay Slip
              </Typography>
              {latestBulletin ? (
                <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#e3f2fd' }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#e3f2fd' }}>Bulletin</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{latestBulletin.split('+')[0]}</TableCell>
                        <TableCell>
                          <a href={latestBulletin.split('+')[1]} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#1976d2', display: 'flex', alignItems: 'center' }}>
                            <IconButton sx={{ color: '#e74c3c', marginRight: '8px' }}>
                              <PictureAsPdfIcon />
                            </IconButton>
                            View PDF
                          </a>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body1">No pay slip available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
