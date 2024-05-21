import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserProfile as UserProfileInterface } from '../../interfaces/UserProfileInterface';
import { MatchDetails, Participant } from '../../interfaces/MatchDetailsInterface';
import WinRateDisplayCircle from './WinRateDisplayCircle';
import IconProfileDisplay from './IconProfileDisplay';
import RankInfoDisplay, { RankInfo } from './RankInfoDisplay';
import { Card, Spinner, Alert, Container, Row, Col, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserProfileStyles.css';
import { Link } from "react-router-dom";
import { getRankIconUrl } from '../../utils/rankUtils';

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
    const [rankInfo, setRankInfo] = useState<RankInfo | null>(null);

    const rankIconUrl = rankInfo ? getRankIconUrl(rankInfo.tier) : '';

    const getSummonerSpellIconUrl = (spellId) => {
        return `https://lolcdn.darkintaqt.com/cdn/spells/${spellId}`;
    };

    useEffect(() => {
        const loadUserProfile = async () => {
            setLoading(true);
            try {
                if (riotnickname) {
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
                    const data: MatchDetails[] = await fetchMatchStats(gameName, tagLine, 10);

                    const updatedData = data.map((match: MatchDetails) => {
                        const participantsWithNames = match.info.participants.map((participant: Participant) => {
                            const { puuid, riotIdGameName, riotIdTagline } = participant;
                            return { ...participant, riotIdGameName, riotIdTagline };
                        });
                        return { ...match, info: { ...match.info, participants: participantsWithNames } };
                    });

                    setMatchStats(updatedData);
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
        if (championName === "FiddleSticks") {
            return `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/Fiddlesticks.png`;
        }
        return `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${championName}.png`;
    };

    console.log("Rango actual del usuario:", userProfile.rangoactual);

    return (
        <Container className="custom-margin-top">
            <Card className="custom-card">
                <Card.Header>
                    <h2>{userProfile.nombreusuario || 'User Profile'}</h2>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col lg={5}>
                            <div className="profile-info-container">
                                <Row className="align-items-center">
                                    <Col md="auto" className="image-container">
                                        <IconProfileDisplay
                                            gameName={gameName}
                                            tagLine={tagLine}
                                            width="130px"
                                            height="130px"
                                            borderRadius="10%"
                                        />
                                    </Col>
                                    <Col className="nickname-container">
                                        <h5 className="nickname-text">{userProfile?.riotnickname || 'Sin apodo'}</h5>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            {rankIconUrl && (
                                                <>
                                                    <img
                                                        src={rankIconUrl}
                                                        alt={rankInfo?.tier}
                                                        style={{ width: '40px', height: '40px', marginRight: '10px' }}
                                                    />
                                                    {console.log("URL del icono del rango:", rankIconUrl)}
                                                </>
                                            )}
                                            <RankInfoDisplay
                                                gameName={gameName}
                                                tagLine={tagLine}
                                                onRankInfoChange={setRankInfo}
                                            />
                                        </div>
                                    </Col>
                                    <Col md="auto" className="circle-container">
                                        <WinRateDisplayCircle
                                            gameName={gameName}
                                            tagLine={tagLine}
                                        />
                                    </Col>
                                </Row>
                            </div>
                            <Row className="mb-3 mt-4">
                                <Col>
                                    {userProfile.email && <p><strong>Email:</strong> {userProfile.email}</p>}
                                    {userProfile.rangoactual &&
                                        <p><strong>Rango Actual:</strong> {userProfile.rangoactual}</p>}
                                    {userProfile.rolprincipal &&
                                        <p><strong>Rol Principal:</strong> {userProfile.rolprincipal}</p>}
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
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {matchStats.map((match) => {
                                        const userParticipant = match.info.participants.find(
                                            (p: Participant) => p.riotIdGameName === gameName && p.riotIdTagline === tagLine
                                        );
                                        return (
                                            <tr key={match.metadata.matchId} className="row-shadow">
                                                <td
                                                    className={userParticipant?.win ? 'victory-cell' : 'defeat-cell'}
                                                    style={{ verticalAlign: 'middle' }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <img
                                                            src={getChampionImageUrl(userParticipant?.championName || '')}
                                                            alt={userParticipant?.championName || ''}
                                                            style={{
                                                                width: '70px',
                                                                height: '70px',
                                                                marginRight: '10px',
                                                                borderRadius: '10%'
                                                            }}
                                                        />
                                                        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '-10px'}}>
                        <span style={{
                            color: userParticipant?.win ? '#007bff' : '#dc3545',
                            fontSize: '1.2em',
                            fontWeight: 'bold',
                        }}>
                            {userParticipant?.win ? 'Victoria' : 'Derrota'}
                        </span>
                                                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                                                <img
                                                                    src={getSummonerSpellIconUrl(userParticipant?.summoner1Id || '')}
                                                                    alt={`Summoner Spell ${userParticipant?.summoner1Id}`}
                                                                    style={{ width: '30px', height: '30px', marginRight: '5px' }}
                                                                />
                                                                <img
                                                                    src={getSummonerSpellIconUrl(userParticipant?.summoner2Id || '')}
                                                                    alt={`Summoner Spell ${userParticipant?.summoner2Id}`}
                                                                    style={{ width: '30px', height: '30px' }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="kda-text" style={{ marginLeft: '75px' }}>
                                                            {`${userParticipant?.kills || 0}/${userParticipant?.deaths || 0}/${userParticipant?.assists || 0}`}
                                                            <div className="kd-text">
                                                                {`KD: ${userParticipant?.kills && userParticipant?.deaths !== 0 ? (userParticipant.kills / userParticipant.deaths).toFixed(2) : 'Infinity'}`}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={userParticipant?.win ? 'victory-cell' : 'defeat-cell'}
                                                    style={{ margin: '0', padding: '5px' }}>
                                                    <ul style={{ listStyleType: 'none', margin: '0', padding: '0' }}>
                                                        {match.info.participants.slice(0, 5).map((participant: Participant, index: number) => (
                                                            <li key={index}
                                                                style={{ marginBottom: '1px' }}>
                                                                <Link
                                                                    to={`/profile/${encodeURIComponent(participant.riotIdGameName)}${encodeURIComponent('#')}${encodeURIComponent(participant.riotIdTagline)}`}
                                                                    style={{
                                                                        fontSize: '0.8em',
                                                                        width: '150px',
                                                                        whiteSpace: 'nowrap',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        display: 'block',
                                                                        padding: '0'
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={getChampionImageUrl(participant.championName)}
                                                                        alt={participant.championName}
                                                                        style={{
                                                                            width: '20px',
                                                                            height: '20px',
                                                                            marginRight: '5px'
                                                                        }}
                                                                    />
                                                                    {`${participant.riotIdGameName}#${participant.riotIdTagline}`.substring(0, 10)}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td className={userParticipant?.win ? 'victory-cell' : 'defeat-cell'}
                                                    style={{ margin: '0', padding: '5px' }}>
                                                    <ul style={{ listStyleType: 'none', margin: '0', padding: '0' }}>
                                                        {match.info.participants.slice(5, 10).map((participant: Participant, index: number) => (
                                                            <li key={index}
                                                                style={{ marginBottom: '1px' }}>
                                                                <Link
                                                                    to={`/profile/${encodeURIComponent(participant.riotIdGameName)}${encodeURIComponent('#')}${encodeURIComponent(participant.riotIdTagline)}`}
                                                                    style={{
                                                                        fontSize: '0.8em',
                                                                        width: '150px',
                                                                        whiteSpace: 'nowrap',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        display: 'block',
                                                                        padding: '0'
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={getChampionImageUrl(participant.championName)}
                                                                        alt={participant.championName}
                                                                        style={{
                                                                            width: '20px',
                                                                            height: '20px',
                                                                            marginRight: '5px'
                                                                        }}
                                                                    />
                                                                    {`${participant.riotIdGameName}#${participant.riotIdTagline}`.substring(0, 10)}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </td>
                                            </tr>
                                        );
                                    })}

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
