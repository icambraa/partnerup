import React from 'react';
import {GoogleAuthProvider, signInWithPopup, GithubAuthProvider, getAdditionalUserInfo} from 'firebase/auth';
import { auth } from '../../../firebase-auth.ts';
import { useNavigate } from 'react-router-dom';

const AuthProviders: React.FC = () => {
    const navigate = useNavigate();

    const checkIfUserIsBanned = async (uid: string): Promise<boolean> => {
        try {
            const response = await fetch(`http://localhost:8080/api/profiles/is-banned?firebaseUid=${uid}`);
            if (!response.ok) {
                throw new Error('Failed to check ban status');
            }
            const isBanned = await response.json();
            return isBanned;
        } catch (error) {
            console.error('Error checking ban status:', error);
            return false;
        }
    };

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const details = getAdditionalUserInfo(result);
            const user = result.user;

            const isBanned = await checkIfUserIsBanned(user.uid);
            if (isBanned) {
                alert('Tu cuenta está baneada.');
                return;
            }

            if (details && details.isNewUser) {
                console.log('nuevo usuario registrado con Google:', user);
                navigate('/create-profile', { state: { email: user.email } });
            } else {
                console.log('usuario existente logueado con Google:', user);
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
            const user = result.user;

            const isBanned = await checkIfUserIsBanned(user.uid);
            if (isBanned) {
                alert('Tu cuenta está baneada. Por favor, contacta con soporte.');
                return;
            }

            if (details && details.isNewUser) {
                console.log("nuevo usuario registrado con GitHub:", user);
                navigate('/create-profile', { state: { email: user.email } });
            } else {
                console.log("usuario existente logueado con GitHub:", user);
                navigate('/board');
            }
        } catch (error) {
            console.error("error al iniciar sesión con GitHub:", error);
        }
    };

    return (
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
    );
};

export default AuthProviders;
