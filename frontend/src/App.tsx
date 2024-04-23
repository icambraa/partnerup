import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import LoginForm from './components/authentication/LoginForm';
import RegisterForm from './components/authentication/RegisterForm';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;