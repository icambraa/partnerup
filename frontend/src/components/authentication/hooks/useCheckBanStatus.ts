import { useCallback } from 'react';

const useCheckBanStatus = () => {
    const checkIfUserIsBanned = useCallback(async (uid: string): Promise<boolean> => {
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
    }, []);

    return checkIfUserIsBanned;
};

export default useCheckBanStatus;
