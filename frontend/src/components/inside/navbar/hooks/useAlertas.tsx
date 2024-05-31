import { useState, useEffect } from 'react';
import { Alerta } from '../../../../interfaces/AlertInterface.ts';
import { useAuth } from '../../../../contexts/AuthContext';

const useAlertas = () => {
    const { currentUser } = useAuth();
    const [alertas, setAlertas] = useState<Alerta[]>([]);
    const [showAlertasModal, setShowAlertasModal] = useState(false);

    const fetchUnreadAlertas = async (userId: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/alertas/unread-by-user/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setAlertas(data);
            } else {
                throw new Error('Failed to fetch user unread alertas');
            }
        } catch (error) {
            console.error('Error fetching user unread alertas:', error);
        }
    };

    const markAlertasAsRead = async (userId: string) => {
        try {
            await fetch(`http://localhost:8080/api/alertas/mark-as-read/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error('Error marking alertas as read:', error);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchUnreadAlertas(currentUser.uid);
        }
    }, [currentUser]);

    const handleAlertIconClick = () => {
        setShowAlertasModal(true);
    };

    const handleAlertasModalClose = async () => {
        setShowAlertasModal(false);
        if (currentUser) {
            await markAlertasAsRead(currentUser.uid);
            fetchUnreadAlertas(currentUser.uid);
        }
    };

    return {
        alertas,
        showAlertasModal,
        handleAlertIconClick,
        handleAlertasModalClose,
    };
};

export default useAlertas;