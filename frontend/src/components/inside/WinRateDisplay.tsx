import React, { useState, useEffect } from 'react';

type WinRateDisplayProps = {
    gameName: string;
    tagLine: string;
};

const WinRateDisplay: React.FC<WinRateDisplayProps> = ({ gameName, tagLine }) => {
    const [winRate, setWinRate] = useState<string>('Cargando...');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWinRate = async () => {
            try {
                const url = new URL('http://localhost:8080/summoner/winrate');
                url.searchParams.append('gameName', gameName);
                url.searchParams.append('tagLine', tagLine);
                const response = await fetch(url);
                if (response.ok) {
                    const winRate: number = await response.json();
                    setWinRate(`${winRate}%`);
                } else {
                    throw new Error('Failed to fetch winrate');
                }
            } catch (error: any) {
                setError('Error al cargar');
                console.error('Error fetching winrate:', error.message);
            }
        };

        fetchWinRate();
    }, [gameName, tagLine]);

    return (
        <td style={{textAlign: 'center'}}>{error || winRate}</td>
    );
};

export default WinRateDisplay;