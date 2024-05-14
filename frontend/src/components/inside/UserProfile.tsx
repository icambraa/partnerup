import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserProfile } from '../../interfaces/UserProfileInterface';
import { MatchStat } from '../../interfaces/MatchStatInterface';
import WinRateDisplayCircle from './WinRateDisplayCircle';
import IconProfileDisplay from './IconProfileDisplay';
import { Card, Spinner, Alert, Container, Row, Col, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserProfileStyles.css';

const fetchUserProfile = async (email: string | number | boolean) => {
    const response = await fetch(`http://localhost:8080/api/profiles/by-email?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
        throw new Error('Failed to fetch user profile');
    }
    return response.json();
};

const fetchMatchStats = async (gameName: string | number | boolean, tagLine: string | number | boolean, count: number) => {
    const response = await fetch(`http://localhost:8080/lastgames?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}&count=${count}`);
    if (!response.ok) {
        throw new Error('Failed to fetch match stats');
    }
    return response.json();
};

const UserProfileComponent: React.FC = () => {
    const { currentUser } = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [matchStats, setMatchStats] = useState<MatchStat[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                if (currentUser && currentUser.email) {
                    const data = await fetchUserProfile(currentUser.email);
                    setUserProfile(data);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                // @ts-ignore
                setError(error.message);
            }
        };

        loadUserProfile();
    }, [currentUser]);

    useEffect(() => {
        const loadMatchStats = async () => {
            try {
                if (userProfile) {
                    const [gameName, tagLine] = userProfile.riotnickname.split('#');
                    const data = await fetchMatchStats(gameName, tagLine, 10);
                    setMatchStats(data);
                }
            } catch (error) {
                console.error('Error fetching match stats:', error);
                // @ts-ignore
                setError(error.message);
            }
        };

        loadMatchStats();
    }, [userProfile]);

    if (error) {
        return <Alert variant="danger">Error: {error}</Alert>;
    }

    if (!userProfile) {
        return <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner>;
    }

    const [gameName, tagLine] = userProfile.riotnickname.split('#');

    const getChampionImageUrl = (championName: string) => {
        return `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${championName}.png`;
    };

    return (
        <Container className="custom-margin-top">
            <Card>
                <Card.Header>
                    <h2>{userProfile.nombreusuario}</h2>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col lg={5}>
                            <Row className="mt-3 align-items-start justify-content-center">
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
                            <Row className="mb-3 mt-4 ">
                                <Col>
                                    <p><strong>Email:</strong> {userProfile.email}</p>
                                    <p><strong>Rango Actual:</strong> {userProfile.rangoactual}</p>
                                    <p><strong>Rol Principal:</strong> {userProfile.rolprincipal}</p>
                                    <p><strong>Región:</strong> {userProfile.region}</p>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={7} >
                            {matchStats.length === 0 ? (
                                <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner>
                            ) : (
                                <Table className="custom-table" bordered hover>
                                    <thead>
                                    <tr>

                                    </tr>
                                    </thead>
                                    <tbody>
                                    {matchStats.map((stat) => (
                                        <tr key={stat.matchId} className="row-shadow">
                                            <td className={stat.win ? 'victory-cell' : 'defeat-cell'}>
                                                <div style={{display: 'flex', alignItems: 'center'}}>
                                                    <img
                                                        src={getChampionImageUrl(stat.championName)}
                                                        alt={stat.championName}
                                                        style={{
                                                            width: '70px',
                                                            height: '70px',
                                                            marginRight: '10px',
                                                            borderRadius: '10%'
                                                        }}
                                                    />
                                                    <span style={{
                                                        color: stat.win ? '#007bff' : '#dc3545',
                                                        fontSize: '1.2em',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {stat.win ? 'Victoria' : 'Derrota'}
                                                    </span>
                                                    <div className="kda-text">
                                                        {`${stat.kills}/${stat.deaths}/${stat.assists}`}
                                                        <div className="kd-text">{`KD: ${stat.kd.toFixed(2)}`}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={`stat-cell ${stat.win ? 'victory-cell' : 'defeat-cell'}`}>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            )}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default UserProfileComponent;
