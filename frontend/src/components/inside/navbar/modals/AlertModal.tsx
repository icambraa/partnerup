import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from "react-bootstrap";
import { Alerta } from '../../../../interfaces/AlertInterface.tsx';

interface AlertModalProps {
    showAlertasModal: boolean;
    handleAlertasModalClose: () => void;
    alertas: Alerta[];
}

const AlertModal: React.FC<AlertModalProps> = ({
                                                   showAlertasModal,
                                                   handleAlertasModalClose,
                                                   alertas
                                               }) => {
    return (
        <Modal show={showAlertasModal} onHide={handleAlertasModalClose} dialogClassName="modal-dialog-centered custom-modal-centered">
            <Modal.Header closeButton>
                <Modal.Title>Alertas</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {alertas.length > 0 ? (
                    <ul>
                        {alertas.map((alerta, index) => (
                            <li key={index}>
                                {alerta.mensaje} - {new Date(alerta.createdAt).toLocaleString()}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay alertas</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleAlertasModalClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AlertModal;
