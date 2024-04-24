import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserProfile as UserProfileInterface } from '../../interfaces/UserProfileInterface.ts';
import logo from "../../assets/logo2-naranja.png";

const ProfileRegistration: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const emailFromPreviousPage = location.state?.email || '';

    const initialProfileState: UserProfileInterface = {
        nombreusuario: '',
        rangoactual: '',
        rolprincipal: '',
        region: '',
        riotnickname: '',
        email: emailFromPreviousPage
    };

    const [profile, setProfile] = useState<UserProfileInterface>(initialProfileState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.value;
        const name = e.target.name;
        setProfile({ ...profile, [name]: value });
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const savedProfile = await saveProfile(profile);
            console.log("perfil guardado exitosamente:", savedProfile);
            navigate('/board');
        } catch (error) {
            console.error("error al guardar el perfil:", error);
        }
    };

    const saveProfile = async (profileData: UserProfileInterface): Promise<UserProfileInterface> => {
        console.log("enviando perfil al servidor:", JSON.stringify(profileData));

        const response = await fetch('http://localhost:8080/api/profiles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileData)
        });

        if (!response.ok) {
            throw new Error('error al guardar el perfil: ' + response.statusText);
        }

        return await response.json();
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
                                <h3 className="mb-3">Completar perfil de usuario</h3>
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
                                            name="rangoactual"
                                            className="form-select form-select-lg"
                                            value={profile.rangoactual}
                                            onChange={handleChange}
                                        >
                                            <option value="">Selecciona un rango</option>
                                            <option value="Hierro">Hierro</option>
                                            <option value="Bronce">Bronce</option>
                                            <option value="Plata">Plata</option>
                                            <option value="Oro">Oro</option>
                                            <option value="Platino">Platino</option>
                                            <option value="Diamante">Diamante</option>
                                            <option value="Ascendente">Ascendente</option>
                                            <option value="Inmortal">Inmortal</option>
                                            <option value="Radiante">Radiante</option>
                                        </select>
                                    </div>
                                    <div className="form-outline mb-3">
                                        <select
                                            name="rolprincipal"
                                            className="form-select form-select-lg"
                                            value={profile.rolprincipal}
                                            onChange={handleChange}
                                        >
                                            <option value="">Selecciona un rol</option>
                                            <option value="Iniciador">Iniciador</option>
                                            <option value="Duelista">Duelista</option>
                                            <option value="Controlador">Controlador</option>
                                            <option value="Centinela">Centinela</option>

                                        </select>
                                    </div>
                                    <div className="form-outline mb-3">
                                        <select
                                            name="region"
                                            className="form-select form-select-lg"
                                            value={profile.region}
                                            onChange={handleChange}
                                        >
                                            <option value="">Selecciona una región</option>
                                            <option value="America del norte">America del norte</option>
                                            <option value="America Latina">America Latina</option>
                                            <option value="Europa">Europa</option>
                                            <option value="Brasil">Brasil</option>
                                            <option value="Corea del sur">Corea del sur</option>
                                            <option value="Sudeste asiático">Sudeste asiático</option>
                                            <option value="China">China</option>
                                            <option value="Japón">Japón</option>
                                            <option value="Oceanía">Oceanía</option>

                                        </select>
                                    </div>
                                    <div className="form-outline mb-3">
                                        <input
                                            type="text"
                                            name="riotnickname"
                                            className="form-control form-control-lg"
                                            value={profile.riotnickname}
                                            onChange={handleChange}
                                            placeholder="Nickname de Riot"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg btn-block"
                                    >
                                        Confirmar registro
                                    </button>
                                </form>
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
};

export default ProfileRegistration;