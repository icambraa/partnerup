import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

type WinRateDisplayProps = {
    gameName: string;
    tagLine: string;
};

type WinRateResponse = {
    winRate: number;
    wins: number;
    losses: number;
};

const WinRateDisplay: React.FC<WinRateDisplayProps> = ({ gameName, tagLine }) => {
    const [winRateData, setWinRateData] = useState<WinRateResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWinRate = async () => {
            try {
                const url = new URL('http://localhost:8080/summoner/winrate');
                url.searchParams.append('gameName', gameName);
                url.searchParams.append('tagLine', tagLine);
                const response = await fetch(url);
                if (response.ok) {
                    const data: WinRateResponse = await response.json();
                    setWinRateData(data);
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
        <div style={{ display: 'flex', justifyContent: 'center' }}> {/* Añade este contenedor para centrar el componente */}
            <div style={{ textAlign: 'center', width: '100%' }}>
                {error ? (
                    <div>{error}</div>
                ) : winRateData !== null ? (
                    <div style={{ width: '70%', margin: '0 auto' }}>
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            height: '30px',
                            backgroundColor: '#dc3545',
                            borderRadius: '4px'
                        }}>
                            <div
                                style={{
                                    position: 'absolute',
                                    width: `${winRateData.winRate}%`,
                                    height: '100%',
                                    backgroundColor: '#007bff',
                                    borderRadius: '4px 0 0 4px'
                                }}
                            ></div>
                            <div style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                color: '#fff',
                                fontWeight: 'bold',
                                padding: '0 5px',
                                boxSizing: 'border-box',
                                fontSize: '0.8em'
                            }}>
                                <span style={{textAlign: 'left'}}>{winRateData.wins}W</span>
                                <span style={{textAlign: 'right'}}>{winRateData.losses}L</span>
                            </div>
                        </div>
                        <div style={{marginTop: '3px', color: '#000', fontSize: '0.8em'}}>
                            {Math.round(winRateData.winRate)}%
                        </div>
                    </div>
                ) : (
                    <div>Cargando...</div>
                )}
            </div>
        </div>
    );
};

export default WinRateDisplay;