import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './components/welcome/Welcome.tsx';
import Navbar from './components/layout/Navbar.tsx';
import Board from './components/inside/Board.tsx';
import UserProfile from './components/inside/UserProfile.tsx';
import LoginForm from './components/authentication/LoginForm';
import RegistrationForm from './components/authentication/RegistrationForm.tsx';
import ProfileRegistration from './components/authentication/ProfileRegistration.tsx';
import MessagesPage from './components/inside/Chat/MessagesPage.tsx';
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
                    <Route path="/messages" element={<>
                        <Navbar />
                        <MessagesPage />
                    </>} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;