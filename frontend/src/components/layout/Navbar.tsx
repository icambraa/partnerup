import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo2-rojo-blanco.png';
import { auth } from '../../firebase-auth.ts';
import { useAuth } from '../../contexts/AuthContext';
import { Message } from '../../interfaces/MessageInterface.tsx';
import { UserProfile } from '../../interfaces/UserProfileInterface.ts';
import IconProfileDisplay from "../inside/IconProfileDisplay.tsx";
import Modal from 'react-bootstrap/Modal';
import {Button} from "react-bootstrap";
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
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const handleOpenMessage = (message: Message) => {
        setSelectedMessage(message);
        setShowModal(true);
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
                setUnreadMessages(data);
                // Fetch profiles for each message sender
                const profileFetches = data.map((message: Message) => fetchUserProfileByFirebaseUid(message.senderId));
                const profiles = await Promise.all(profileFetches);
                const newProfiles = profiles.reduce((acc, profile, index) => {
                    acc[data[index].senderId] = profile;
                    return acc;
                }, {});
                setUserProfiles(prev => ({...prev, ...newProfiles}));
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
                                    <li><a className="dropdown-item" href="#" onClick={handleLogout}>Cerrar Sesión</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div id="sidebar" style={{
                width: '275px',
                height: '100%',
                position: 'fixed',
                top: 0,
                right: sidebarOpen ? '0' : '-275px',
                backgroundColor: '#f8f9fa',
                transition: 'right 0.5s'
            }}>
                <h3>Unread Messages</h3>
                <ul style={{ marginTop: '65px' }}>
                    {unreadMessages.map((message, index) => {
                        const userProfile = userProfiles[message.senderId];
                        const riotNickname = userProfile ? userProfile.riotnickname: 'Loading...';

                        return (
                            <li key={index} className="p-3 mb-3 message" style={{
                                borderWidth: '3px',
                                borderRadius: '15px',
                                backgroundColor: '#e0f7fa',
                                borderColor: '#006064',
                                listStyleType: 'none',
                                position: 'relative'
                            }} onClick={() => handleOpenMessage(message)}>
                                <div className="d-flex align-items-center">
                                    <IconProfileDisplay
                                        gameName={riotNickname.split('#')[0]}
                                        tagLine={riotNickname.split('#')[1]}
                                    />
                                    <div style={{
                                        marginLeft: '10px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center'
                                    }}>
                                        <p style={{
                                            margin: '0',
                                            fontWeight: 'bold',
                                            color: '#006064'
                                        }}>{riotNickname}</p>
                                        <p style={{margin: '0', color: '#004d40'}}>{message.messageText}</p>
                                    </div>
                                </div>
                                <div style={{
                                    position: 'absolute',
                                    left: '-20px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '6px',
                                    height: '6px',
                                    backgroundColor: '#006064',
                                    borderRadius: '50%'
                                }}></div>
                            </li>
                        );
                    })}

                </ul>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Mensaje</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedMessage && selectedMessage.messageText}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </section>
    );
}

export default Navbar;