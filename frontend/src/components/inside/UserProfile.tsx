import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserProfile as UserProfileInterface } from '../../interfaces/UserProfileInterface';
import { MatchDetails } from '../../interfaces/MatchDetailsInterface';
import WinRateDisplayCircle from './WinRateDisplayCircle';
import IconProfileDisplay from './IconProfileDisplay';
import { Card, Spinner, Alert, Container, Row, Col, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserProfileStyles.css';

const fetchUserProfile = async (email: string) => {
    const response = await fetch(`http://localhost:8080/api/profiles/by-email?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
        throw new Error('Failed to fetch user profile');
    }
    return response.json();
};

const fetchMatchStats = async (gameName: string, tagLine: string, count: number) => {
    const response = await fetch(`http://localhost:8080/lastgames?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}&count=${count}`);
    if (!response.ok) {
        throw new Error('Failed to fetch match stats');
    }
    return response.json();
};

interface UserProfileComponentProps {
    riotnickname?: string;
}

const UserProfileComponent: React.FC<UserProfileComponentProps> = ({ riotnickname }) => {
    const { currentUser } = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfileInterface | null>(null);
    const [matchStats, setMatchStats] = useState<MatchDetails[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadUserProfile = async () => {
            setLoading(true);
            try {
                if (riotnickname) {
                    // Si se proporciona un riotnickname, creamos un perfil temporal.
                    setUserProfile({ riotnickname } as UserProfileInterface);
                } else if (currentUser?.email) {
                    const data = await fetchUserProfile(currentUser.email);
                    setUserProfile(data);
                }
            } catch (error: any) {
                console.error('Error fetching user data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadUserProfile();
    }, [currentUser, riotnickname]);

    useEffect(() => {
        const loadMatchStats = async () => {
            if (userProfile?.riotnickname) {
                setLoading(true);
                try {
                    const [gameName, tagLine] = userProfile.riotnickname.split('#');
                    const data = await fetchMatchStats(gameName, tagLine, 10);
                    setMatchStats(data);
                } catch (error: any) {
                    console.error('Error fetching match stats:', error);
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            }
        };

        loadMatchStats();
    }, [userProfile]);


    if (error) {
        return <Alert variant="danger">Error: {error}</Alert>;
    }

    if (loading) {
        return <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner>;
    }

    if (!userProfile) {
        return null;
    }

    const [gameName, tagLine] = userProfile.riotnickname.split('#');

    const getChampionImageUrl = (championName: string) => {
        // fiddlestick bug
        if (championName === "FiddleSticks") {
            return `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/Fiddlesticks.png`;
        }

        return `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${championName}.png`;
    };


    // @ts-ignore
    return (
        <Container className="custom-margin-top">
            <Card>
                <Card.Header>
                    <h2>{userProfile.nombreusuario || 'User Profile'}</h2>
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
                            <Row className="mb-3 mt-4">
                                <Col>
                                    {userProfile.email && <p><strong>Email:</strong> {userProfile.email}</p>}
                                    {userProfile.rangoactual && <p><strong>Rango Actual:</strong> {userProfile.rangoactual}</p>}
                                    {userProfile.rolprincipal && <p><strong>Rol Principal:</strong> {userProfile.rolprincipal}</p>}
                                    {userProfile.region && <p><strong>Región:</strong> {userProfile.region}</p>}
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={7}>
                            {matchStats.length === 0 ? (
                                <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner>
                            ) : (
                                <Table className="custom-table" bordered hover>
                                    <thead>
                                    <tr>
                                        {/* Aquí puedes agregar tus encabezados de tabla si los tienes */}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {matchStats.map((match) => (
                                        <tr key={match.metadata.matchId} className="row-shadow">
                                            <td className={match.info.participants.some(p => p.win) ? 'victory-cell' : 'defeat-cell'}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <img
                                                        src={getChampionImageUrl(match.info.participants[0].championName)}
                                                        alt={match.info.participants[0].championName}
                                                        style={{
                                                            width: '70px',
                                                            height: '70px',
                                                            marginRight: '10px',
                                                            borderRadius: '10%'
                                                        }}
                                                    />
                                                    <span style={{
                                                        color: match.info.participants.some(p => p.win) ? '#007bff' : '#dc3545',
                                                        fontSize: '1.2em',
                                                        fontWeight: 'bold'
                                                    }}>
                            {match.info.participants.some(p => p.win) ? 'Victoria' : 'Derrota'}
                        </span>
                                                    <div className="kda-text">
                                                        {`${match.info.participants[0].kills}/${match.info.participants[0].deaths}/${match.info.participants[0].assists}`}
                                                        <div className="kd-text">{`KD: ${(match.info.participants[0].kills / match.info.participants[0].deaths).toFixed(2)}`}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={match.info.participants.some(p => p.win) ? 'victory-cell' : 'defeat-cell'}>
                                                <ul>
                                                    {match.info.participants.map((participant, index) => (
                                                        <li key={index}>{participant.puuid}</li>), {/* Aquí se muestra el identificador del participante */}
                                                    )}
                                                </ul>
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
