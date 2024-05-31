import { useAuth } from '../../../../contexts/AuthContext.tsx';
import { Anuncio } from '../../../../interfaces/AnuncioInterface.ts';

const useHandleSubmit = (
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    setShowSuccessModal: React.Dispatch<React.SetStateAction<boolean>>,
    setChannelLink: React.Dispatch<React.SetStateAction<string>>,
    fetchAnuncios: () => void,
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>,
    setSelectedAnuncio: React.Dispatch<React.SetStateAction<Anuncio | null>>
) => {
    const { currentUser } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, formData: any, isEditing: boolean, selectedAnuncio: Anuncio | null) => {
        e.preventDefault();

        if (currentUser) {
            const formDataWithUserId = {
                ...formData,
                userId: currentUser.uid
            };

            try {
                let response;
                if (isEditing && selectedAnuncio) {
                    response = await fetch(`http://localhost:8080/api/anuncios/${selectedAnuncio.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formDataWithUserId)
                    });
                } else {
                    response = await fetch('http://localhost:8080/api/anuncios', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formDataWithUserId)
                    });
                }

                if (response.ok) {
                    const anuncio = await response.json();

                    if (!isEditing) {
                        try {
                            const discordResponse = await fetch('http://localhost:8080/api/discord/create-channel', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(anuncio)
                            });

                            if (discordResponse.ok) {
                                const discordData = await discordResponse.json();
                                console.log(`Channel created: ${discordData.channelLink}`);

                                await fetch(`http://localhost:8080/api/anuncios/${anuncio.id}`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ ...anuncio, discordChannelLink: discordData.channelLink })
                                });

                                setChannelLink(discordData.channelLink);
                                setShowModal(false);
                                setShowSuccessModal(true);
                            } else {
                                const discordError = await discordResponse.text();
                                console.error('Error creating Discord channel:', discordError);
                            }
                        } catch (error) {
                            console.error('Error during Discord channel creation:', error);
                        }
                    }

                    fetchAnuncios();
                    setIsEditing(false);
                    setSelectedAnuncio(null);
                } else {
                    const errorText = await response.text();
                    console.error(`Error al ${isEditing ? 'editar' : 'crear'} el anuncio:`, errorText);
                }
            } catch (error) {
                console.error('Error al enviar el formulario', error);
            }
        } else {
            console.error('No hay usuario autenticado');
        }
    };

    return handleSubmit;
};

export default useHandleSubmit;
