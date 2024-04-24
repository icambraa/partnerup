import React from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css';
import logo from '../../assets/logo2.png';

const Welcome: React.FC = () => {
    return (
        // <div className="container mt-5">
        //     <h1 className="mb-3">Bienvenido a la página principal</h1>
        //     <div className="d-flex flex-column">
        //         <Link to="/login" className="btn btn-primary mb-2">Login</Link>
        //         <Link to="/register" className="btn btn-secondary">Registro</Link>
        //     </div>
        // </div>

        <section className="vw-100 vh-100">
            <div className="container-fluid h-custom">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-md-9 col-lg-6 col-xl-6">
                        <img src={logo} className="img-fluid" alt="Sample image"/>
                    </div>
                    <div className="col-md-6 col-lg-4 col-xl-3">
                        <div className="container mt-5">
                            <div className=" flex-row justify-content-center">
                                <Link to="/registration" className="btn btn-primary">Registrarse</Link>
                                <Link to="/registration" className="btn btn-secondary mx-2">¿Qué es Partner UP!?</Link>
                            </div>
                            <div className="text-start mt-2">
                                <p className="letraPeq">¿Ya tienes una cuenta? <Link to="/login" className="text-primary">Haz clic
                                    aquí</Link> para iniciar sesión.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="full-width d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
                <div className="text-white mb-3 mb-md-0">
                    Copyright © 2024. All rights reserved.
                </div>
            </div>
        </section>
    );
}

export default Welcome;