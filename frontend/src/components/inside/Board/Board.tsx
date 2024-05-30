import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Anuncio } from '../../../interfaces/AnuncioInterface';
import CreateEditAnuncioModal from './modals/CreateEditAnuncioModal';
import SuccessModal from './modals/SuccessModal';
import MessageModal from './modals/MessageModal';
import ReportModal from './modals/ReportModal';
import FilterSection from './sections/FilterSection';
import AnuncioTable from './sections/AnuncioTable';
import PaginationControls from './sections/PaginationControls';
import useFetchUserProfile from './hooks/useFetchUserProfile';
import useFetchAnuncios from './hooks/useFetchAnuncios';
import useHandleChange from './hooks/useHandleChange';
import useHandleSubmit from './hooks/useHandleSubmit';
import useHandleDelete from './hooks/useHandleDelete';
import './BoardStyles.css';

const Board: React.FC = () => {
    const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
    const { currentUser } = useAuth();
    const [formData, setFormData] = useState({
        riotNickname: '',
        rol: '',
        buscaRol: '',
        rango: '',
        comentario: '',
    });

    const [messageText, setMessageText] = useState('');
    const [filterData, setFilterData] = useState<{ rol?: string; rango?: string }>({});
    const [currentPage, setCurrentPage] = useState(0);
    const [, setTotalPages] = useState(0);
    const [pageSize] = useState(10);
    const [selectedRole, setSelectedRole] = useState<string | null | undefined>(null);
    const [selectedRange, setSelectedRange] = useState<string | null | undefined>(null);
    const [selectedAnuncio, setSelectedAnuncio] = useState<Anuncio | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [channelLink, setChannelLink] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportMessage, setReportMessage] = useState('');

    useFetchUserProfile(setFormData);
    const fetchAnuncios = useFetchAnuncios(setAnuncios, currentPage, filterData, pageSize, setTotalPages);
    const handleChange = useHandleChange(setFormData, setCurrentPage);
    const handleSubmit = useHandleSubmit(setShowModal, setShowSuccessModal, setChannelLink, fetchAnuncios, setIsEditing, setSelectedAnuncio);
    const handleDelete = useHandleDelete(setAnuncios, fetchAnuncios);

    const handleOpenReportModal = (anuncio: Anuncio) => {
        setSelectedAnuncio(anuncio);
        setShowReportModal(true);
    };

    const handleReportSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!currentUser || !selectedAnuncio) {
            console.error('Authentication error or no announcement selected');
            return;
        }

        const reportData = {
            reporterId: currentUser.uid,
            anuncioId: selectedAnuncio.id,
            reason: reportMessage,
            status: 'pendiente'
        };

        try {
            const response = await fetch('http://localhost:8080/api/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reportData)
            });

            if (response.ok) {
                console.log('Report submitted successfully');
                setReportMessage('');
                setShowReportModal(false);
            } else {
                throw new Error('Failed to submit report');
            }
        } catch (error) {
            console.error('Error submitting report:', error);
        }
    };

    const handleEdit = (anuncio: Anuncio) => {
        setFormData({
            riotNickname: anuncio.riotNickname,
            rol: anuncio.rol,
            buscaRol: anuncio.buscaRol,
            rango: anuncio.rango,
            comentario: anuncio.comentario,
        });
        setSelectedAnuncio(anuncio);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleOpenMessageModal = (anuncio: Anuncio) => {
        setSelectedAnuncio(anuncio);
        setShowMessageModal(true);
    };

    const handleFilterChange = (id: string, value: string | undefined | null) => {
        if (id === 'rol') {
            setSelectedRole(value);
            setFilterData({ ...filterData, rol: value ?? undefined });
        } else if (id === 'rango') {
            setSelectedRange(value);
            setFilterData({ ...filterData, rango: value ?? undefined });
        }
        setCurrentPage(0);
    };

    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const getRoleIconUrl = (role: string) => {
        switch (role) {
            case 'Top':
                return 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-top.png';
            case 'Mid':
                return 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-middle.png';
            case 'Jungle':
                return 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-jungle.png';
            case 'ADC':
                return 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-bottom.png';
            case 'Support':
                return 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-utility.png';
            default:
                return '';
        }
    };

    const getRankIconUrl = (range: string) => {
        switch (range) {
            case 'Hierro':
                return 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/iron.png';
            case 'Bronce':
                return 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/bronze.png';
            case 'Plata':
                return 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/silver.png';
            case 'Oro':
                return 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/gold.png';
            case 'Platino':
                return 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/platinum.png';
            case 'Diamante':
                return 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/diamond.png';
            case 'Master':
                return 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/master.png';
            case 'Grandmaster':
                return 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/grandmaster.png';
            case 'Challenger':
                return 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/challenger.png';
            default:
                return '';
        }
    };

    function timeSince(date: number | Date) {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) {
            return `hace ${interval} año${interval === 1 ? '' : 's'}`;
        }
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            return `hace ${interval} mes${interval === 1 ? '' : 'es'}`;
        }
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
            return `hace ${interval} día${interval === 1 ? '' : 's'}`;
        }
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
            return `hace ${interval} hora${interval === 1 ? '' : 's'}`;
        }
        interval = Math.floor(seconds / 60);
        if (interval >= 1) {
            return `hace ${interval} minuto${interval === 1 ? '' : 's'}`;
        }
        return `hace ${Math.floor(seconds)} segundo${Math.floor(seconds) === 1 ? '' : 's'}`;
    }

    const handleMessageSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!currentUser || !selectedAnuncio) {
            console.error('Authentication error or no announcement selected');
            return;
        }

        const lastMessageTime = localStorage.getItem(`lastMessageTime_${currentUser.uid}_${selectedAnuncio.userId}`);
        const now = new Date().getTime();

        if (lastMessageTime && now - parseInt(lastMessageTime) < 10 * 60 * 1000) {
            alert('Debes esperar 10 minutos antes de enviar otro mensaje a este usuario.');
            return;
        }

        const messageData = {
            senderId: currentUser.uid,
            receiverId: selectedAnuncio.userId,
            messageText: messageText,
            anuncioId: selectedAnuncio.id
        };

        try {
            const response = await fetch('http://localhost:8080/api/mensajes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageData)
            });

            if (response.ok) {
                console.log('Message sent successfully');
                setMessageText('');
                setShowMessageModal(false);
                localStorage.setItem(`lastMessageTime_${currentUser.uid}_${selectedAnuncio.userId}`, now.toString());
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <section className="content">
            <div className="container">
                <div>
                    <FilterSection
                        selectedRole={selectedRole}
                        selectedRange={selectedRange}
                        handleFilterChange={handleFilterChange}
                        setShowModal={setShowModal}
                    />
                    <AnuncioTable
                        anuncios={anuncios}
                        currentUser={currentUser}
                        handleOpenMessageModal={handleOpenMessageModal}
                        handleDelete={handleDelete}
                        handleEdit={handleEdit}
                        handleOpenReportModal={handleOpenReportModal}
                        getRoleIconUrl={getRoleIconUrl}
                        getRankIconUrl={getRankIconUrl}
                        timeSince={timeSince}
                    />
                    <PaginationControls handleNextPage={handleNextPage} />
                </div>
            </div>
            <CreateEditAnuncioModal
                isEditing={isEditing}
                showModal={showModal}
                setShowModal={setShowModal}
                formData={formData}
                setFormData={setFormData}
                handleChange={handleChange}
                handleSubmit={(e) => handleSubmit(e, formData, isEditing, selectedAnuncio)}
            />
            <SuccessModal
                showSuccessModal={showSuccessModal}
                setShowSuccessModal={setShowSuccessModal}
                channelLink={channelLink}
            />
            <MessageModal
                showMessageModal={showMessageModal}
                setShowMessageModal={setShowMessageModal}
                selectedAnuncio={selectedAnuncio}
                messageText={messageText}
                setMessageText={setMessageText}
                handleMessageSubmit={handleMessageSubmit}
            />
            <ReportModal
                showReportModal={showReportModal}
                setShowReportModal={setShowReportModal}
                reportMessage={reportMessage}
                setReportMessage={setReportMessage}
                handleReportSubmit={handleReportSubmit}
            />
        </section>
    );
};

export default Board;
