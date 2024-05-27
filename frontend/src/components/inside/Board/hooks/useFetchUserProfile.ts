import { useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext.tsx';

const useFetchUserProfile = (setFormData: React.Dispatch<React.SetStateAction<any>>) => {
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (currentUser) {
                try {
                    const response = await fetch(`http://localhost:8080/api/profiles/by-firebaseUid?firebaseUid=${currentUser.uid}`);
                    if (response.ok) {
                        const profile = await response.json();
                        setFormData((prevFormData: any) => ({
                            ...prevFormData,
                            riotNickname: profile.riotnickname,
                            rol: profile.rolprincipal
                        }));
                    } else {
                        console.error('Error fetching user profile');
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            }
        };

        fetchUserProfile();
    }, [currentUser, setFormData]);
};

export default useFetchUserProfile;
