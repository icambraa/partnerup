import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserProfile } from '../../interfaces/UserProfileInterface';

const UserProfileComponent: React.FC = () => {
    const { currentUser } = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (currentUser && currentUser.email) {
            fetch(`http://localhost:8080/api/profiles/by-email?email=${encodeURIComponent(currentUser.email)}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch user profile');
                    }
                    return response.json();
                })
                .then(data => setUserProfile(data))
                .catch(error => {
                    console.error('Error fetching user data:', error);
                    setError(error.message);
                });
        }
    }, [currentUser]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!userProfile) {
        return <div>Loading...</div>;
    }

    return (
        <div className="content">
            <h1>{userProfile.nombreusuario}</h1>
            <p>Email: {userProfile.email}</p>
            <p>Rango Actual: {userProfile.rangoactual}</p>
            <p>Rol Principal: {userProfile.rolprincipal}</p>
            <p>Región: {userProfile.region}</p>
            <p>Nickname Riot: {userProfile.riotnickname}</p>
        </div>
    );
};

export default UserProfileComponent;