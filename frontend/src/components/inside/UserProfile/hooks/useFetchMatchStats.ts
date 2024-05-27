import { useState, useEffect } from 'react';
import { MatchDetails, Participant } from '../../../../interfaces/MatchDetailsInterface';

const fetchMatchStats = async (gameName: string, tagLine: string, count: number) => {
    const response = await fetch(`http://localhost:8080/lastgames?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}&count=${count}`);
    if (!response.ok) {
        throw new Error('Failed to fetch match stats');
    }
    return response.json();
};

export const useFetchMatchStats = (riotnickname?: string) => {
    const [matchStats, setMatchStats] = useState<MatchDetails[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadMatchStats = async () => {
            if (riotnickname) {
                setLoading(true);
                try {
                    const [gameName, tagLine] = riotnickname.split('#');
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
    }, [riotnickname]);

    return { matchStats, error, loading };
};
