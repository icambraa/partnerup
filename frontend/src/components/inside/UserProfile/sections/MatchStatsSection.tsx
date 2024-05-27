import React from 'react';
import { Table, Alert, Spinner } from 'react-bootstrap';
import { MatchDetails, Participant } from '../../../../interfaces/MatchDetailsInterface';
import { Link } from "react-router-dom";

const getChampionImageUrl = (championName: string) => {
    if (championName === "FiddleSticks") {
        return `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/Fiddlesticks.png`;
    }
    return `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${championName}.png`;
};

const getSummonerSpellIconUrl = (spellId: string) => {
    return `https://lolcdn.darkintaqt.com/cdn/spells/${spellId}`;
};

interface MatchStatsSectionProps {
    matchStats: MatchDetails[];
    error: string;
    loading: boolean;
    gameName: string;
    tagLine: string;
}

const MatchStatsSection: React.FC<MatchStatsSectionProps> = ({ matchStats, error, loading, gameName, tagLine }) => {
    if (error) {
        return <Alert variant="danger">Error: {error}</Alert>;
    }

    if (loading) {
        return <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner>;
    }

    if (matchStats.length === 0) {
        return <p>No match stats available.</p>;
    }

    return (
        <div className="table-responsive">
            <Table className="custom-table" bordered hover>
                <thead>
                <tr>
                    {/* Añadir encabezados de columna aquí */}
                </tr>
                </thead>
                <tbody>
                {matchStats.map((match) => {
                    const userParticipant = match.info.participants.find(
                        (p: Participant) => p.riotIdGameName === gameName && p.riotIdTagline === tagLine
                    );

                    if (!userParticipant) {
                        return null;
                    }

                    return (
                        <tr key={match.metadata.matchId} className="row-shadow">
                            <td
                                className={userParticipant.win ? 'victory-cell' : 'defeat-cell'}
                                style={{ verticalAlign: 'middle' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <img
                                        src={getChampionImageUrl(userParticipant.championName || '')}
                                        alt={userParticipant.championName || ''}
                                        style={{
                                            width: '70px',
                                            height: '70px',
                                            marginRight: '10px',
                                            borderRadius: '10%'
                                        }}
                                    />
                                    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '-10px' }}>
                                            <span style={{
                                                color: userParticipant.win ? '#007bff' : '#dc3545',
                                                fontSize: '1.2em',
                                                fontWeight: 'bold',
                                            }}>
                                                {userParticipant.win ? 'Victoria' : 'Derrota'}
                                            </span>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginTop: '10px'
                                        }}>
                                            <img
                                                src={getSummonerSpellIconUrl(userParticipant.summoner1Id?.toString() || '')}
                                                alt={`Summoner Spell ${userParticipant.summoner1Id}`}
                                                style={{
                                                    width: '30px',
                                                    height: '30px',
                                                    marginRight: '5px'
                                                }}
                                            />
                                            <img
                                                src={getSummonerSpellIconUrl(userParticipant.summoner2Id?.toString() || '')}
                                                alt={`Summoner Spell ${userParticipant.summoner2Id}`}
                                                style={{ width: '30px', height: '30px' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="kda-text kd-column"
                                         style={{ marginLeft: '75px' }}>
                                        {`${userParticipant.kills || 0}/${userParticipant.deaths || 0}/${userParticipant.assists || 0}`}
                                        <div className="kd-text kda-column">
                                            {`KD: ${userParticipant.kills && userParticipant.deaths !== 0 ? (userParticipant.kills / userParticipant.deaths).toFixed(2) : 'Infinity'}`}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className={userParticipant.win ? 'victory-cell' : 'defeat-cell'}
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
                            <td className={userParticipant.win ? 'victory-cell' : 'defeat-cell'}
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
        </div>
    );
};

export default MatchStatsSection;