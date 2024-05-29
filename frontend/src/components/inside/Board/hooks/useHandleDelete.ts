import { useAuth } from '../../../../contexts/AuthContext.tsx';

const useHandleDelete = (setAnuncios: React.Dispatch<React.SetStateAction<any>>, fetchAnuncios: () => void) => {
    const { currentUser } = useAuth();

    return async (id: number) => {
        if (!currentUser || !currentUser.uid) {
            console.error('Error: No hay usuario autenticado.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/profiles/by-firebaseUid?firebaseUid=${currentUser.uid}`);
            const profile = await response.json();
            const isAdmin = profile.admin;

            const deleteResponse = await fetch(`http://localhost:8080/api/anuncios/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'userId': currentUser.uid,
                    'isAdmin': isAdmin ? 'true' : 'false'
                }
            });

            if (deleteResponse.ok) {
                console.log('Anuncio borrado con éxito');
                fetchAnuncios();
            } else {
                throw new Error('Error al borrar el anuncio');
            }
        } catch (error) {
            console.error('Error al borrar el anuncio', error);
        }
    };
};

export default useHandleDelete;
