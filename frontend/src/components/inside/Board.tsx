import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useAuth } from '../../contexts/AuthContext.tsx';
import { Anuncio } from '../../interfaces/AnuncioInterface.tsx';

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


    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const handleNextPage = () => {
        const newPage = currentPage + 1;
        if (newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handlePreviousPage = () => {
        const newPage = currentPage - 1;
        if (newPage >= 0) {
            setCurrentPage(newPage);
        }
    };

    useEffect(() => {
        fetchAnuncios();
    }, [currentPage, pageSize]);

    const fetchAnuncios = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/anuncios?page=${currentPage}&size=${pageSize}`);
            if (response.ok) {
                const { content, totalPages } = await response.json();
                setAnuncios(content);  // Reemplaza los anuncios existentes con los nuevos
                setTotalPages(totalPages);
            } else {
                console.error('Error al obtener los anuncios');
            }
        } catch (error) {
            console.error('Error al obtener los anuncios', error);
        }
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
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
            <div className="container" style={{ display: 'flex', alignItems: 'start' }}>
                <div className="table-responsive" style={{flex: 1}}>
                    <table className="table table-bordered">
                        <thead className="custom-dark-header">
                        <tr>
                            <th className="text-center">Riot nickname</th>
                            <th className="text-center">Rol</th>
                            <th className="text-center">Busco rol</th>
                            <th className="text-center">Rango</th>
                            <th className="text-center">Comentario</th>
                        </tr>
                        </thead>
                        <tbody>
                        {anuncios.map((anuncio: Anuncio, index: number) => (
                            <tr key={index}>
                                <td>{anuncio.riotNickname}</td>
                                <td>{anuncio.rol}</td>
                                <td>{anuncio.buscaRol}</td>
                                <td>{anuncio.rango}</td>
                                <td>{anuncio.comentario}</td>
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
                    <div className="pagination-controls">
                        <button onClick={handlePreviousPage} disabled={currentPage === 0}>Anterior</button>
                        <span>Página {currentPage + 1} de {totalPages}</span>
                        <button onClick={handleNextPage} disabled={currentPage + 1 >= totalPages}>Siguiente</button>
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
                                    <label htmlFor="rol" className="form-label">Rol</label>
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
                                    <label htmlFor="buscaRol" className="form-label">Busco rol</label>
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
                                    <label htmlFor="rango" className="form-label">Rango</label>
                                    <input type="text" className="form-control" id="rango" onChange={handleChange}/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="comentario" className="form-label">Comentario</label>
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