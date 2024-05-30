import React from 'react';
import discordLogo from '/src/assets/discord-logo-blue.png';
import '../BoardStyles.css';

interface CreateEditAnuncioModalProps {
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

const CreateEditAnuncioModal: React.FC<CreateEditAnuncioModalProps> = ({
                                                                           isEditing,
                                                                           showModal,
                                                                           setShowModal,
                                                                           formData,
                                                                           setFormData,
                                                                           handleChange,
                                                                           handleSubmit
                                                                       }) => {
    if (!showModal) return null;

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Validación adicional por si se desea agregar
        if (!formData.riotNickname || !formData.rol || !formData.buscaRol || !formData.rango || !formData.comentario) {
            alert('Todos los campos son obligatorios.');
            return;
        }
        handleSubmit(e);
    };

    return (
        <div className="custom-modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="formModalLabel">{isEditing ? 'Editar Anuncio' : 'Crear anuncio'}</h5>
                    <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleFormSubmit}>
                        <div className="mb-3">
                            <label htmlFor="riotNickname" className="form-label">Riot Nickname</label>
                            <input type="text" className="form-control" id="riotNickname" value={formData.riotNickname} required disabled={isEditing} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="rol" className="form-label">Rol</label>
                            <select className="form-select" id="rol" value={formData.rol} onChange={handleChange} required>
                                <option value="">Seleccione un rol</option>
                                <option value="Top">Top</option>
                                <option value="Mid">Mid</option>
                                <option value="Jungle">Jungle</option>
                                <option value="ADC">ADC</option>
                                <option value="Support">Support</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="buscaRol" className="form-label">Busco rol</label>
                            <select className="form-select" id="buscaRol" value={formData.buscaRol} onChange={handleChange} required>
                                <option value="">Seleccione un rol</option>
                                <option value="Top">Top</option>
                                <option value="Mid">Mid</option>
                                <option value="Jungle">Jungle</option>
                                <option value="ADC">ADC</option>
                                <option value="Support">Support</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="rango" className="form-label">Rango</label>
                            <select className="form-select" id="rango" value={formData.rango} onChange={handleChange} required>
                                <option value="">Seleccione un rango</option>
                                <option value="Hierro">Hierro</option>
                                <option value="Bronce">Bronce</option>
                                <option value="Plata">Plata</option>
                                <option value="Oro">Oro</option>
                                <option value="Platino">Platino</option>
                                <option value="Diamante">Diamante</option>
                                <option value="Master">Master</option>
                                <option value="Grandmaster">Grandmaster</option>
                                <option value="Challenger">Challenger</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="comentario" className="form-label">Comentario</label>
                            <textarea
                                className="form-control"
                                id="comentario"
                                rows={3}
                                value={formData.comentario}
                                onChange={handleChange}
                                required
                                maxLength={80}
                            ></textarea>
                        </div>
                        <div className="mb-2">
                            <div>
                                <img src={discordLogo} alt="Discord Logo" />
                            </div>
                        </div>
                        <div className="mb-4">
                            <p className="form-text">
                                ¡Anúnciate en PartnerUP y únete a la comunidad de jugadores! Al crear un anuncio, se generará automáticamente un canal privado en nuestro servidor de Discord, exclusivo para ti y tu futuro compañero.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary modal-button" onClick={() => setShowModal(false)}>
                                Cerrar
                            </button>
                            <button type="submit" className="btn btn-primary modal-button">Enviar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateEditAnuncioModal;
