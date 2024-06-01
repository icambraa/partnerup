import { useState } from 'react';

const useModals = () => {
    const [showModal, setShowModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [channelLink, setChannelLink] = useState('');
    const [reportMessage, setReportMessage] = useState('');
    const [messageText, setMessageText] = useState('');

    return {
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
    };
};

export default useModals;
