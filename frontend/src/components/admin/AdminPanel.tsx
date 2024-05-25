import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Container, Row, Col, ListGroup } from 'react-bootstrap';

const AdminPanel: React.FC = () => {
    return (
        <Container style={{ marginTop: '150px' }}>
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card>
                        <Card.Header className="text-center">
                            <h1>Panel de Administrador</h1>
                        </Card.Header>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Link to="/admin-panel/reports">Administrar reportes</Link>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminPanel;