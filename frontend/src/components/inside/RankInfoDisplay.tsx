import React, { useState, useEffect } from 'react';

type RankInfoDisplayProps = {
    gameName: string;
    tagLine: string;
    applyColor?: boolean; // Nueva prop opcional
};

type RankInfo = {
    tier: string;
    rank: string;
    leaguePoints: number;
};

const RankInfoDisplay: React.FC<RankInfoDisplayProps> = ({ gameName, tagLine, applyColor = true }) => {
    const [rankInfo, setRankInfo] = useState<RankInfo | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRankInfo = async () => {
            if (!gameName || !tagLine) {
                console.error('Error: gameName and tagLine must be defined');
                return;
            }
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

    const getRankColor = (tier: string) => {
        switch (tier) {
            case 'BRONZE':
                return '#cd7f32';
            case 'SILVER':
                return '#c0c0c0';
            case 'GOLD':
                return '#ffd700';
            case 'PLATINUM':
                return '#00ff00';
            case 'DIAMOND':
                return '#00ffff';
            case 'MASTER':
                return '#ff00ff';
            case 'GRANDMASTER':
                return '#ff4500';
            case 'CHALLENGER':
                return '#ff0000';
            default:
                return '#ffffff';
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!rankInfo) {
        return <div>Cargando...</div>;
    }

    const rankColor = getRankColor(rankInfo.tier);
    const style = applyColor ? { color: rankColor } : {};

    return (
        <div style={style}>
            {rankInfo.tier === "UNRANKED" ? (
                <div>UNRANKED</div>
            ) : (
                <div>{rankInfo.tier} {rankInfo.rank} {rankInfo.leaguePoints} LP</div>
            )}
        </div>
    );
};

export default RankInfoDisplay;