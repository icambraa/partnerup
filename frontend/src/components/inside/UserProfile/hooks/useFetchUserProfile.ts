import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { UserProfile as UserProfileInterface } from '../../../../interfaces/UserProfileInterface';

const fetchUserProfile = async (email: string) => {
    const response = await fetch(`http://localhost:8080/api/profiles/by-email?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
        throw new Error('Failed to fetch user profile');
    }
    return response.json();
};

export const useFetchUserProfile = (riotnickname?: string) => {
    const { currentUser } = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfileInterface | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadUserProfile = async () => {
            setLoading(true);
            try {
                if (riotnickname) {
                    setUserProfile({ riotnickname } as UserProfileInterface);
                } else if (currentUser?.email) {
                    const data = await fetchUserProfile(currentUser.email);
                    setUserProfile(data);
                }
            } catch (error: any) {
                console.error('Error fetching user data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadUserProfile();
    }, [currentUser, riotnickname]);

    return { userProfile, error, loading };
};