import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { Report } from '../../interfaces/ReportInterface';
import { Anuncio } from '../../interfaces/AnuncioInterface';

const ReportsView: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
    const { currentUser } = useAuth();
    const alertMessages = [
        "Tu anuncio ha sido reportado por contener lenguaje inapropiado.",
        "Tu anuncio ha sido reportado por comportamiento ofensivo.",
        "Tu anuncio ha sido reportado por información engañosa.",
        "Tu anuncio ha sido reportado por spam.",
    ];
    const [showModal, setShowModal] = useState(false);
    const [selectedAnuncioId, setSelectedAnuncioId] = useState<number | null>(null);
    const [modalAction, setModalAction] = useState<"delete" | null>(null);

    useEffect(() => {
        if (currentUser) {
            fetchReports();
        }
    }, [currentUser]);

    const fetchReports = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/reports');
            if (response.ok) {
                const reportsData = await response.json();
                setReports(reportsData);
                const anuncioIds = reportsData.map((report: Report) => report.anuncioId);
                fetchAnuncios(anuncioIds);
            } else {
                throw new Error('Failed to fetch reports');
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    const fetchAnuncios = async (anuncioIds: number[]) => {
        try {
            const response = await fetch('http://localhost:8080/api/anuncios/by-ids', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(anuncioIds),
            });
            if (response.ok) {
                const anunciosData = await response.json();
                setAnuncios(anunciosData);
            } else {
                throw new Error('Failed to fetch anuncios');
            }
        } catch (error) {
            console.error('Error fetching anuncios:', error);
        }
    };

    const getAnuncioById = (id: number) => {
        return anuncios.find(anuncio => anuncio.id === id);
    };

    const handleIgnore = (reportId: number) => {
        console.log(`Report ${reportId} ignored`);
    };

    const handleDeleteAnuncio = (anuncioId: number) => {
        setSelectedAnuncioId(anuncioId);
        setModalAction("delete");
        setShowModal(true);
    };

    const deleteAnuncio = async (anuncioId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/anuncios/${anuncioId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'userId': currentUser?.uid || '',
                },
            });
            if (response.ok) {
                // Actualizar el estado local inmediatamente
                setAnuncios(prevAnuncios => prevAnuncios.filter(anuncio => anuncio.id !== anuncioId));
                setReports(prevReports => prevReports.filter(report => report.anuncioId !== anuncioId));
                console.log('Anuncio borrado con éxito');
            } else {
                throw new Error('Error al borrar el anuncio');
            }
        } catch (error) {
            console.error('Error al borrar el anuncio', error);
        }
    };

    const createAlerta = async (userId: number, message: string) => {
        try {
            const alerta = {
                userId: userId,
                mensaje: message,
                createdAt: new Date().toISOString(),
            };

            const response = await fetch('http://localhost:8080/api/alertas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(alerta),
            });

            if (response.ok) {
                console.log('Alerta creada con éxito');
            } else {
                throw new Error('Error al crear la alerta');
            }
        } catch (error) {
            console.error('Error al crear la alerta', error);
        }
    };

    const handleModalSubmit = (selectedMessageIndex: number) => {
        if (modalAction === "delete" && selectedAnuncioId !== null) {
            createAlerta(selectedAnuncioId, alertMessages[selectedMessageIndex]);
            deleteAnuncio(selectedAnuncioId);
        }
        setShowModal(false);
    };

    return (
        <div className="container">
            <h1>Reportes de Anuncios</h1>
            <table className="table">
                <thead>
                <tr>
                    <th>Anuncio</th>
                    <th>Reporte</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {reports.map(report => {
                    const anuncio = getAnuncioById(report.anuncioId);
                    return (
                        <tr key={report.id}>
                            <td>
                                <strong>Riot Nickname:</strong> {anuncio?.riotNickname}<br />
                                <strong>Rol:</strong> {anuncio?.rol}<br />
                                <strong>Busco rol:</strong> {anuncio?.buscaRol}<br />
                                <strong>Rango:</strong> {anuncio?.rango}<br />
                                <strong>Comentario:</strong> {anuncio?.comentario}<br />
                                <strong>Fecha de creación:</strong> {anuncio ? new Date(anuncio.createdAt ?? "").toLocaleString() : "Fecha desconocida"}
                            </td>
                            <td>
                                <strong>Motivo del Reporte:</strong> {report.reason}
                            </td>
                            <td>
                                <button className="btn btn-secondary me-2" onClick={() => handleIgnore(report.id)}>Ignorar</button>
                                <button className="btn btn-danger" onClick={() => handleDeleteAnuncio(report.anuncioId)}>Eliminar anuncio</button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Selecciona un mensaje para el usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul className="list-group">
                        {alertMessages.map((msg, index) => (
                            <li
                                key={index}
                                className="list-group-item list-group-item-action"
                                onClick={() => handleModalSubmit(index)}
                                style={{ cursor: 'pointer' }}
                            >
                                {msg}
                            </li>
                        ))}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ReportsView;
