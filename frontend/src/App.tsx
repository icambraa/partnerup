import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Welcome from './components/welcome/Welcome';
import Navbar from './components/layout/Navbar';
import Board from './components/inside/Board';
import UserProfile from './components/inside/UserProfile';
import LoginForm from './components/authentication/LoginForm';
import RegistrationForm from './components/authentication/RegistrationForm';
import ProfileRegistration from './components/authentication/ProfileRegistration';
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
                    <Route path="/board" element={<>
                        <Navbar />
                        <Board />
                    </>} />
                    <Route path="/profile" element={<>
                        <Navbar />
                        <UserProfile />
                    </>} />
                    <Route path="/profile/:riotnickname" element={<>
                        <Navbar />
                        <UserProfileWrapper />
                    </>} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

const UserProfileWrapper: React.FC = () => {
    const { riotnickname } = useParams<{ riotnickname: string }>();
    return <UserProfile riotnickname={riotnickname} />;
};

export default App;