import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase-auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import logo from '../../../assets/logo2-rojo.png';
import "bootstrap-icons/font/bootstrap-icons.css";
import { FirebaseError } from 'firebase/app';
import AuthProviders from '../providers/AuthProviders';
import useCheckBanStatus from '../hooks/useCheckBanStatus';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();
    const checkIfUserIsBanned = useCheckBanStatus();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const isBanned = await checkIfUserIsBanned(user.uid);
            if (isBanned) {
                setError('Tu cuenta está baneada.');
                return;
            }

            console.log("Usuario logueado");
            navigate('/board');
        } catch (error: unknown) {
            if (error instanceof FirebaseError) {
                console.error("Error al iniciar sesión:", error.message);
                setError(error.message);
            } else {
                console.error("Error al iniciar sesión:", error);
                setError("Error desconocido al intentar iniciar sesión. Por favor, intente nuevamente.");
            }
        }
    };

    return (
        <section className="vw-100 vh-100 d-flex flex-column">
            <div className="container-fluid h-custom flex-grow-1">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-4">
                        <div className="text-center">
                            <img src={logo} className="img-fluid w-75"/>
                        </div>
                        <div className="card shadow-2-strong border border-primary">
                            <div className="card-body p-5 text-center">
                                <h3 className="mb-3">Iniciar sesión</h3>
                                <form onSubmit={handleLogin}>
                                    <div className="form-outline mb-3">
                                        <input
                                            type="email"
                                            id="typeEmailX-2"
                                            className="form-control form-control-lg"
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <label className="form-label visually-hidden">Email</label>
                                    </div>
                                    <div className="form-outline mb-3">
                                        <input
                                            type="password"
                                            id="typePasswordX-2"
                                            className="form-control form-control-lg"
                                            placeholder="Contraseña"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <label className="form-label visually-hidden">Password</label>
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg btn-block"
                                        >
                                            Iniciar sesión
                                        </button>
                                    </div>

                                    {error && <p style={{color: 'red'}}>{error}</p>}

                                    <div className="text-end mb-3 d-flex justify-content-center" style={{marginTop: '35px'}}>
                                        <p className="letraPeq">
                                            ¿Aún no tienes una cuenta? <Link to="/registration" className="text-primary">Haz clic aquí</Link> para registrarte.
                                        </p>
                                    </div>
                                </form>

                                <hr className="my-4"/>

                                <AuthProviders />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="bg-custom text-white text-center py-4">
                <div>
                    Copyright © 2024. Partner UP! - Todos los derechos reservados.
                </div>
            </footer>
        </section>
    );
};

export default LoginForm;
