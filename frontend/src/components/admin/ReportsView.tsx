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
        "Por favor, no insultes.",
        "Por favor, no faltes al respeto en los comentarios.",
        "No mientas con tu rango."
    ];
    const [showModal, setShowModal] = useState(false);
    const [selectedAnuncioId, setSelectedAnuncioId] = useState<number | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [modalAction, setModalAction] = useState<"delete" | "ban" | null>(null);

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
        // Implement logic to ignore the report
        console.log(`Report ${reportId} ignored`);
    };

    const handleDeleteAnuncio = (anuncioId: number) => {
        setSelectedAnuncioId(anuncioId);
        setModalAction("delete");
        setShowModal(true);
    };

    const handleBanUser = (userId: string | undefined) => {
        if (userId) {
            setSelectedUserId(userId);
            setModalAction("ban");
            setShowModal(true);
        }
    };

    const banUser = async (userId: string, mensaje: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/users/ban/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mensaje),
            });
            if (response.ok) {
                console.log('Usuario baneado con éxito');
                // Aquí puedes agregar lógica adicional si es necesario, como actualizar el estado
            } else {
                throw new Error('Error al banear al usuario');
            }
        } catch (error) {
            console.error('Error al banear al usuario', error);
        }
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
                setAnuncios(anuncios.filter(anuncio => anuncio.id !== anuncioId));
                setReports(reports.filter(report => report.anuncioId !== anuncioId));
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
        } else if (modalAction === "ban" && selectedUserId !== null) {
            banUser(selectedUserId, alertMessages[selectedMessageIndex]);
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
                                <button className="btn btn-danger me-2" onClick={() => handleDeleteAnuncio(report.anuncioId)}>Eliminar anuncio</button>
                                <button className="btn btn-warning" onClick={() => handleBanUser(anuncio?.userId)}>Banear usuario</button>
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
