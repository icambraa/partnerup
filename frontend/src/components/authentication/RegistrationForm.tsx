import React, { useState } from 'react';
import { auth } from '../../firebase-auth';
import {createUserWithEmailAndPassword, GithubAuthProvider, GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo} from 'firebase/auth';
import logo from '../../assets/logo2-rojo.png';
import {Link, useNavigate} from 'react-router-dom';

const RegistrationForm: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const navigate = useNavigate();  // Hook para la navegación

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("usuario registrado:", userCredential.user);
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setError('');

            navigate('/create-profile', { state: { email: userCredential.user.email } });
        } catch (error) {
            if (error instanceof Error) {
                console.error("error en el registro:", error);
                setError(error.message);
            } else {
                console.error("Error en el registro:", error);
                setError("Error desconocido ocurrió durante el registro");
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
        <section className="vw-100 vh-100 d-flex flex-column">
            <div className="container-fluid h-custom flex-grow-1">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-4">
                        <div className="text-center">
                            <img src={logo} className="img-fluid w-75"/>
                        </div>

                        <div className="card shadow-2-strong border border-primary">
                            <div className="card-body p-5 text-center">

                                <h3 className="mb-3">Registro</h3>

                                <form onSubmit={handleRegister}>
                                    <div className="form-outline mb-3">
                                        <input
                                            type="email"
                                            id="typeEmailX-2"
                                            className="form-control form-control-lg"
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
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
                                            required
                                        />
                                        <label className="form-label visually-hidden">Contraseña</label>
                                    </div>

                                    <div className="form-outline mb-3">
                                        <input
                                            type="password"
                                            id="typeConfirmPasswordX-2"
                                            className="form-control form-control-lg"
                                            placeholder="Confirmar Contraseña"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                        <label className="form-label visually-hidden">Confirmar Contraseña</label>
                                    </div>

                                    {error && <p style={{color: 'red'}}>{error}</p>}

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg btn-block"
                                    >
                                        Registrarse
                                    </button>

                                    <div className="text-end mb-3 d-flex justify-content-center"
                                         style={{marginTop: '35px'}}>
                                        <p className="letraPeq">
                                            ¿Ya tienes una cuenta? <Link to="/login"
                                                                         className="text-primary">Haz clic
                                            aquí</Link> para logearte.
                                        </p>
                                    </div>
                                </form>
                                <hr className="my-4"/>

                                <div className="text-center">
                                    <p>O prefieres registrarte con...</p>

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
            <footer className="bg-custom text-white text-center py-4">
                <div>
                    Copyright © 2024. Partner UP! - Todos los derechos reservados.
                </div>
            </footer>
        </section>
    );
}

export default RegistrationForm;
