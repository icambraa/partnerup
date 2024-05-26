import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserProfile as UserProfileInterface } from '../../interfaces/UserProfileInterface';
import logo from "../../assets/logo2-rojo.png";
import { useAuth } from '../../contexts/AuthContext';

const ProfileRegistration: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const emailFromPreviousPage = location.state?.email || '';
    const { currentUser } = useAuth();

    const initialProfileState: UserProfileInterface = {
        nombreusuario: '',
        rolprincipal: '',
        region: 'Europa', // Set default region to "Europa"
        riotnickname: '',
        email: emailFromPreviousPage,
        firebaseUid: currentUser?.uid ?? ''
    };

    const [profile, setProfile] = useState<UserProfileInterface>(initialProfileState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [riotNicknameMessage, setRiotNicknameMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({ ...prevProfile, [name]: value }));
    };

    const handleFocus = () => {
        setRiotNicknameMessage('Asegúrate antes de completar el registro que el Nickname de Riot introducido es el correcto. No está permitido usar el Riot Nickname de otro jugador.');
    };

    const handleBlur = () => {
        setRiotNicknameMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!profile.nombreusuario || !profile.rolprincipal || !profile.riotnickname) {
            setError("Todos los campos son obligatorios.");
            setLoading(false);
            return;
        }

        try {
            const [gameName, tagLine] = profile.riotnickname.split(" ");
            const response = await fetch(`http://localhost:8080/summoner/validate?gameName=${gameName}&tagLine=${tagLine}`);
            const isValid = await response.json();

            if (!isValid) {
                setError("El Nickname de Riot no es válido o el usuario está inactivo.");
                setLoading(false);
                return;
            }

            const savedProfile = await saveProfile(profile);
            console.log("Perfil guardado exitosamente:", savedProfile);
            navigate('/board');
        } catch (error: any) {
            console.error("Error al guardar el perfil:", error);
            setError(error.message || "Ocurrió un error al guardar el perfil. Por favor, inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const saveProfile = async (profileData: UserProfileInterface): Promise<UserProfileInterface> => {
        console.log("Enviando perfil al servidor:", JSON.stringify(profileData));

        const response = await fetch('http://localhost:8080/api/profiles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileData)
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }

        return await response.json();
    };

    return (
        <section className="vw-100 vh-100 d-flex flex-column">
            <div className="container-fluid h-custom flex-grow-1">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-4">
                        <div className="text-center">
                            <img src={logo} className="img-fluid w-75" alt="Logo"/>
                        </div>
                        <div className="card shadow-2-strong border border-primary">
                            <div className="card-body p-5 text-center">
                                <h3 className="mb-3">Completar perfil de usuario</h3>
                                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                                <form onSubmit={handleSubmit}>
                                    <div className="form-outline mb-3">
                                        <input
                                            type="text"
                                            name="nombreusuario"
                                            className="form-control form-control-lg"
                                            value={profile.nombreusuario}
                                            onChange={handleChange}
                                            placeholder="Nombre de Usuario"
                                        />
                                    </div>
                                    <div className="form-outline mb-3">
                                        <select
                                            name="rolprincipal"
                                            className="form-select form-select-lg"
                                            value={profile.rolprincipal}
                                            onChange={handleChange}
                                        >
                                            <option value="">Selecciona un rol</option>
                                            <option value="Top">Top</option>
                                            <option value="Jungle">Jungle</option>
                                            <option value="Mid">Mid</option>
                                            <option value="Adc">Adc</option>
                                        </select>
                                    </div>
                                    <div className="form-outline mb-3">
                                        <input
                                            type="text"
                                            name="riotnickname"
                                            className="form-control form-control-lg"
                                            value={profile.riotnickname}
                                            onChange={handleChange}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                            placeholder="Nickname de Riot"
                                        />
                                        {riotNicknameMessage && (
                                            <div className="alert alert-info mt-2" role="alert">
                                                {riotNicknameMessage}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg btn-block"
                                        disabled={loading}
                                    >
                                        {loading ? 'Guardando...' : 'Confirmar registro'}
                                    </button>
                                </form>
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

export default ProfileRegistration;
