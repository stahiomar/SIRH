import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    Collapse,
    Divider,
    ListItemIcon,
    Menu,
    MenuItem
} from '@mui/material';
import { ExpandLess, ExpandMore, Dashboard, People, Settings, Work, Payment, AccountCircle } from '@mui/icons-material';
import { useAuth } from '../User/AuthContext';

const Header = () => {
    const navigate = useNavigate();
    const [openConges, setOpenConges] = useState(false);
    const [openBulletins, setOpenBulletins] = useState(false);
    const [openReporting, setOpenReporting] = useState(false);
    const [openAdmin, setOpenAdmin] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const openProfileMenu = Boolean(anchorEl);
    const { auth } = useAuth();
    const authHeader = `Basic ${btoa(`${auth.username}:${auth.password}`)}`;

    useEffect(() => {
        axios.get('http://192.168.49.2:30001/api/users/me', {
            headers: {
                Authorization: authHeader
            }
        })
            .then(response => {
                setUserRole(response.data.role);
            })
            .catch(error => {
                console.error('Error fetching user role:', error);
            });
    }, [authHeader]);

    const handleLogout = () => {
        axios.post('http://192.168.49.2:30001/logout', {}, {
            withCredentials: true,
        })
            .then(() => {
                window.location.href = 'frontend-service:3000';
            })
            .catch(error => {
                console.error('Error during logout:', error);
            });
    };

    const handleProfileClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const toggleConges = () => setOpenConges(!openConges);
    const toggleBulletins = () => setOpenBulletins(!openBulletins);
    const toggleReporting = () => setOpenReporting(!openReporting);
    const toggleAdmin = () => setOpenAdmin(!openAdmin);

    return (
        <Drawer
            variant="permanent"
            anchor="left"
        >
            <List>
                <ListItem button component={Link} to="/dashboard">
                    <ListItemIcon>
                        <Dashboard />
                    </ListItemIcon>
                    <ListItemText primary="Accueil / Dashboard" />
                </ListItem>

                {(userRole === 'HR' || userRole === 'MANAGER' || userRole === 'EMPLOYEE') && (
                    <>
                        <ListItem button onClick={toggleConges}>
                            <ListItemIcon>
                                <Work />
                            </ListItemIcon>
                            <ListItemText primary="Holidays" />
                            {openConges ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={openConges} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem button component={Link} to="/conges/demande">
                                    <ListItemText inset primary="Holiday request" />
                                </ListItem>
                                <ListItem button component={Link} to="/conges/historique">
                                    <ListItemText inset primary="Holidays history" />
                                </ListItem>
                                {userRole === 'HR' && (
                                    <ListItem button component={Link} to="/conges/gestion">
                                        <ListItemText inset primary="Holidays management" />
                                    </ListItem>
                                )}
                            </List>
                        </Collapse>

                        <ListItem button onClick={toggleBulletins}>
                            <ListItemIcon>
                                <Payment />
                            </ListItemIcon>
                            <ListItemText primary="Pay slips" />
                            {openBulletins ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={openBulletins} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem button component={Link} to="/bulletins/mesBulletins">
                                    <ListItemText inset primary="My pay slips" />
                                </ListItem>
                                {(userRole === 'HR' || userRole === 'MANAGER') && (
                                    <ListItem button component={Link} to="/bulletins/creerBulletins">
                                        <ListItemText inset primary="Create pay slip" />
                                    </ListItem>
                                )}
                            </List>
                        </Collapse>
                    </>
                )}

                {userRole === 'HR' && (
                    <>
                        <Collapse in={openReporting} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem button component={Link} to="/reporting/conges">
                                    <ListItemText inset primary="Rapports sur les Congés" />
                                </ListItem>
                                <ListItem button component={Link} to="/reporting/bulletins">
                                    <ListItemText inset primary="Rapports sur les Bulletins de Paie" />
                                </ListItem>
                            </List>
                        </Collapse>
                    </>
                )}

                {userRole === 'ADMIN' && (
                    <>
                        <ListItem button onClick={toggleAdmin}>
                            <ListItemIcon>
                                <Settings />
                            </ListItemIcon>
                            <ListItemText primary="Administration" />
                            {openAdmin ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>

                        <Collapse in={openAdmin} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem button component={Link} to="/admin/createUtilisateurs">
                                    <ListItemText inset primary="Create users" />
                                </ListItem>
                                <ListItem button component={Link} to="/admin/gestionUtilisateur">
                                    <ListItemText inset primary="Manage users" />
                                </ListItem>
                            </List>
                        </Collapse>
                    </>
                )}

                <ListItem button component={Link} to="/usersList">
                    <ListItemIcon>
                        <People />
                    </ListItemIcon>
                    <ListItemText primary="Users list" />
                </ListItem>

                <Divider />

                <ListItem button onClick={handleProfileClick}>
                    <ListItemIcon>
                        <AccountCircle />
                    </ListItemIcon>
                    <ListItemText primary="Profil" />
                </ListItem>

                <Menu
                    anchorEl={anchorEl}
                    open={openProfileMenu}
                    onClose={handleProfileMenuClose}
                >
                    <MenuItem component={Link} to="/profil" onClick={handleProfileMenuClose}>
                        My informations
                    </MenuItem>
                    <MenuItem component={Link} to="/profil/modifier" onClick={handleProfileMenuClose}>
                        Modify profil
                    </MenuItem>
                    <MenuItem onClick={() => {
                        handleProfileMenuClose();
                        handleLogout();
                    }}>
                        Déconnexion
                    </MenuItem>
                </Menu>
            </List>
        </Drawer>
    );
};

export default Header;
