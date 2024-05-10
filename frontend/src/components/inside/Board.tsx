import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useAuth } from '../../contexts/AuthContext.tsx';
import { Anuncio } from '../../interfaces/AnuncioInterface.tsx';
import WinRateDisplay from './WinRateDisplay';
import IconProfileDisplay from "./IconProfileDisplay";



const Board: React.FC = () => {
    const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
    const { currentUser } = useAuth();
    const [formData, setFormData] = useState({
        riotNickname: '',
        rol: '',
        buscaRol: '',
        rango: '',
        comentario: ''
    });

    const [filterData, setFilterData] = useState({
        rol: '',
        rango: ''
    });



    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const isLoading = useRef(false);
    const [selectedRole, setSelectedRole] = React.useState(null);

    useEffect(() => {
        fetchAnuncios();
    }, [currentPage, filterData, pageSize]);


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
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        setCurrentPage(0); // Reiniciar la página actual a 0 al cambiar un filtro
    };

    const handleFilterChange = (role) => {
        if (selectedRole === role) {
            setSelectedRole(null);
            setFilterData({ ...filterData, rol: undefined });
        } else {
            setSelectedRole(role);
            setFilterData({ ...filterData, rol: role });
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
                const response = await fetch('http://localhost:8080/api/anuncios', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formDataWithUserId)
                });
                if (response.ok) {
                    console.log('Anuncio creado con éxito');
                    fetchAnuncios();
                } else {
                    console.error('Error al crear el anuncio');
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
                // @ts-ignore
                setAnuncios(anuncios.filter((anuncio) => anuncio.id !== id));
            } else {
                throw new Error('Error al borrar el anuncio');
            }
        } catch (error) {
            console.error('Error al borrar el anuncio', error);
        }
    };

    return (
        <section className="content">
            <div className="container" style={{display: 'flex', alignItems: 'start'}}>
                <div style={{flex: 1}}>
                    <div className="row">
                        <div className="col-auto">
                            <div className="mb-3">
                                <div className="icon-container">
                                    <img className={`role-icon all ${selectedRole === null ? 'selected' : ''}`}
                                         src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-fill.png"
                                         alt="Todos"
                                         title="Cualquier rol"
                                         onClick={() => handleFilterChange(null)}/>
                                    <img className={`role-icon top-icon ${selectedRole === 'Top' ? 'selected' : ''}`}
                                         src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-top.png"
                                         alt="Top"
                                         title="Top"
                                         onClick={() => handleFilterChange('Top')}/>
                                    <img className={`role-icon mid-icon ${selectedRole === 'Mid' ? 'selected' : ''}`}
                                         src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-middle.png"
                                         alt="Mid"
                                         title="Mid"
                                         onClick={() => handleFilterChange('Mid')}/>
                                    <img
                                        className={`role-icon jungle-icon ${selectedRole === 'Jungle' ? 'selected' : ''}`}
                                        src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-jungle.png"
                                        alt="Jungle"
                                        title="Jungle"
                                        onClick={() => handleFilterChange('Jungle')}/>
                                    <img className={`role-icon adc-icon ${selectedRole === 'ADC' ? 'selected' : ''}`}
                                         src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-bottom.png"
                                         alt="ADC"
                                         title="ADC"
                                         onClick={() => handleFilterChange('ADC')}/>
                                    <img
                                        className={`role-icon support-icon ${selectedRole === 'Support' ? 'selected' : ''}`}
                                        src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-utility.png"
                                        alt="Support"
                                        title="Support"
                                        onClick={() => handleFilterChange('Support')}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-auto">
                            <div className="mb-3">
                                <select className="form-select form-select-sm" id="rango" onChange={handleFilterChange}>
                                    <option value="">Selecciona un rango</option>
                                    <option value="Hierro">Hierro</option>
                                    <option value="Bronce">Bronce</option>
                                    <option value="Plata">Plata</option>
                                    <option value="Oro">Oro</option>
                                    <option value="Platino">Platino</option>
                                    <option value="Diamante">Diamante</option>
                                    <option value="Ascendente">Ascendente</option>
                                    <option value="Inmortal">Inmortal</option>
                                    <option value="Radiante">Radiante</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <table className="table table-bordered">
                        <thead className="custom-dark-header">
                        <tr>
                            <th className="text-center">Riot nickname</th>
                            <th className="text-center">Winrate</th>
                            <th className="text-center">Rol</th>
                            <th className="text-center">Busco rol</th>
                            <th className="text-center">Rango</th>
                            <th className="text-center">Comentario</th>
                            <th className="text-center">Fecha de creación</th>
                        </tr>
                        </thead>
                        <tbody>
                        {anuncios.map((anuncio: Anuncio, index: number) => (
                            <tr key={index}>
                                <td className="d-flex align-items-center">
                                    <IconProfileDisplay
                                        gameName={anuncio.riotNickname.split('#')[0]}
                                        tagLine={anuncio.riotNickname.split('#')[1]}
                                    />
                                    <span className="ms-2">{anuncio.riotNickname}</span>
                                </td>
                                <WinRateDisplay
                                    gameName={anuncio.riotNickname.split('#')[0]}
                                    tagLine={anuncio.riotNickname.split('#')[1]}
                                />
                                <td>{anuncio.rol}</td>
                                <td>{anuncio.buscaRol}</td>
                                <td>{anuncio.rango}</td>
                                <td>{anuncio.comentario}</td>
                                <td>{new Date(anuncio.createdAt).toLocaleString()}</td>
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
                                                        // handleEdit(anuncio.id);  // Implementar si necesario
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
                                                        // handleReport(anuncio.id);  // Implementar si necesario
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
                <button type="button" className="btn btn-primary my-2" data-bs-toggle="modal"
                        data-bs-target="#formModal">
                    Anunciarse
                </button>
            </div>
            <div className="modal fade" id="formModal" tabIndex={-1} aria-labelledby="formModalLabel"
                 aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="formModalLabel">Formulario de Anuncio</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="riotNickname" className="form-label">Riot Nickname</label>
                                    <input type="text" className="form-control" id="riotNickname" required
                                           onChange={handleChange}/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="create-rol" className="form-label">Rol</label>
                                    <select className="form-select" id="rol" onChange={handleChange}>
                                        <option value="">Seleccione un rol</option>
                                        <option value="Top">Top</option>
                                        <option value="Mid">Mid</option>
                                        <option value="Jungle">Jungle</option>
                                        <option value="ADC">ADC</option>
                                        <option value="Support">Support</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="create-buscaRol" className="form-label">Busco rol</label>
                                    <select className="form-select" id="buscaRol" onChange={handleChange}>
                                        <option value="">Seleccione un rol</option>
                                        <option value="Top">Top</option>
                                        <option value="Mid">Mid</option>
                                        <option value="Jungle">Jungle</option>
                                        <option value="ADC">ADC</option>
                                        <option value="Support">Support</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="create-rango" className="form-label">Rango</label>
                                    <input type="text" className="form-control" id="rango" onChange={handleChange}/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="create-comentario" className="form-label">Comentario</label>
                                    <textarea className="form-control" id="comentario" rows={3}
                                              onChange={handleChange}></textarea>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar
                                    </button>
                                    <button type="submit" className="btn btn-primary">Enviar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}


export default Board;