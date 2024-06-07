import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Welcome from './components/Welcome/Welcome';
import Navbar from './components/inside/navbar/Navbar';
import Board from './components/inside/Board/Board.tsx';
import UserProfile from './components/inside/UserProfile/UserProfile.tsx';
import LoginForm from './components/authentication/forms/LoginForm.tsx';
import RegistrationForm from './components/authentication/forms/RegistrationForm.tsx';
import ProfileRegistration from './components/authentication/forms/ProfileRegistration.tsx';
import AdminPanel from './components/admin/AdminPanel';
import ReportsView from './components/admin/ReportsView';
import { AuthProvider } from './contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/registration" element={<RegistrationForm />} />
                    <Route path="/create-profile" element={<ProfileRegistration />} />
                    <Route path="/board" element={<WithNavbar><Board /></WithNavbar>} />
                    <Route path="/profile" element={<WithNavbar><UserProfile /></WithNavbar>} />
                    <Route path="/profile/:riotnickname" element={<WithNavbar><UserProfileWrapper /></WithNavbar>} />
                    <Route path="/admin-panel" element={<WithNavbar><AdminPanel /></WithNavbar>} />
                    <Route path="/admin-panel/reports" element={<WithNavbar><ReportsView /></WithNavbar>} /> {/* Nueva ruta */}
                </Routes>
            </AuthProvider>
        </Router>
    );
};

const WithNavbar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <>
        <Navbar />
        {children}
    </>
);

const UserProfileWrapper: React.FC = () => {
    const { riotnickname } = useParams<{ riotnickname: string }>();
    return <UserProfile riotnickname={riotnickname} />;
};

export default App;
