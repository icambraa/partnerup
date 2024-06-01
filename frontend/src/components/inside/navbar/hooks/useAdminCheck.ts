import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { UserProfile } from '../../../../interfaces/UserProfileInterface';

const useAdminCheck = () => {
    const { currentUser } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchUserProfileByFirebaseUid = async (firebaseUid: string): Promise<UserProfile | undefined> => {
            try {
                const response = await fetch(`http://localhost:8080/api/profiles/by-firebaseUid?firebaseUid=${firebaseUid}`);
                if (response.ok) {
                    return await response.json();
                } else {
                    throw new Error('Failed to fetch user profile');
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        if (currentUser) {
            fetchUserProfileByFirebaseUid(currentUser.uid).then((userProfile: UserProfile | undefined) => {
                if (userProfile) {
                    setIsAdmin(userProfile.admin);
                }
            });
        }
    }, [currentUser]);

    return { isAdmin };
};

export default useAdminCheck;
