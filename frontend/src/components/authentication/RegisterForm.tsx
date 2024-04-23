import React, { useState } from 'react';
import { auth } from '../../firebase-auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const RegisterForm: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            console.error("Las contraseñas no coinciden.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("Usuario registrado:", userCredential.user);
        } catch (error) {
            console.error("Error en el registro:", error);
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <h1>Registro</h1>
            <label>
                Email:
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label>
                Contraseña:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
            <label>
                Confirmar Contraseña:
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </label>
            <button type="submit">Registrarse</button>
        </form>
    );
}

export default RegisterForm;
