import { useNavigate } from 'react-router-dom';
import { auth } from '../../../../firebase-auth.ts';

const useLogout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return { handleLogout };
};

export default useLogout;
