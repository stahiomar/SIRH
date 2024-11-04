import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Button, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle, TextField, MenuItem, Select, Container
} from '@mui/material';
import { useAuth } from './AuthContext';

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [editUserData, setEditUserData] = useState({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        address:'',
        role: '',
        team: ''
    });
    const [editOpen, setEditOpen] = useState(false);
    const { auth } = useAuth(); // Access the auth state from context
    const authHeader = `Basic ${btoa(`${auth.username}:${auth.password}`)}`;

    const fetchUsers = async () => {
        try {
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

    const handleUpdate = (user) => {
        setEditUserData({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            address: user.address,
            role: user.role,
            team: user.team
        });
        setEditOpen(true);
    };

    const handleEditSubmit = async () => {
        try {
            if (auth.username && auth.password) {
                await axios.put(`http://192.168.49.2:30001/api/users/${editUserData.id}`, {
                    firstName: editUserData.firstName,
                    lastName: editUserData.lastName,
                    email: editUserData.email,
                    address: editUserData.address,
                    role: editUserData.role,
                    team: editUserData.team
                }, {
                    headers: {
                        Authorization: authHeader
                    }
                });
                setEditOpen(false);
                fetchUsers(); // Refetch users after update
            } else {
                console.error('User credentials are not available.');
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleDelete = async () => {
        try {
            if (auth.username && auth.password) {
                await axios.delete(`http://192.168.49.2:30001/api/users/${selectedUserId}`, {
                    headers: {
                        Authorization: authHeader
                    }
                });
                console.log(`Deleted User ID: ${selectedUserId}`);
                fetchUsers();
                setOpen(false);
            } else {
                console.error('User credentials are not available.');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleClickOpen = (userId) => {
        setSelectedUserId(userId);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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
                            <TableCell sx={{ backgroundColor: '#3f51b5', color: 'white' }} align="center">Action</TableCell>
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
                                <TableCell align="center">
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={() => handleUpdate(user)} 
                                        sx={{ marginRight: 1 }}
                                    >
                                        Update
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        color="secondary" 
                                        onClick={() => handleClickOpen(user.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={editOpen} onClose={() => setEditOpen(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Edit User</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="First Name"
                        type="text"
                        fullWidth
                        value={editUserData.firstName}
                        onChange={(e) => setEditUserData({ ...editUserData, firstName: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Last Name"
                        type="text"
                        fullWidth
                        value={editUserData.lastName}
                        onChange={(e) => setEditUserData({ ...editUserData, lastName: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        type="email"
                        fullWidth
                        value={editUserData.email}
                        onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Address"
                        type="text"
                        fullWidth
                        value={editUserData.address}
                        onChange={(e) => setEditUserData({ ...editUserData, address: e.target.value })}
                    />
                    <Select
                        margin="dense"
                        fullWidth
                        value={editUserData.role}
                        onChange={(e) => setEditUserData({ ...editUserData, role: e.target.value })}
                    >
                        <MenuItem value="MANAGER">Manager</MenuItem>
                        <MenuItem value="HR">HR</MenuItem>
                        <MenuItem value="EMPLOYEE">Employee</MenuItem>
                        <MenuItem value="ADMIN">Admin</MenuItem>
                    </Select>
                    <TextField
                        margin="dense"
                        label="Team"
                        type="text"
                        fullWidth
                        value={editUserData.team}
                        onChange={(e) => setEditUserData({ ...editUserData, team: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleEditSubmit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Delete User"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this user?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Cancel</Button>
                    <Button onClick={handleDelete} color="secondary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default UsersManagement;
