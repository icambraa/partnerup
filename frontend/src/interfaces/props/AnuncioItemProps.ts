import { Anuncio } from '../AnuncioInterface.ts';

export interface AnuncioItemProps {
    anuncio: Anuncio;
    currentUser: any;
    handleOpenMessageModal: (anuncio: Anuncio) => void;
    handleDelete: (id: number) => void;
    handleEdit: (anuncio: Anuncio) => void;
    handleOpenReportModal: (anuncio: Anuncio) => void;
    getRoleIconUrl: (role: string) => string;
    getRankIconUrl: (range: string) => string;
    timeSince: (date: number | Date) => string;
}
