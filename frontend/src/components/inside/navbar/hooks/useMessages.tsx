import { useState, useEffect } from 'react';
import { Message } from '../../../../interfaces/MessageInterface.ts';
import { UserProfile } from '../../../../interfaces/UserProfileInterface';
import { useAuth } from '../../../../contexts/AuthContext';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import useDiscordLink from './useDiscordLink';

interface UserProfiles {
    [key: string]: UserProfile;
}

const useMessages = () => {
    const { currentUser } = useAuth();
    const { obtenerEnlaceDiscord } = useDiscordLink();
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
    const [unreadMessages, setUnreadMessages] = useState<Message[]>([]);
    const [userProfiles, setUserProfiles] = useState<UserProfiles>({});
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [hoveredMessageId, setHoveredMessageId] = useState<number | null>(null);

    const fetchUnreadMessagesCount = async (userId: string) => {
        console.log("Fetching unread messages for user ID:", userId);
        setLoadingMessages(true);
        try {
            const response = await fetch(`http://localhost:8080/api/mensajes/unread-count?userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setUnreadMessagesCount(data);
                console.log("Unread messages count:", data);
            } else {
                throw new Error('Failed to fetch unread messages count');
            }
        } catch (error) {
            console.error('Error fetching unread messages count:', error);
        } finally {
            setLoadingMessages(false);
        }
    };

    const fetchUnreadMessages = async (userId: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/mensajes/unread?userId=${userId}`);
            if (response.ok) {
                const data = await response.json();
                const sortedMessages = data.sort((a: Message, b: Message) => {
                    const dateA = new Date(a.createdAt).getTime();
                    const dateB = new Date(b.createdAt).getTime();
                    return dateB - dateA;
                });
                setUnreadMessages(sortedMessages);
                const profileFetches = data.map((message: Message) => fetchUserProfileByFirebaseUid(message.senderId));
                const profiles = await Promise.all(profileFetches);
                const newProfiles = profiles.reduce((acc, profile, index) => {
                    acc[data[index].senderId] = profile;
                    return acc;
                }, {});
                setUserProfiles(prev => ({ ...prev, ...newProfiles }));
            } else {
                throw new Error('Failed to fetch unread messages');
            }
        } catch (error) {
            console.error('Error fetching unread messages:', error);
        }
    };

    const fetchUserProfileByFirebaseUid = async (firebaseUid: string): Promise<UserProfile | undefined> => {
        try {
            const response = await fetch(`http://localhost:8080/api/profiles/by-firebaseUid?firebaseUid=${firebaseUid}`);
            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('Failed to fetch user profile');
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const markMessageAsRead = async (messageId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/mensajes/mark-as-read/${messageId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error('Failed to mark message as read');
            }
            setUnreadMessages(prevMessages =>
                prevMessages.map(message =>
                    message.id === messageId ? { ...message, read: true } : message
                )
            );
            console.log("Mensaje marcado como leído");
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    };

    const handleDelete = async (messageId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/mensajes/${messageId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete message');
            }
            const updatedMessages = unreadMessages.map(message => {
                if (message.id === messageId) {
                    return { ...message, slideOut: true };
                }
                return message;
            });
            setUnreadMessages(updatedMessages);
            setTimeout(() => {
                const remainingMessages = unreadMessages.filter(message => message.id !== messageId);
                setUnreadMessages(remainingMessages);
                setUnreadMessagesCount(prevCount => prevCount - 1);
            }, 500);
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    const handleAccept = async () => {
        if (!selectedMessage || !selectedMessage.anuncioId || !currentUser?.uid) {
            console.error('Mensaje seleccionado o usuario actual no válido.');
            handleCloseModal();
            return;
        }

        const anuncioId = selectedMessage.anuncioId;

        try {
            const discordLink = await obtenerEnlaceDiscord(anuncioId);

            if (!discordLink) {
                console.error('El enlace de Discord no está definido.');
                handleCloseModal();
                return;
            }

            const newMessage = {
                senderId: currentUser.uid,
                receiverId: selectedMessage.senderId,
                messageText: `He aceptado tu solicitud! Puedes encontrarme en este canal de  <a href="${discordLink}" target="_blank">Discord</a>`,
                anuncioId: anuncioId,
                isAcceptanceMessage: true
            };

            const response = await fetch('http://localhost:8080/api/mensajes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMessage),
            });

            if (response.ok) {
                console.log('Mensaje enviado correctamente');
                handleCloseModal();
            } else {
                console.error('Error al enviar el mensaje de aceptación');
            }
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
        }
    };

    const getSortedMessages = () => {
        const unread = unreadMessages.filter(message => !message.read);
        const read = unreadMessages.filter(message => message.read);

        return [
            ...unread.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
            ...read.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        ];
    };

    useEffect(() => {
        if (currentUser) {
            fetchUnreadMessagesCount(currentUser.uid);
            fetchUnreadMessages(currentUser.uid);

            const socket = new SockJS('http://localhost:8080/ws');
            const stompClient = Stomp.over(socket);

            stompClient.connect({}, () => {
                stompClient.subscribe('/topic/messages', async (message) => {
                    const newMessage = JSON.parse(message.body);
                    if (newMessage.receiverId === currentUser?.uid) {
                        setUnreadMessages((prevMessages) => [...prevMessages, newMessage]);
                        setUnreadMessagesCount((prevCount) => prevCount + 1);

                        const senderProfile = await fetchUserProfileByFirebaseUid(newMessage.senderId);
                        if (senderProfile) {
                            setUserProfiles((prevProfiles) => ({
                                ...prevProfiles,
                                [newMessage.senderId]: senderProfile,
                            }));
                        }
                    }
                });
            });

            return () => {
                if (stompClient) {
                    stompClient.disconnect();
                }
            };
        }
    }, [currentUser]);

    const handleOpenMessage = (message: Message) => {
        setSelectedMessage(message);
        setShowModal(true);
        markMessageAsRead(message.id);
    };

    const handleMouseEnter = (messageId: number) => {
        setHoveredMessageId(messageId);
    };

    const handleMouseLeave = () => {
        setHoveredMessageId(null);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        if (selectedMessage && currentUser?.uid) {
            fetchUnreadMessagesCount(currentUser.uid);
        }
    };

    const handleReject = () => {
        if (selectedMessage) {
            handleDelete(selectedMessage.id);
            handleCloseModal();
        }
    };

    return {
        unreadMessagesCount,
        unreadMessages,
        userProfiles,
        loadingMessages,
        setUnreadMessages,
        setUnreadMessagesCount,
        markMessageAsRead,
        fetchUnreadMessagesCount,
        fetchUnreadMessages,
        fetchUserProfileByFirebaseUid,
        handleDelete,
        handleAccept,
        getSortedMessages,
        handleOpenMessage,
        handleMouseEnter,
        handleMouseLeave,
        handleCloseModal,
        handleReject,
        selectedMessage,
        showModal,
        hoveredMessageId,
    };
};

export default useMessages;
