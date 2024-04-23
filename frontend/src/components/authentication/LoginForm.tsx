import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase-auth';
import { signInWithEmailAndPassword } from 'firebase/auth';

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
            navigate('/home');
        } catch (error: any) {
            console.error("Error al iniciar sesión:", error);
            setError(error.message);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <label>
                Email:
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </label>
            <label>
                Contraseña:
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </label>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <button type="submit">Iniciar sesión</button>
        </form>
    );
}

export default LoginForm;