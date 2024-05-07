import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Board: React.FC = () => {
    const [formData, setFormData] = useState({
        riotNickname: '',
        rol: '',
        buscaRol: '',
        rango: '',
        comentario: ''
    });

    const [anuncios, setAnuncios] = useState([]);

    useEffect(() => {
        fetchAnuncios();
    }, []); // Ejecutar una vez al montar el componente

    const fetchAnuncios = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/anuncios'); // Obtener todos los anuncios
            if (response.ok) {
                const data = await response.json();
                setAnuncios(data); // Almacenar los anuncios en el estado local
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
        try {
            const response = await fetch('http://localhost:8080/api/anuncios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                console.log('Anuncio creado con éxito');
                fetchAnuncios(); // Volver a obtener la lista de anuncios después de crear uno nuevo
            } else {
                console.error('Error al crear el anuncio');
            }
        } catch (error) {
            console.error('Error al enviar el formulario', error);
        }
    };

    return (
        <section className="content">
            <div className="container">
                <button type="button" className="btn btn-primary my-2" data-bs-toggle="modal"
                        data-bs-target="#formModal">
                    Anunciarse
                </button>
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead className="thead-dark">
                        <tr>
                            <th className="text-center">Riot nickname</th>
                            <th className="text-center">Rol</th>
                            <th className="text-center">Busco rol</th>
                            <th className="text-center">Rango</th>
                            <th className="text-center">Comentario</th>
                        </tr>
                        </thead>
                        <tbody>
                        {anuncios.map((anuncio: any, index: number) => (
                            <tr key={index}>
                                <td>{anuncio.riotNickname}</td>
                                <td>{anuncio.rol}</td>
                                <td>{anuncio.buscaRol}</td>
                                <td>{anuncio.rango}</td>
                                <td>{anuncio.comentario}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
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
                                    <input type="text" className="form-control" id="riotNickname" required onChange={handleChange}/>
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
                                    <textarea className="form-control" id="comentario" rows={3} onChange={handleChange}></textarea>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
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