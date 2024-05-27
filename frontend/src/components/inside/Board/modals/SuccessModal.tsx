import React from 'react';
import { Button } from 'react-bootstrap';

interface SuccessModalProps {
    showSuccessModal: boolean;
    setShowSuccessModal: (show: boolean) => void;
    channelLink: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
                                                       showSuccessModal,
                                                       setShowSuccessModal,
                                                       channelLink
                                                   }) => {
    if (!showSuccessModal) return null;

    return (
        <div className="custom-modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Canal del Anuncio</h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowSuccessModal(false)}
                        aria-label="Close"
                        style={{ marginBottom: '10px' }}
                    ></button>
                </div>
                <div className="modal-body" style={{ marginTop: '20px' }}>
                    ¡Tu anuncio ha sido publicado con éxito! 🎉<br /><br />
                    Se ha creado automáticamente un canal en nuestro servidor de Discord PartnerUP!<br /><br />
                    Puedes acceder al canal utilizando el siguiente enlace:<br /><br />
                    <div style={{ textAlign: 'center' }}>
                        <a href={channelLink} target="_blank" rel="noopener noreferrer">
                            Enlace al canal de Discord
                        </a>
                    </div>
                    <br />
                    Por favor, espera a que alguien esté interesado en tu anuncio, acepta su petición y espera a que se una a tu canal de Discord.
                </div>
                <div className="modal-footer" style={{ marginTop: '20px' }}>
                    <Button variant="secondary" onClick={() => setShowSuccessModal(false)}>
                        Cerrar
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
