import { useState, useEffect } from 'react';
import { Message } from '../../../../interfaces/MessageInterface.ts';

const useFetchUnreadMessages = (currentUser: any, navigate: any) => {
    const [unreadMessages, setUnreadMessages] = useState<Message[]>([]);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [userProfiles, setUserProfiles] = useState<{ [key: string]: any }>({});

    useEffect(() => {
        const fetchUnreadMessagesCount = async (uid: string) => {
            try {
                const response = await fetch(`http://localhost:8080/api/mensajes/count/${uid}`);
                const count = await response.json();
                setUnreadMessagesCount(count);
            } catch (error) {
                console.error('Error fetching unread messages count:', error);
            }
        };

        const fetchUnreadMessages = async (uid: string) => {
            setLoadingMessages(true);
            try {
                const response = await fetch(`http://localhost:8080/api/mensajes/unread/${uid}`);
                const messages = await response.json();
                setUnreadMessages(messages);
            } catch (error) {
                console.error('Error fetching unread messages:', error);
            } finally {
                setLoadingMessages(false);
            }
        };

        if (currentUser) {
            fetchUnreadMessagesCount(currentUser.uid);
            fetchUnreadMessages(currentUser.uid);
        } else {
            navigate('/');
        }
    }, [currentUser, navigate]);

    return {
        unreadMessages,
        unreadMessagesCount,
        loadingMessages,
        userProfiles,
        setUnreadMessages,
        setUnreadMessagesCount,
    };
};

export default useFetchUnreadMessages;
