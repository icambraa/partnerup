import React from 'react';

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

    return (
        <div className="custom-modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="formModalLabel">{isEditing ? 'Editar Anuncio' : 'Crear anuncio'}</h5>
                    <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="riotNickname" className="form-label">Riot Nickname</label>
                            <input type="text" className="form-control" id="riotNickname" value={formData.riotNickname} disabled />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="rol" className="form-label">Rol</label>
                            <select className="form-select" id="rol" value={formData.rol} onChange={handleChange}>
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
                            <select className="form-select" id="buscaRol" value={formData.buscaRol} onChange={handleChange}>
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
                            <select className="form-select" id="rango" value={formData.rango} onChange={handleChange}>
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
                            <textarea className="form-control" id="comentario" rows={3} value={formData.comentario} onChange={handleChange}></textarea>
                        </div>
                        <div className="mb-2" style={{ textAlign: 'center', marginTop: '40px' }}>
                            <div style={{ display: 'inline-block' }}>
                                <img src="/src/assets/discord-logo-blue.png" alt="Discord Logo" style={{ width: '300px', marginBottom: '10px' }} />
                            </div>
                        </div>
                        <div className="mb-4" style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '10px' }}>
                            <p className="form-text" style={{ textAlign: 'left', margin: '0' }}>
                                ¡Anúnciate en PartnerUP y únete a la comunidad de jugadores! Al crear un anuncio, se generará automáticamente un canal privado en nuestro servidor de Discord, exclusivo para ti y tu futuro compañero.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ marginRight: '10px' }}>
                                Cerrar
                            </button>
                            <button type="submit" className="btn btn-primary">Enviar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateEditAnuncioModal;
