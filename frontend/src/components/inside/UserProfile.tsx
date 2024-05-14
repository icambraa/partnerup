import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserProfile } from '../../interfaces/UserProfileInterface';
import WinRateDisplayCircle from './WinRateDisplayCircle'; // Asegúrate de que la ruta sea correcta
import IconProfileDisplay from './IconProfileDisplay'; // Importa el componente del icono
import { Card, Spinner, Alert, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserProfileStyles.css';

const UserProfileComponent: React.FC = () => {
    const { currentUser } = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (currentUser && currentUser.email) {
            fetch(`http://localhost:8080/api/profiles/by-email?email=${encodeURIComponent(currentUser.email)}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch user profile');
                    }
                    return response.json();
                })
                .then(data => setUserProfile(data))
                .catch(error => {
                    console.error('Error fetching user data:', error);
                    setError(error.message);
                });
        }
    }, [currentUser]);

    if (error) {
        return <Alert variant="danger">Error: {error}</Alert>;
    }

    if (!userProfile) {
        return <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner>;
    }

    const [gameName, tagLine] = userProfile.riotnickname.split('#');

    return (
        <Container className="custom-margin-top">
            <Card>
                <Card.Header>
                    <h2>{userProfile.nombreusuario}</h2>
                </Card.Header>
                <Card.Body>
                    <Row className="mb-3 align-items-start">
                        <Col md="auto">
                            <IconProfileDisplay gameName={gameName} tagLine={tagLine} width="130px" height="130px" borderRadius="10%" />
                        </Col>
                        <Col md="auto" className="nickname-container">
                            <h4 className="nickname-text">{userProfile.riotnickname}</h4>
                        </Col>
                        <Col md="auto">
                            <WinRateDisplayCircle gameName={gameName} tagLine={tagLine} />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={12} lg={6}>
                            <p><strong>Email:</strong> {userProfile.email}</p>
                            <p><strong>Rango Actual:</strong> {userProfile.rangoactual}</p>
                            <p><strong>Rol Principal:</strong> {userProfile.rolprincipal}</p>
                            <p><strong>Región:</strong> {userProfile.region}</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default UserProfileComponent;