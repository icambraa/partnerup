import React, { useState, useEffect } from 'react';

export type RankInfo = {
    tier: string;
    rank: string;
    leaguePoints: number;
};

type RankInfoDisplayProps = {
    gameName: string;
    tagLine: string;
    applyColor?: boolean;
    onRankInfoChange?: (rankInfo: RankInfo | null) => void;
};

const RankInfoDisplay: React.FC<RankInfoDisplayProps> = ({ gameName, tagLine, applyColor = true, onRankInfoChange }) => {
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
                const response = await fetch(url.toString());
                if (response.ok) {
                    const data: RankInfo = await response.json();
                    setRankInfo(data);
                    if (onRankInfoChange) {
                        onRankInfoChange(data);
                    }
                } else {
                    throw new Error('Failed to fetch rank info');
                }
            } catch (error: any) {
                setError('Error al cargar');
                console.error('Error fetching rank info:', error.message);
            }
        };

        fetchRankInfo();
    }, [gameName, tagLine, onRankInfoChange]);

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
        return <div> </div>;
    }

    if (!rankInfo || !rankInfo.tier || rankInfo.tier === "UNRANKED") {
        return <div style={{ fontWeight: 'bold' }}>UNRANKED</div>;
    }

    const rankColor = getRankColor(rankInfo.tier);
    const rankStyle = applyColor ? { color: rankColor, fontWeight: 'bold' } : { fontWeight: 'bold' };
    const lpStyle = { fontWeight: 'normal' };

    return (
        <div>
            <span style={rankStyle}>{rankInfo.tier} {rankInfo.rank}</span> <span style={lpStyle}>{rankInfo.leaguePoints} LP</span>
        </div>
    );
};

export default RankInfoDisplay;