import React, { useEffect, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo2-rojo-blanco.png';
import { auth } from '../../firebase-auth.ts';
import { useAuth } from '../../contexts/AuthContext';
import { Message } from '../../interfaces/MessageInterface.tsx';
import { UserProfile } from '../../interfaces/UserProfileInterface.ts';
import IconProfileDisplay from "../inside/IconProfileDisplay.tsx";
import RankInfoDisplay from '../inside/RankInfoDisplay';
import Modal from 'react-bootstrap/Modal';
import { Button } from "react-bootstrap";
import './NavbarStyles.css';
import lolIcon from '../../assets/lol-logo.png';
import alertIcon from '../../assets/warning.png';
import { Alerta } from '../../interfaces/AlertInterface.tsx';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

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
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [loadingProfiles, setLoadingProfiles] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [alertas, setAlertas] = useState<Alerta[]>([]);
    const [showAlertasModal, setShowAlertasModal] = useState(false);
    const [realTimeMessages, setRealTimeMessages] = useState<Message[]>([]);

    const fetchUnreadAlertas = async (userId: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/alertas/unread-by-user/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setAlertas(data);
            } else {
                throw new Error('Failed to fetch user unread alertas');
            }
        } catch (error) {
            console.error('Error fetching user unread alertas:', error);
        }
    };

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            stompClient.subscribe('/topic/messages', async (message) => {
                const newMessage = JSON.parse(message.body);
                if (newMessage.receiverId === currentUser?.uid) {
                    setUnreadMessages((prevMessages) => [...prevMessages, newMessage]);
                    setUnreadMessagesCount((prevCount) => prevCount + 1);

                    // Fetch the sender's profile
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
    }, [currentUser]);

    const markAlertasAsRead = async (userId: string) => {
        try {
            await fetch(`http://localhost:8080/api/alertas/mark-as-read/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error('Error marking alertas as read:', error);
        }
    };

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
            fetchUserProfileByFirebaseUid(currentUser.uid).then(userProfile => {
                if (userProfile) {
                    setIsAdmin(userProfile.admin);
                }
            });
            fetchUnreadMessagesCount(currentUser.uid);
            fetchUnreadAlertas(currentUser.uid);
            fetchUnreadMessages(currentUser.uid);
        } else {
            navigate('/');
        }
    }, [currentUser, navigate]);

    const handleAlertIconClick = () => {
        setShowAlertasModal(true);
    };

    const handleAlertasModalClose = async () => {
        setShowAlertasModal(false);
        if (currentUser) {
            await markAlertasAsRead(currentUser.uid);
            fetchUnreadAlertas(currentUser.uid);
        }
    };

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
        setLoadingProfiles(true);
        try {
            const response = await fetch(`http://localhost:8080/api/profiles/by-firebaseUid?firebaseUid=${firebaseUid}`);
            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('Failed to fetch user profile');
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        } finally {
            setLoadingProfiles(false);
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
        if (sidebarOpen && currentUser) {
            setUnreadMessages(realTimeMessages);
            setRealTimeMessages([]);
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

    const handleReject = () => {
        if (selectedMessage) {
            handleDelete(selectedMessage.id);
            handleCloseModal();
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

    const getSortedMessages = () => {
        const unread = unreadMessages.filter(message => !message.read);
        const read = unreadMessages.filter(message => message.read);

        return [
            ...unread.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
            ...read.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        ];
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        navigate(`/profile/${encodeURIComponent(searchTerm)}`);
    };

    const obtenerEnlaceDiscord = async (anuncioId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/anuncios/${anuncioId}/discord-link`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const discordLink = await response.text();
                return discordLink;
            } else {
                throw new Error('Failed to fetch Discord link');
            }
        } catch (error) {
            console.error('Error fetching Discord link:', error);
            return '';
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

    return (
        <section className="vw-100">
            <nav className="navbar navbar-expand-sm navbar-dark bg-dark fixed-top">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/board">
                        <img src={logo} alt="Logo" style={{maxWidth: '100px'}}/>
                    </a>
                    <form className="d-flex align-items-center search-form" onSubmit={handleSearchSubmit}>
                        <input
                            className="form-control search-input"
                            type="search"
                            placeholder="Nickname#Tag"
                            aria-label="Buscar"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <button className="btn btn-outline-light" type="submit" style={{marginLeft: '10px'}}>
                            <i className="bi bi-search"></i>
                        </button>
                    </form>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#mynavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <img src={lolIcon} alt="LoL Icon" style={{height: '30px', marginLeft: '60px'}}/>
                    <div className="collapse navbar-collapse" id="mynavbar">
                        <ul className="navbar-nav ms-auto d-flex align-items-center" style={{gap: '20px'}}>
                            {isAdmin && (
                                <li className="nav-item d-flex align-items-center">
                                    <a className="nav-link" href="/admin-panel">Panel de administrador</a>
                                </li>
                            )}
                            {alertas.length > 0 && (
                                <li className="nav-item" style={{marginRight: '20px', position: 'relative'}}>
                                    <a className="nav-link" href="#" onClick={handleAlertIconClick}
                                       style={{position: 'relative'}}>
                                        <img src={alertIcon} alt="Alert Icon" style={{width: '30px'}}/>
                                    </a>
                                </li>
                            )}
                            <li className="nav-item" style={{marginRight: '20px', position: 'relative'}}>
                                <a className="nav-link" href="#" onClick={toggleSidebar} style={{position: 'relative'}}>
                                    <i className="bi bi-chat-left-dots-fill"
                                       style={{color: '#fff', fontSize: '2rem', position: 'relative'}}></i>
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
                                    <i className="bi bi-person-circle" style={{color: '#fff', fontSize: '2rem'}}></i>
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
                {loadingMessages ? (
                    <div>Cargando mensajes...</div>
                ) : (
                    <ul style={{ marginTop: '100px', position: 'relative' }}>
                        {getSortedMessages().map((message, index) => {
                            const userProfile = userProfiles[message.senderId];
                            const riotNickname = userProfile ? userProfile.riotnickname : 'Loading...';
                            const gameName = riotNickname.split('#')[0];
                            const tagLine = riotNickname.split('#')[1];

                            const messageTextPreview = message.messageText.length > 20
                                ? `${message.messageText.substring(0, 10)}...`
                                : message.messageText;

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
                                        <div className="d-inline-block tooltip-wrapper">
                                            <IconProfileDisplay
                                                gameName={gameName}
                                                tagLine={tagLine}
                                                width="50px"
                                                height="50px"
                                                borderRadius="10%"
                                            />
                                            <div className="tooltip">
                                                {riotNickname}
                                                <RankInfoDisplay gameName={gameName} tagLine={tagLine} applyColor={true}/>
                                            </div>
                                        </div>
                                        <div style={{
                                            marginLeft: '10px',
                                            marginRight: '10px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center'
                                        }}>
                                            <p style={{
                                                margin: '0',
                                                fontWeight: 'bold',
                                                color: '#f8f9fa'
                                            }}>{gameName}</p>
                                            <p style={{ margin: '0', color: '#ced4da' }}>{messageTextPreview}</p>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
                <ul style={{ marginTop: '100px', position: 'relative' }}>
                </ul>
            </div>
            <Modal show={showModal} onHide={handleCloseModal} dialogClassName="modal-dialog-centered custom-modal-centered">
                <Modal.Header closeButton>
                    {selectedMessage && selectedMessage.senderId && userProfiles[selectedMessage.senderId] && (
                        <a href={`/profile/${encodeURIComponent(userProfiles[selectedMessage.senderId].riotnickname)}`} className="d-inline-flex align-items-center">
                            <IconProfileDisplay
                                gameName={userProfiles[selectedMessage.senderId].riotnickname.split('#')[0]}
                                tagLine={userProfiles[selectedMessage.senderId].riotnickname.split('#')[1]}
                                width="80px"
                                height="80px"
                                borderRadius="10%"
                            />
                            <div className="ms-2">
                                <strong>{userProfiles[selectedMessage.senderId].riotnickname}</strong>
                                <RankInfoDisplay
                                    gameName={userProfiles[selectedMessage.senderId].riotnickname.split('#')[0]}
                                    tagLine={userProfiles[selectedMessage.senderId].riotnickname.split('#')[1]}
                                    applyColor={true}
                                />
                            </div>
                        </a>
                    )}
                </Modal.Header>
                <Modal.Body>
                    {selectedMessage && (
                        <>
                            <p dangerouslySetInnerHTML={{ __html: selectedMessage.messageText }}></p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {!selectedMessage?.isAcceptanceMessage && (
                        <Button variant="success" onClick={handleAccept}>
                            Aceptar
                        </Button>
                    )}
                    {!selectedMessage?.isAcceptanceMessage && (
                        <Button variant="danger" onClick={handleReject}>
                            Rechazar
                        </Button>
                    )}
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
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
        </section>
    );
}

export default Navbar;
