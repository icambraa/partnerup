import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase-auth';
import {getAdditionalUserInfo, signInWithEmailAndPassword} from 'firebase/auth';
import logo from '../../assets/logo2-naranja.png';
import "bootstrap-icons/font/bootstrap-icons.css"
import { GoogleAuthProvider, signInWithPopup, GithubAuthProvider } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("Usuario logueado");
            navigate('/board');
        } catch (error: unknown) {
            if (error instanceof FirebaseError) { // Chequeo específico para errores de Firebase
                console.error("Error al iniciar sesión:", error.message);
                setError(error.message);
            } else {
                console.error("Error al iniciar sesión:", error);
                setError("Error desconocido al intentar iniciar sesión. Por favor, intente nuevamente.");
            }
        }
    };
    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const details = getAdditionalUserInfo(result);

            if (details && details.isNewUser) {
                console.log('nuevo usuario registrado con Google:', result.user);
                navigate('/create-profile', { state: { email: result.user.email } });
            } else {
                console.log('usuario existente logueado con Google:', result.user);
                navigate('/board');
            }
        } catch (error) {
            console.error('error al iniciar sesión con Google:', error);
        }
    };

    const signInWithGithub = async () => {
        const provider = new GithubAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const details = getAdditionalUserInfo(result);

            if (details && details.isNewUser) {
                console.log("nuevo usuario registrado con GitHub:", result.user);
                navigate('/create-profile', { state: { email: result.user.email } });
            } else {
                console.log("usuario existente logueado con GitHub:", result.user);
                navigate('/board');
            }
        } catch (error) {
            console.error("error al iniciar sesión con GitHub:", error);
        }
    };



    return (
        <section className="vw-100 vh-100">
            <div className="container-fluid h-custom">
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
                                    <div className="d-flex justify-content-end">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg btn-block"
                                        >
                                            Iniciar sesión
                                        </button>
                                    </div>

                                    {error && <p style={{ color: 'red' }}>{error}</p>}

                                </form>

                                <hr className="my-4"/>

                                <div className="text-center">
                                    <p>O prefieres iniciar sesión con...</p>

                                    <button
                                        type="button"
                                        className="btn btn-link btn-floating mx-1"
                                        onClick={signInWithGoogle}
                                    >
                                        <i className="bi bi-google"></i>
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-link btn-floating mx-1"
                                        onClick={signInWithGithub}
                                    >
                                        <i className="bi bi-github"></i>
                                    </button>
                                </div>
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

export default LoginForm;