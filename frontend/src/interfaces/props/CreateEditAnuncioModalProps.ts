export interface CreateEditAnuncioModalProps {
    isEditing: boolean;
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    formData: {
        riotNickname: string;
        rol: string;
        buscaRol: string;
        rango: string;
        comentario: string;
    };
    setFormData: (formData: any) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}
