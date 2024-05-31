import { Alerta } from '../AlertInterface.ts';

export interface AlertModalProps {
    showAlertasModal: boolean;
    handleAlertasModalClose: () => void;
    alertas: Alerta[];
}