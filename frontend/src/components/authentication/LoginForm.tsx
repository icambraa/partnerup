import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase-auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import logo3 from '../../assets/logo3.png';
import "bootstrap-icons/font/bootstrap-icons.css"
import { GoogleAuthProvider, signInWithPopup, GithubAuthProvider } from 'firebase/auth';


const LoginForm: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');  // Estado para manejar los mensajes de error
    const navigate = useNavigate();  // Hook para la navegación

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("Usuario logueado");
            navigate('/board');
        } catch (error: any) {
            console.error("Error al iniciar sesión:", error);
            setError(error.message);
        }
    };

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            console.log('Usuario logueado con Google:', result.user);
            navigate('/board');
        } catch (error) {
            console.error('Error al iniciar sesión con Google:', error);
        }
    };

    const signInWithGithub = async () => {
        const provider = new GithubAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            console.log("Usuario logueado con GitHub:", result.user);
            navigate('/board');
        } catch (error) {
            console.error("Error al iniciar sesión con GitHub:", error);
        }
    };



    return (
        <section className="vw-100 vh-100">
            <div className="container-fluid h-custom">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-4">
                        <div className="text-center">
                            <img src={logo3} className="img-fluid"/>
                        </div>

                        <div className="card shadow-2-strong">
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
                                            placeholder="Password"
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
                                </form>

                                <hr className="my-4"/>

                                <div className="text-center">
                                    <p>O prefieres inciciar sesión con...</p>

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
                className="full-width d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
                <div className="text-white mb-3 mb-md-0">
                    Copyright © 2024. All rights reserved.
                </div>
            </div>
        </section>
    );
}

export default LoginForm;