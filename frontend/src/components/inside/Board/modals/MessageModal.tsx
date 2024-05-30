import React from 'react';
import { Anuncio } from '../../../../interfaces/AnuncioInterface.tsx';

interface MessageModalProps {
    showMessageModal: boolean;
    setShowMessageModal: (show: boolean) => void;
    selectedAnuncio: Anuncio | null;
    messageText: string;
    setMessageText: (message: string) => void;
    handleMessageSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const MessageModal: React.FC<MessageModalProps> = ({
                                                       showMessageModal,
                                                       setShowMessageModal,
                                                       selectedAnuncio,
                                                       messageText,
                                                       setMessageText,
                                                       handleMessageSubmit
                                                   }) => {
    if (!showMessageModal) return null;

    return (
        <div className="custom-modal" data-testid="message-modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">
                        Enviar Mensaje a {selectedAnuncio ? selectedAnuncio.riotNickname : ''}
                    </h5>
                    <button type="button" className="btn-close" onClick={() => setShowMessageModal(false)} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleMessageSubmit}>
                        <div className="mb-3">
                            <label htmlFor="messageText" className="form-label">Mensaje</label>
                            <textarea
                                className="form-control"
                                id="messageText"
                                rows={3}
                                required
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                data-testid="message-textarea"
                            ></textarea>
                        </div>
                        <div className="modal-footer" style={{ marginTop: '20px' }}>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowMessageModal(false)}
                                style={{ marginRight: '10px' }}
                            >
                                Cerrar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                data-testid="send-message-button"
                            >
                                Enviar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MessageModal;
