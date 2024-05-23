import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Anuncio } from '../../interfaces/AnuncioInterface';
import WinRateDisplay from './WinRateDisplay';
import IconProfileDisplay from './IconProfileDisplay';
import RankInfoDisplay from './RankInfoDisplay';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

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
    const isLoading = useRef(false);
    const [selectedRole, setSelectedRole] = useState<string | null | undefined>(null);
    const [selectedRange, setSelectedRange] = useState<string | null | undefined>(null);
    const [selectedAnuncio, setSelectedAnuncio] = useState<Anuncio | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [channelLink, setChannelLink] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false); // Añadido para el modal de éxito
    const [showMessageModal, setShowMessageModal] = useState(false); // Añadido para el modal de mensaje
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportMessage, setReportMessage] = useState('');

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
                setShowReportModal(false); // Cerrar el modal después de enviar el reporte
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

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (currentUser) {
                try {
                    const response = await fetch(`http://localhost:8080/api/profiles/by-firebaseUid?firebaseUid=${currentUser.uid}`);
                    if (response.ok) {
                        const profile = await response.json();
                        setFormData((prevFormData) => ({
                            ...prevFormData,
                            riotNickname: profile.riotnickname,
                            rol: profile.rolprincipal
                        }));
                    } else {
                        console.error('Error fetching user profile');
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            }
        };

        fetchUserProfile();
    }, [currentUser]);

    const handleOpenMessageModal = (anuncio: Anuncio) => {
        setSelectedAnuncio(anuncio);
        setShowMessageModal(true);
    };

    useEffect(() => {
        fetchAnuncios();
    }, [currentPage, filterData, pageSize]);

    const handleMessageChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setMessageText(e.target.value);
    };

    const fetchAnuncios = async () => {
        if (isLoading.current) return;
        isLoading.current = true;
        try {
            const url = new URL('http://localhost:8080/api/anuncios');
            url.searchParams.append('page', currentPage.toString());
            url.searchParams.append('size', pageSize.toString());

            if (filterData.rol) {
                url.searchParams.append('rol', filterData.rol);
            }
            if (filterData.rango) {
                url.searchParams.append('rango', filterData.rango);
            }

            const response = await fetch(url);
            if (response.ok) {
                const { content, totalPages } = await response.json();
                if (currentPage === 0) {
                    setAnuncios(content);
                } else {
                    setAnuncios(prevAnuncios => [...prevAnuncios, ...content]);
                }
                setTotalPages(totalPages);
            } else {
                console.error('Error al obtener los anuncios');
            }
        } catch (error) {
            console.error('Error al obtener los anuncios', error);
        }
        isLoading.current = false;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value, type, checked } = e.target;
        setFormData({ ...formData, [id]: type === 'checkbox' ? checked : value });
        setCurrentPage(0);
    };

    const handleFilterChange = (id: string, value: string | undefined | null) => {
        if (id === 'rol') {
            setSelectedRole(value);
            if (filterData !== null) {
                setFilterData({ ...filterData, rol: value ?? undefined });
            }
        } else if (id === 'rango') {
            setSelectedRange(value);
            if (filterData !== null) {
                setFilterData({ ...filterData, rango: value ?? undefined });
            }
        }
        setCurrentPage(0);
    };

    const handleNextPage = () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (currentUser) {
            const formDataWithUserId = {
                ...formData,
                userId: currentUser.uid
            };

            try {
                let response;
                if (isEditing && selectedAnuncio) {
                    response = await fetch(`http://localhost:8080/api/anuncios/${selectedAnuncio.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formDataWithUserId)
                    });
                } else {
                    response = await fetch('http://localhost:8080/api/anuncios', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formDataWithUserId)
                    });
                }

                if (response.ok) {
                    const anuncio = await response.json();

                    try {
                        const discordResponse = await fetch('http://localhost:8080/api/discord/create-channel', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(anuncio)
                        });

                        if (discordResponse.ok) {
                            const discordData = await discordResponse.json();
                            console.log(`Channel created: ${discordData.channelLink}`);

                            // Actualizar el anuncio con el enlace del canal de Discord
                            await fetch(`http://localhost:8080/api/anuncios/${anuncio.id}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ ...anuncio, discordChannelLink: discordData.channelLink })
                            });

                            setChannelLink(discordData.channelLink);
                            setShowModal(false); // Cerrar el formulario de creación de anuncio
                            setShowSuccessModal(true); // Mostrar el modal de éxito
                        } else {
                            const discordError = await discordResponse.text();
                            console.error('Error creating Discord channel:', discordError);
                        }
                    } catch (error) {
                        console.error('Error during Discord channel creation:', error);
                    }

                    fetchAnuncios();
                    setIsEditing(false);
                    setSelectedAnuncio(null);
                } else {
                    const errorText = await response.text();
                    console.error(`Error al ${isEditing ? 'editar' : 'crear'} el anuncio:`, errorText);
                }
            } catch (error) {
                console.error('Error al enviar el formulario', error);
            }
        } else {
            console.error('No hay usuario autenticado');
        }
    };

    const handleDelete = async (id: number) => {
        if (!currentUser || !currentUser.uid) {
            console.error('Error: No hay usuario autenticado.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/anuncios/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'userId': currentUser.uid
                }
            });
            if (response.ok) {
                console.log('Anuncio borrado con éxito');
                setAnuncios(anuncios.filter((anuncio) => anuncio.id !== id));
            } else {
                throw new Error('Error al borrar el anuncio');
            }
        } catch (error) {
            console.error('Error al borrar el anuncio', error);
        }
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
                setShowMessageModal(false); // Cerrar el modal después de enviar el mensaje
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <section className="content">
            <div className="container" style={{ display: 'flex', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                    <div className="row align-items-center">
                        <div className="col-auto">
                            <div className="mt-5">
                                <div className="icon-container">
                                    <img className={`role-icon all ${selectedRole === null ? 'selected' : ''}`}
                                         src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-fill.png"
                                         alt="Todos"
                                         title="Cualquier rol"
                                         onClick={() => handleFilterChange('rol', null)} />
                                    <img className={`role-icon top-icon ${selectedRole === 'Top' ? 'selected' : ''}`}
                                         src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-top.png"
                                         alt="Top"
                                         title="Top"
                                         onClick={() => handleFilterChange('rol', 'Top')} />
                                    <img className={`role-icon mid-icon ${selectedRole === 'Mid' ? 'selected' : ''}`}
                                         src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-middle.png"
                                         alt="Mid"
                                         title="Mid"
                                         onClick={() => handleFilterChange('rol', 'Mid')} />
                                    <img
                                        className={`role-icon jungle-icon ${selectedRole === 'Jungle' ? 'selected' : ''}`}
                                        src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-jungle.png"
                                        alt="Jungle"
                                        title="Jungle"
                                        onClick={() => handleFilterChange('rol', 'Jungle')} />
                                    <img className={`role-icon adc-icon ${selectedRole === 'ADC' ? 'selected' : ''}`}
                                         src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-bottom.png"
                                         alt="ADC"
                                         title="ADC"
                                         onClick={() => handleFilterChange('rol', 'ADC')} />
                                    <img
                                        className={`role-icon support-icon ${selectedRole === 'Support' ? 'selected' : ''}`}
                                        src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-utility.png"
                                        alt="Support"
                                        title="Support"
                                        onClick={() => handleFilterChange('rol', 'Support')} />
                                </div>
                            </div>
                        </div>
                        <div className="col-auto">
                            <div className="mt-5">
                                <div className="icon-container">
                                    <img className={`range-icon hierro ${selectedRange === 'Hierro' ? 'selected' : ''}`}
                                         src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/iron.png"
                                         alt="Hierro"
                                         title="Hierro"
                                         onClick={() => handleFilterChange('rango', 'Hierro')} />
                                    <img className={`range-icon bronce ${selectedRange === 'Bronce' ? 'selected' : ''}`}
                                         src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/bronze.png"
                                         alt="Bronce"
                                         title="Bronce"
                                         onClick={() => handleFilterChange('rango', 'Bronce')} />
                                    <img className={`range-icon plata ${selectedRange === 'Plata' ? 'selected' : ''}`}
                                         src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/silver.png"
                                         alt="Plata"
                                         title="Plata"
                                         onClick={() => handleFilterChange('rango', 'Plata')} />
                                    <img className={`range-icon oro ${selectedRange === 'Oro' ? 'selected' : ''}`}
                                         src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/gold.png"
                                         alt="Oro"
                                         title="Oro"
                                         onClick={() => handleFilterChange('rango', 'Oro')} />
                                    <img
                                        className={`range-icon platino ${selectedRange === 'Platino' ? 'selected' : ''}`}
                                        src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/platinum.png"
                                        alt="Platino"
                                        title="Platino"
                                        onClick={() => handleFilterChange('rango', 'Platino')} />
                                    <img
                                        className={`range-icon diamante ${selectedRange === 'Diamante' ? 'selected' : ''}`}
                                        src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/diamond.png"
                                        alt="Diamante"
                                        title="Diamante"
                                        onClick={() => handleFilterChange('rango', 'Diamante')} />
                                    <img
                                        className={`range-icon ascendente ${selectedRange === 'Master' ? 'selected' : ''}`}
                                        src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/master.png"
                                        alt="Master"
                                        title="Master"
                                        onClick={() => handleFilterChange('rango', 'Master')} />
                                    <img
                                        className={`range-icon inmortal ${selectedRange === 'Grandmaster' ? 'selected' : ''}`}
                                        src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/grandmaster.png"
                                        alt="Grandmaster"
                                        title="Grandmaster"
                                        onClick={() => handleFilterChange('rango', 'Grandmaster')} />
                                    <img
                                        className={`range-icon radiante ${selectedRange === 'Challenger' ? 'selected' : ''}`}
                                        src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/challenger.png"
                                        alt="Challenger"
                                        title="Challenger"
                                        onClick={() => handleFilterChange('rango', 'Challenger')} />
                                </div>
                            </div>
                        </div>
                        <div className="col-auto" style={{ marginLeft: 'auto', marginRight: '50px' }}>
                            <div className="mt-5">
                                <div className="icon-container">
                                    <button type="button" className="btn btn-primary my-2" onClick={() => setShowModal(true)}>
                                        Anunciarse
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <table className="table table-bordered custom-table">
                        <thead className="custom-dark-header">
                        <tr>
                            <th className="text-center"></th>
                            <th className="text-center">Riot nickname</th>
                            <th className="text-center winrate">Winrate</th>
                            <th className="text-center">Rol</th>
                            <th className="text-center">Busco rol</th>
                            <th className="text-center">Busco rango</th>
                            <th className="text-center">Comentario</th>
                            <th className="text-center">Fecha de creación</th>
                        </tr>
                        </thead>
                        <tbody>
                        {anuncios.map((anuncio: Anuncio, index: number) => (
                            <tr key={index}>
                                <td className="align-middle text-center">
                                    {currentUser && currentUser.uid === anuncio.userId ? (
                                        <a href={anuncio.discordChannelLink} target="_blank" rel="noopener noreferrer">
                                            <i className="bi bi-discord"
                                               style={{fontSize: '24px', color: '#7289da'}}></i>
                                        </a>
                                    ) : (
                                        <button
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() => handleOpenMessageModal(anuncio)}
                                        >
                                            <i className="bi bi-envelope-fill"></i>
                                        </button>
                                    )}
                                </td>
                                <td className="align-middle">
                                    <div className="d-inline-block d-flex align-items-center">
                                        <IconProfileDisplay
                                            gameName={anuncio.riotNickname.split('#')[0]}
                                            tagLine={anuncio.riotNickname.split('#')[1]}
                                            width="50px" height="50px" borderRadius="50%"
                                        />
                                        <div className="ms-3">
                                            <Link to={`/profile/${encodeURIComponent(anuncio.riotNickname)}`}
                                                  className="fs-6">
                                                {anuncio.riotNickname}
                                            </Link>
                                            <div className="extra-small text-muted">
                                                <RankInfoDisplay
                                                    gameName={anuncio.riotNickname.split('#')[0]}
                                                    tagLine={anuncio.riotNickname.split('#')[1]}
                                                    applyColor={false}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="align-middle text-center">
                                    <WinRateDisplay
                                        gameName={anuncio.riotNickname.split('#')[0]}
                                        tagLine={anuncio.riotNickname.split('#')[1]}
                                    />
                                </td>
                                <td className="align-middle text-center">
                                    <img src={getRoleIconUrl(anuncio.rol)} alt={anuncio.rol} title={anuncio.rol}
                                         style={{width: '30px', height: 'auto'}}/>
                                </td>
                                <td className="align-middle text-center">
                                    <img
                                        src={getRoleIconUrl(anuncio.buscaRol)}
                                        alt={anuncio.buscaRol}
                                        title={anuncio.buscaRol}
                                        style={{width: '30px', height: 'auto', filter: 'grayscale(100%)'}}
                                    />
                                </td>
                                <td className="align-middle text-center">
                                    {anuncio.rango && (
                                        <div style={{textAlign: 'center'}}>
                                            <img
                                                src={getRankIconUrl(anuncio.rango)}
                                                alt={anuncio.rango}
                                                title={anuncio.rango}
                                                style={{width: '30px', height: 'auto'}}
                                            />
                                            <div>{anuncio.rango}</div>
                                        </div>
                                    )}
                                </td>
                                <td className="align-middle text-center">{anuncio.comentario}</td>
                                <td className="align-middle text-center">
                                    {timeSince(new Date(anuncio.createdAt))}
                                </td>
                                <td style={{backgroundColor: 'transparent'}}>
                                    {currentUser && currentUser.uid === anuncio.userId ? (
                                        <div className="dropdown">
                                            <a className="text-muted" href="#" role="button"
                                               id={`dropdownMenuLink${index}`}
                                               data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="bi bi-three-dots-vertical"></i>
                                            </a>
                                            <ul className="dropdown-menu dropdown-menu-end"
                                                aria-labelledby={`dropdownMenuLink${index}`}>
                                                <li>
                                                    <a className="dropdown-item" href="#" onClick={(e) => {
                                                        e.preventDefault();
                                                        handleDelete(anuncio.id);
                                                    }}>
                                                        <i className="bi bi-trash"></i> Borrar
                                                    </a>
                                                </li>
                                                <li>
                                                    <a className="dropdown-item" href="#" onClick={(e) => {
                                                        e.preventDefault();
                                                        handleEdit(anuncio);
                                                    }}>
                                                        <i className="bi bi-pencil-fill"></i> Editar
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    ) : (
                                        <div className="dropdown">
                                            <a className="text-muted" href="#" role="button"
                                               id={`dropdownMenuLink${index}`}
                                               data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="bi bi-three-dots-vertical"></i>
                                            </a>
                                            <ul className="dropdown-menu dropdown-menu-end"
                                                aria-labelledby={`dropdownMenuLink${index}`}>
                                                <li>
                                                    <a className="dropdown-item" href="#" onClick={(e) => {
                                                        e.preventDefault();
                                                        handleOpenReportModal(anuncio); // Llamada a la función handleOpenReportModal para mostrar el modal de reporte
                                                    }}>
                                                        <i className="bi bi-flag-fill"></i> Reportar
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="pagination-controls text-center">
                        <button onClick={handleNextPage} style={{position: 'relative', left: '-40px'}}>
                            <i className="bi bi-chevron-compact-down"></i>
                        </button>
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="custom-modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title"
                                id="formModalLabel">{isEditing ? 'Editar Anuncio' : 'Crear anuncio'}</h5>
                            <button type="button" className="btn-close" onClick={() => setShowModal(false)}
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="riotNickname" className="form-label">Riot Nickname</label>
                                    <input type="text" className="form-control" id="riotNickname"
                                           value={formData.riotNickname} disabled/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="rol" className="form-label">Rol</label>
                                    <select className="form-select" id="rol" value={formData.rol}
                                            onChange={handleChange}>
                                        <option value="">Seleccione un rol</option>
                                        <option value="Top">Top</option>
                                        <option value="Mid">Mid</option>
                                        <option value="Jungle">Jungle</option>
                                        <option value="ADC">ADC</option>
                                        <option value="Support">Support</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="buscaRol" className="form-label">Busco rol</label>
                                    <select className="form-select" id="buscaRol" value={formData.buscaRol}
                                            onChange={handleChange}>
                                        <option value="">Seleccione un rol</option>
                                        <option value="Top">Top</option>
                                        <option value="Mid">Mid</option>
                                        <option value="Jungle">Jungle</option>
                                        <option value="ADC">ADC</option>
                                        <option value="Support">Support</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="rango" className="form-label">Rango</label>
                                    <select className="form-select" id="rango" value={formData.rango}
                                            onChange={handleChange}>
                                        <option value="">Seleccione un rango</option>
                                        <option value="Hierro">Hierro</option>
                                        <option value="Bronce">Bronce</option>
                                        <option value="Plata">Plata</option>
                                        <option value="Oro">Oro</option>
                                        <option value="Platino">Platino</option>
                                        <option value="Diamante">Diamante</option>
                                        <option value="Master">Master</option>
                                        <option value="Grandmaster">Grandmaster</option>
                                        <option value="Challenger">Challenger</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="comentario" className="form-label">Comentario</label>
                                    <textarea className="form-control" id="comentario" rows={3}
                                              value={formData.comentario} onChange={handleChange}></textarea>
                                </div>
                                <div className="mb-2" style={{textAlign: 'center', marginTop: '40px'}}>
                                    <div style={{display: 'inline-block'}}>
                                        <img src="/src/assets/discord-logo-blue.png" alt="Discord Logo"
                                             style={{width: '300px', marginBottom: '10px'}}/>
                                    </div>
                                </div>
                                <div className="mb-4"
                                     style={{padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '10px'}}>
                                    <p className="form-text" style={{textAlign: 'left', margin: '0'}}>
                                        ¡Anúnciate en PartnerUP y únete a la comunidad de jugadores! Al crear un
                                        anuncio, se generará automáticamente un canal privado en nuestro servidor de
                                        Discord, exclusivo para ti y tu futuro compañero.
                                    </p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary"
                                            onClick={() => setShowModal(false)} style={{marginRight: '10px'}}>
                                        Cerrar
                                    </button>
                                    <button type="submit" className="btn btn-primary">Enviar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {showSuccessModal && (
                <div className="custom-modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Canal del Anuncio</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowSuccessModal(false)}
                                aria-label="Close"
                                style={{ marginBottom: '10px' }}
                            ></button>
                        </div>
                        <div className="modal-body" style={{ marginTop: '20px' }}>
                            ¡Tu anuncio ha sido publicado con éxito! 🎉<br /> <br />
                            Se ha creado automáticamente un canal en nuestro servidor de Discord PartnerUP!<br />
                            <br /> Puedes acceder al canal utilizando el siguiente enlace:
                            <br />
                            <br />
                            <div style={{ textAlign: 'center' }}>
                                <a href={channelLink} target="_blank" rel="noopener noreferrer">
                                    Enlace al canal de Discord
                                </a>
                            </div>
                            <br />
                            Por favor, espera a que alguien esté interesado en tu anuncio, acepta su petición y espera a que se una a tu canal de Discord.
                        </div>
                        <div className="modal-footer" style={{marginTop: '20px'}}>
                            <Button variant="secondary" onClick={() => setShowSuccessModal(false)}>
                                Cerrar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {showMessageModal && (
                <div className="custom-modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Enviar Mensaje a {selectedAnuncio ? selectedAnuncio.riotNickname : ''}
                            </h5>
                            <button type="button" className="btn-close" onClick={() => setShowMessageModal(false)} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleMessageSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="messageText" className="form-label">Mensaje</label>
                                    <textarea className="form-control" id="messageText" rows={3} required
                                              value={messageText} onChange={handleMessageChange}></textarea>
                                </div>
                                <div className="modal-footer" style={{ marginTop: '20px' }}>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowMessageModal(false)} style={{ marginRight: '10px' }}>Cerrar</button>
                                    <button type="submit" className="btn btn-primary">Enviar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {showReportModal && (
                <div className="custom-modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Reportar Anuncio
                            </h5>
                            <button type="button" className="btn-close" onClick={() => setShowReportModal(false)} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleReportSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="reportMessage" className="form-label">Motivo del Reporte</label>
                                    <textarea className="form-control" id="reportMessage" rows={3} required
                                              value={reportMessage} onChange={(e) => setReportMessage(e.target.value)}></textarea>
                                </div>
                                <div className="modal-footer" style={{ marginTop: '20px' }}>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowReportModal(false)} style={{ marginRight: '10px' }}>Cerrar</button>
                                    <button type="submit" className="btn btn-primary">Enviar Reporte</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default Board;
