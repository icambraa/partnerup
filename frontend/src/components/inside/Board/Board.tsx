import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Anuncio } from '../../../interfaces/AnuncioInterface.ts';
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
import usePagination from './hooks/usePagination';
import useModals from './hooks/useModals';
import useFilters from './hooks/useFilters';
import useAnuncioForm from './hooks/useAnuncioForm';
import './BoardStyles.css';
import { timeSince } from '../../../utils/timeUtils';
import { getRoleIconUrl } from '../../../utils/roleUtils';
import { getRankIconUrl } from '../../../utils/rankUtils';

const Board: React.FC = () => {
    const { currentUser } = useAuth();
    const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
    const initialFormData = {
        riotNickname: '',
        rol: '',
        buscaRol: '',
        rango: '',
        comentario: '',
    };

    const {
        currentPage,
        setCurrentPage,
        setTotalPages,
        pageSize,
        handleNextPage,
    } = usePagination(0, 10);

    const {
        showModal,
        setShowModal,
        showSuccessModal,
        setShowSuccessModal,
        showMessageModal,
        setShowMessageModal,
        showReportModal,
        setShowReportModal,
        channelLink,
        setChannelLink,
        reportMessage,
        setReportMessage,
        messageText,
        setMessageText
    } = useModals();

    const {
        selectedRole,
        selectedRange,
        filterData,
        handleFilterChange
    } = useFilters();

    const {
        formData,
        setFormData,
        selectedAnuncio,
        setSelectedAnuncio,
        isEditing,
        setIsEditing,
        handleEdit
    } = useAnuncioForm(initialFormData, setShowModal);

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

    const handleOpenMessageModal = (anuncio: Anuncio) => {
        setSelectedAnuncio(anuncio);
        setShowMessageModal(true);
    };

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
