import React, { useState } from 'react';
import { auth } from '../../firebase-auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import logo3 from '../../assets/logo3.png';

const RegisterForm: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Validar si las contraseñas coinciden
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("Usuario registrado:", userCredential.user);
            // Limpiar los campos y errores después de un registro exitoso
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setError('');
        } catch (error) {
            console.error("Error en el registro:", error);
            setError(error.message);
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

                                    {error && <p style={{ color: 'red' }}>{error}</p>}

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg btn-block"
                                    >
                                        Registrarse
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="full-width d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
                <div className="text-white mb-3 mb-md-0">
                    Copyright © 2024. All rights reserved.
                </div>
            </div>
        </section>
    );
}

export default RegisterForm;
