import React, { useState, useEffect } from 'react';

type RankInfoDisplayProps = {
    gameName: string;
    tagLine: string;
};

type RankInfo = {
    tier: string;
    rank: string;
    leaguePoints: number;
};

const RankInfoDisplay: React.FC<RankInfoDisplayProps> = ({ gameName, tagLine }) => {
    const [rankInfo, setRankInfo] = useState<RankInfo | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRankInfo = async () => {
            try {
                const url = new URL('http://localhost:8080/summoner/rankinfo');
                url.searchParams.append('gameName', gameName);
                url.searchParams.append('tagLine', tagLine);
                const response = await fetch(url);
                if (response.ok) {
                    const data: RankInfo = await response.json();
                    setRankInfo(data);
                } else {
                    throw new Error('Failed to fetch rank info');
                }
            } catch (error: any) {
                setError('Error al cargar');
                console.error('Error fetching rank info:', error.message);
            }
        };

        fetchRankInfo();
    }, [gameName, tagLine]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!rankInfo) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            {rankInfo.tier === "UNRANKED" ? (
                <div>UNRANKED</div>
            ) : (
                <div>{rankInfo.tier} {rankInfo.rank} {rankInfo.leaguePoints} LP</div>
            )}
        </div>
    );
};

export default RankInfoDisplay;