import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from "react-bootstrap";
import IconProfileDisplay from "../../SummonerDisplays/IconProfileDisplay.tsx";
import RankInfoDisplay from '../../SummonerDisplays/RankInfoDisplay';
import { MessageModalProps } from '../../../../interfaces/props/NavbarMessageModalProps.ts';

const MessageModal: React.FC<MessageModalProps> = ({
                                                       showModal,
                                                       handleCloseModal,
                                                       selectedMessage,
                                                       userProfiles,
                                                       handleAccept,
                                                       handleReject
                                                   }) => {
    return (
        <Modal show={showModal} onHide={handleCloseModal} dialogClassName="modal-dialog-centered custom-modal-centered">
            <Modal.Header closeButton>
                {selectedMessage && selectedMessage.senderId && userProfiles[selectedMessage.senderId] && (
                    <a href={`/profile/${encodeURIComponent(userProfiles[selectedMessage.senderId].riotnickname)}`} className="d-inline-flex align-items-center">
                        <IconProfileDisplay
                            gameName={userProfiles[selectedMessage.senderId].riotnickname.split('#')[0]}
                            tagLine={userProfiles[selectedMessage.senderId].riotnickname.split('#')[1]}
                            width="80px"
                            height="80px"
                            borderRadius="10%"
                        />
                        <div className="ms-2">
                            <strong>{userProfiles[selectedMessage.senderId].riotnickname}</strong>
                            <RankInfoDisplay
                                gameName={userProfiles[selectedMessage.senderId].riotnickname.split('#')[0]}
                                tagLine={userProfiles[selectedMessage.senderId].riotnickname.split('#')[1]}
                                applyColor={true}
                            />
                        </div>
                    </a>
                )}
            </Modal.Header>
            <Modal.Body>
                {selectedMessage && (
                    <>
                        <p dangerouslySetInnerHTML={{ __html: selectedMessage.messageText }}></p>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                {!selectedMessage?.isAcceptanceMessage && (
                    <>
                        <Button variant="success" onClick={handleAccept}>
                            Aceptar
                        </Button>
                        <Button variant="danger" onClick={handleReject}>
                            Rechazar
                        </Button>
                    </>
                )}
                <Button variant="secondary" onClick={handleCloseModal}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MessageModal;