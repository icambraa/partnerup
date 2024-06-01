import { useState, useCallback } from 'react';
import { Anuncio } from '../../../../interfaces/AnuncioInterface';

const useAnuncioForm = (initialFormData: any) => {
    const [formData, setFormData] = useState(initialFormData);
    const [selectedAnuncio, setSelectedAnuncio] = useState<Anuncio | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = useCallback((anuncio: Anuncio) => {
        setFormData({
            riotNickname: anuncio.riotNickname,
            rol: anuncio.rol,
            buscaRol: anuncio.buscaRol,
            rango: anuncio.rango,
            comentario: anuncio.comentario,
        });
        setSelectedAnuncio(anuncio);
        setIsEditing(true);
    }, []);

    return {
        formData,
        setFormData,
        selectedAnuncio,
        setSelectedAnuncio,
        isEditing,
        setIsEditing,
        handleEdit
    };
};

export default useAnuncioForm;
