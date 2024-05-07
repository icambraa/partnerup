import React from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css';
import logo from '../../assets/logo2-rojo.png';

const Welcome: React.FC = () => {
    return (

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
                                <Link to="" className="btn btn-secondary mx-2">¿Qué es Partner UP!?</Link>
                            </div>
                            <div className="text-start mt-2">
                                <p className="letraPeq">¿Ya tienes una cuenta? <Link to="/login"
                                                                                     className="text-primary">Haz clic
                                    aquí</Link> para iniciar sesión.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="full-width d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-custom">
                <div className="text-white mb-3 mb-md-0">
                    Copyright © 2024. Partner UP! - Todos los derechos reservados.
                </div>
            </div>
        </section>
    );
}

export default Welcome;