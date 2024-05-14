import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo2-rojo-blanco.png';
import { auth } from '../../firebase-auth.ts';
import { useAuth } from '../../contexts/AuthContext';
import { Message } from '../../interfaces/MessageInterface.tsx';
import { UserProfile } from '../../interfaces/UserProfileInterface.ts';
import IconProfileDisplay from "../inside/IconProfileDisplay.tsx";
import Modal from 'react-bootstrap/Modal';
import { Button } from "react-bootstrap";

interface UserProfiles {
    [key: string]: UserProfile;
}

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
    const { currentUser } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState<Message[]>([]);
    const [userProfiles, setUserProfiles] = useState<UserProfiles>({});
    const [showModal, setShowModal] = useState(false);
    const [hoveredMessageId, setHoveredMessageId] = useState<number | null>(null);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

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

    useEffect(() => {
        if (currentUser) {
            fetchUnreadMessagesCount(currentUser.uid);
        } else {
            navigate('/');
        }
    }, [currentUser, navigate]);

    const fetchUnreadMessagesCount = async (userId: string) => {
        console.log("Fetching unread messages for user ID:", userId);
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
        }
    };

    const fetchUnreadMessages = async (userId: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/mensajes/unread?userId=${userId}`);
            if (response.ok) {
                const data = await response.json();
                // Ordenar los mensajes de forma descendente por la fecha de creación para que los más nuevos aparezcan primero
                const sortedMessages = data.sort((a: Message, b: Message) => {
                    const dateA = new Date(a.createdAt).getTime();
                    const dateB = new Date(b.createdAt).getTime();
                    return dateB - dateA;
                });
                setUnreadMessages(sortedMessages);
                // Fetch profiles for each message sender
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

    const fetchUserProfileByFirebaseUid = async (firebaseUid: string) => {
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

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
        if (!sidebarOpen && currentUser) {
            fetchUnreadMessages(currentUser.uid);
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
            // Actualiza el estado de unreadMessages para marcar el mensaje como leído
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
            // Actualiza la lista de mensajes después de eliminar uno
            const updatedMessages = unreadMessages.map(message => {
                if (message.id === messageId) {
                    return { ...message, slideOut: true }; // Agrega la propiedad slideOut al mensaje eliminado
                }
                return message;
            });
            setUnreadMessages(updatedMessages);
            setTimeout(() => {
                const remainingMessages = unreadMessages.filter(message => message.id !== messageId);
                setUnreadMessages(remainingMessages);
            }, 500); // Espera 0.5 segundos (duración de la animación) antes de eliminar el mensaje del estado
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    // Función para ordenar y agrupar los mensajes
    const getSortedMessages = () => {
        const unread = unreadMessages.filter(message => !message.read);
        const read = unreadMessages.filter(message => message.read);

        return [
            ...unread.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
            ...read.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        ];
    };

    return (
        <section className="vw-100">
            <nav className="navbar navbar-expand-sm navbar-dark bg-dark fixed-top">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/board">
                        <img src={logo} alt="Logo" style={{ maxWidth: '100px' }} />
                    </a>
                    <form className="d-flex align-items-center">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-outline-light" type="submit">
                            <i className="bi bi-search"></i>
                        </button>
                    </form>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#mynavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="mynavbar">
                        <ul className="navbar-nav ms-auto" style={{ gap: '20px' }}>
                            <li className="nav-item" style={{ marginRight: '20px', position: 'relative' }}>
                                <a className="nav-link" href="#" onClick={toggleSidebar} style={{ position: 'relative' }}>
                                    <i className="bi bi-chat-left-dots-fill"
                                       style={{ color: '#fff', fontSize: '2rem', position: 'relative' }}></i>
                                    {unreadMessagesCount > 0 &&
                                        <span className="badge bg-danger animate-bounce" style={{
                                            position: 'absolute',
                                            top: '5px',
                                            right: '0'
                                        }}>{unreadMessagesCount}</span>}
                                </a>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                                   data-bs-toggle="dropdown" aria-expanded="false">
                                    <i className="bi bi-person-circle" style={{ color: '#fff', fontSize: '2rem' }}></i>
                                </a>
                                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end"
                                    aria-labelledby="navbarDropdown">
                                    <li><a className="dropdown-item" href="/profile">Perfil de usuario</a></li>
                                    <li><a className="dropdown-item" href="#" onClick={handleLogout}>Cerrar Sesión</a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div id="sidebar" style={{
                width: '275px',
                minHeight: '100vh',
                maxHeight: '100%',
                overflowY: 'auto',
                position: 'fixed',
                overflowX: 'hidden',
                top: 0,
                right: sidebarOpen ? '0' : '-275px',
                backgroundColor: '#343a40',
                transition: 'right 0.5s'
            }}>
                <ul style={{ marginTop: '100px', position: 'relative' }}>
                    {getSortedMessages().map((message, index) => {
                        const userProfile = userProfiles[message.senderId];
                        const riotNickname = userProfile ? userProfile.riotnickname : 'Loading...';

                        return (
                            <li key={index}
                                className={`p-3 mb-3 message ${message.slideOut ? 'slideOutAnimation' : ''} ${message.id === hoveredMessageId ? 'hovered' : ''} ${message.read ? 'readMessage' : ''}`}
                                style={{
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                    borderRight: 'none',
                                    borderRadius: '15px 0 0 15px',
                                    backgroundColor: '#495057',
                                    borderColor: '#6c757d',
                                    boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.2)',
                                    listStyleType: 'none',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    paddingLeft: '30px',
                                    transform: message.read ? (message.id === hoveredMessageId ? 'translateX(0)' : 'translateX(169px)') : 'translateX(0)',
                                    transition: 'transform 0.3s ease',
                                }}
                                onMouseEnter={() => handleMouseEnter(message.id)}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => handleOpenMessage(message)}>
                                <button
                                    className="btn btn-danger message-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(message.id);
                                    }}
                                >
                                    <i className="bi bi-x-lg" style={{ color: 'white', fontSize: '14px' }}></i>
                                </button>
                                <div className="d-flex align-items-center">
                                    <div className="d-inline-block">
                                        <IconProfileDisplay
                                            gameName={riotNickname.split('#')[0]}
                                            tagLine={riotNickname.split('#')[1]}
                                            width="50px" height="50px" borderRadius="10%"
                                        />
                                    </div>
                                    <div style={{
                                        marginLeft: '10px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center'
                                    }}>
                                        <p style={{
                                            margin: '0',
                                            fontWeight: 'bold',
                                            color: '#f8f9fa'
                                        }}>{riotNickname}</p>
                                        <p style={{ margin: '0', color: '#ced4da' }}>{message.messageText}</p>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Mensaje</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedMessage && selectedMessage.messageText}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </section>
    );
}

export default Navbar;
