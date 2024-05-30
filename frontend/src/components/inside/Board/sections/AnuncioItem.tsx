import React from 'react';
import { Link } from 'react-router-dom';
import { Anuncio } from '../../../../interfaces/AnuncioInterface.tsx';
import WinRateDisplay from '../../SummonerDisplays/WinRateDisplay.tsx';
import IconProfileDisplay from '../../SummonerDisplays/IconProfileDisplay.tsx';
import RankInfoDisplay from '../../SummonerDisplays/RankInfoDisplay.tsx';

interface AnuncioItemProps {
    anuncio: Anuncio;
    currentUser: any;
    handleOpenMessageModal: (anuncio: Anuncio) => void;
    handleDelete: (id: number) => void;
    handleEdit: (anuncio: Anuncio) => void;
    handleOpenReportModal: (anuncio: Anuncio) => void;
    getRoleIconUrl: (role: string) => string;
    getRankIconUrl: (range: string) => string;
    timeSince: (date: number | Date) => string;
}

const AnuncioItem: React.FC<AnuncioItemProps> = ({
                                                     anuncio,
                                                     currentUser,
                                                     handleOpenMessageModal,
                                                     handleDelete,
                                                     handleEdit,
                                                     handleOpenReportModal,
                                                     getRoleIconUrl,
                                                     getRankIconUrl,
                                                     timeSince
                                                 }) => {
    return (
        <tr>
            <td className="align-middle text-center">
                {currentUser && currentUser.uid === anuncio.userId ? (
                    <a href={anuncio.discordChannelLink} target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-discord" style={{fontSize: '24px', color: '#7289da'}}></i>
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
                        <Link to={`/profile/${encodeURIComponent(anuncio.riotNickname)}`} className="fs-6">
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
            <td className="align-middle text-center" style={{wordBreak: 'break-word', maxWidth: '320px'}}>
                {anuncio.comentario}
            </td>
            <td className="align-middle text-center">
                {timeSince(new Date(anuncio.createdAt))}
            </td>
            <td style={{backgroundColor: 'transparent'}}>
                {currentUser && currentUser.uid === anuncio.userId ? (
                    <div className="dropdown">
                        <a className="text-muted" href="#" role="button" id={`dropdownMenuLink${anuncio.id}`}
                           data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="bi bi-three-dots-vertical"></i>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end"
                            aria-labelledby={`dropdownMenuLink${anuncio.id}`}>
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
                        <a className="text-muted" href="#" role="button" id={`dropdownMenuLink${anuncio.id}`}
                           data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="bi bi-three-dots-vertical"></i>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end"
                            aria-labelledby={`dropdownMenuLink${anuncio.id}`}>
                            <li>
                                <a className="dropdown-item" href="#" onClick={(e) => {
                                    e.preventDefault();
                                    handleOpenReportModal(anuncio);
                                }}>
                                    <i className="bi bi-flag-fill"></i> Reportar
                                </a>
                            </li>
                        </ul>
                    </div>
                )}
            </td>
        </tr>
    );
};

export default AnuncioItem;