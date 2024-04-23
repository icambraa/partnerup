import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div>
            <h1>Bienvenido a la página principal</h1>
            <Link to="/login">Login</Link>
            <Link to="/register">Registro</Link>
        </div>
    );
}

export default Home;