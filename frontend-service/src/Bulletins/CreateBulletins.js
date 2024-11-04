import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Typography, MenuItem, Select, FormControl, InputLabel, Box } from '@mui/material';
import { useAuth } from '../User/AuthContext';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [folderName, setFolderName] = useState('');
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { auth } = useAuth();
    const authHeader = `Basic ${btoa(`${auth.username}:${auth.password}`)}`;

    useEffect(() => {
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

        fetchUsers();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFolderNameChange = (e) => {
        setFolderName(e.target.value);
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file || !folderName) {
            setMessage('Please select a file and choose a user.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`http://192.168.49.2:30001/s3/buckets/bulletins/folders/${folderName}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                setMessage('File uploaded successfully!');
            } else {
                setMessage('Failed to upload file.');
            }
        } catch (error) {
            setMessage('An error occurred while uploading the file.');
            console.error('Error:', error);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Create pay slip
            </Typography>
            <form onSubmit={handleUpload}>
                <FormControl fullWidth margin="normal" required>
                    <InputLabel>User</InputLabel>
                    <Select
                        value={folderName}
                        onChange={handleFolderNameChange}
                    >
                        {users.map((user) => (
                            <MenuItem key={user.id} value={user.username}>
                                {user.username}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <input type="file" onChange={handleFileChange} required />
                <Button variant="contained" color="primary" type="submit" fullWidth style={{ marginTop: '16px' }}>
                    Upload
                </Button>
            </form>
            {message && (
                <Typography variant="body1" color="textSecondary" style={{ marginTop: '16px' }}>
                    {message}
                </Typography>
            )}
        </Box>
    );
};

export default FileUpload;
