import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { Grid } from '@mui/material';
import Header from './Header/Header';
import HolidayForm from './Holiday/HolidayForm';
import UserForm from './User/UserForm';
import HolidaysList from './Holiday/HolidaysList';
import HolidayManagement from './Holiday/HolidayManagement';
import UserInfos from './User/UserInfos';
import ModifyInfos from './User/ModifyInfos';
import Login from './Login';
import MyBulletins from './Bulletins/MyBulletins';
import UsersManagement from './User/UsersManagement';
import UsersList from './User/UsersList';
import { AuthProvider, useAuth } from './User/AuthContext';
import CreateBulletins from './Bulletins/CreateBulletins';
import Dashboard from './User/Dashboard';

const AppContent = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';  // Make sure the login route is consistent
    const isAdmin = true;
    const { auth } = useAuth();
    const authHeader = `Basic ${btoa(`${auth.username}:${auth.password}`)}`;

    return (
        <Grid container>
            {/* Conditionally render the Header only if it's not the login page */}
            {!isLoginPage && (
                <Grid item xs={2}>  {/* Sidebar width */}
                    <Header isAdmin={isAdmin} />
                </Grid>
            )}
            <Grid item xs={isLoginPage ? 12 : 10}>  {/* Adjust the content width */}
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />  {/* Redirect to /login */}
                    <Route path="/login" element={<Login />} />  {/* Login page */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/conges/demande" element={<HolidayForm />} />
                    <Route path="/admin/createUtilisateurs" element={<UserForm />} />
                    <Route path="/conges/historique" element={<HolidaysList />} />
                    <Route path="/conges/gestion" element={<HolidayManagement />} />
                    <Route path="/profil" element={<UserInfos />} />
                    <Route path="/profil/modifier" element={<ModifyInfos />} />
                    <Route path="/bulletins/mesBulletins" element={<MyBulletins />} />
                    <Route path="/bulletins/creerBulletins" element={<CreateBulletins />} />
                    <Route path="/admin/gestionUtilisateur" element={<UsersManagement />} />
                    <Route path="/usersList" element={<UsersList />} />
                </Routes>
            </Grid>
        </Grid>
    );
};

const App = () => (
    <AuthProvider>
        <Router>
            <AppContent />
        </Router>
    </AuthProvider>
);

export default App;

