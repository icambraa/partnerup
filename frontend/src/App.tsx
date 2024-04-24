import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './components/welcome/Welcome.tsx';
import Board from './components/board/Board.tsx';
import LoginForm from './components/authentication/LoginForm';
import RegistrationForm from './components/authentication/RegistrationForm.tsx';
import ProfileRegistration from './components/authentication/ProfileRegistration.tsx';
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
                    <Route path="/board" element={<Board />} />
                    <Route path="/create-profile" element={<ProfileRegistration />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;