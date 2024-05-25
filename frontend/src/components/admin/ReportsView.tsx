import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { Report } from '../../interfaces/ReportInterface';
import { Anuncio } from '../../interfaces/AnuncioInterface';
import { Link } from 'react-router-dom'; // Importa Link

const ReportsView: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
    const { currentUser } = useAuth();
    const alertMessages = [
        "Tu anuncio ha sido eliminado por contener lenguaje inapropiado.",
        "Tu anuncio ha sido eliminado por comportamiento ofensivo.",
        "Tu anuncio ha sido eliminado por información engañosa.",
        "Tu anuncio ha sido eliminado por spam.",
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
                const pendingReports = reportsData.filter((report: Report) => report.status === 'pendiente');
                setReports(pendingReports);
                const anuncioIds = pendingReports.map((report: Report) => report.anuncioId);
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

    const handleIgnore = async (reportId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/reports/${reportId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'revisado' }),
            });

            if (response.ok) {
                console.log(`Report ${reportId} ignored and marked as reviewed`);
                fetchReports(); // Refrescar la lista de reportes
            } else {
                throw new Error('Error al actualizar el reporte');
            }
        } catch (error) {
            console.error('Error al actualizar el reporte', error);
        }
    };

    const handleDeleteAnuncio = (anuncioId: number) => {
        setSelectedAnuncioId(anuncioId);
        setModalAction("delete");
        setShowModal(true);
    };

    const createAlerta = async (userId: string, message: string) => {
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

    const updateReportStatus = async (reportId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/reports/${reportId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'revisado' }),
            });

            if (response.ok) {
                console.log('Reporte actualizado a revisado');
                fetchReports(); // Refrescar la lista de reportes
            } else {
                throw new Error('Error al actualizar el reporte');
            }
        } catch (error) {
            console.error('Error al actualizar el reporte', error);
        }
    };

    const getUserProfile = async (uid: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/profiles/by-firebaseUid?firebaseUid=${uid}`);
            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('Error al obtener el perfil del usuario');
            }
        } catch (error) {
            console.error('Error al obtener el perfil del usuario', error);
            return null;
        }
    };

    const deleteAnuncio = async (anuncioId: number) => {
        try {
            const userProfile = await getUserProfile(currentUser?.uid || '');
            if (!userProfile) {
                throw new Error('No se pudo obtener el perfil del usuario');
            }

            const response = await fetch(`http://localhost:8080/api/anuncios/${anuncioId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'userId': currentUser?.uid || '',
                    'isAdmin': userProfile.admin ? 'true' : 'false'
                },
            });

            if (response.ok) {
                console.log('Anuncio eliminado con éxito');
                // Actualizar los reportes relacionados
                const relatedReports = reports.filter(report => report.anuncioId === anuncioId);
                for (const report of relatedReports) {
                    await updateReportStatus(report.id);
                }
            } else {
                throw new Error('Error al eliminar el anuncio');
            }
        } catch (error) {
            console.error('Error al eliminar el anuncio', error);
        }
    };

    const handleModalSubmit = async (selectedMessageIndex: number) => {
        if (modalAction === "delete" && selectedAnuncioId !== null) {
            const anuncio = getAnuncioById(selectedAnuncioId);
            if (anuncio && anuncio.userId) {
                await createAlerta(anuncio.userId, alertMessages[selectedMessageIndex]);
                await deleteAnuncio(selectedAnuncioId);
            } else {
                console.error('No se pudo encontrar el userId del anuncio');
            }
        }
        setShowModal(false);
    };

    return (
        <div className="container" style={{ marginTop: '130px' }}>
            <Link to="/admin-panel"><i className="bi bi-arrow-left-circle" style={{ fontSize: '1.5rem' }}></i> Volver</Link>
            <h1>Reportes de Anuncios</h1>
            <table className="table">
                <thead className="custom-dark-header">
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
