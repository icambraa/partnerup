import { useState } from 'react';
import useMessages from './useMessages';
import {User} from "firebase/auth";

const useSidebar = (currentUser: User | null) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { fetchUnreadMessages } = useMessages();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
        if (!sidebarOpen && currentUser) {
            fetchUnreadMessages(currentUser.uid);
        }
    };

    return {
        sidebarOpen,
        toggleSidebar,
    };
};

export default useSidebar;
