import React, { useState, useEffect, CSSProperties } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

type WinRateDisplayLProps = {
    gameName: string;
    tagLine: string;
};

type WinRateResponse = {
    winRate: number;
    wins: number;
    losses: number;
};

const WinRateDisplayL: React.FC<WinRateDisplayLProps> = ({ gameName, tagLine }) => {
    const [winRateData, setWinRateData] = useState<WinRateResponse | null>(null);
    const [, setError] = useState<string | null>(null);

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

    const containerStyle: CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%'
    };

    const lContainerStyle: CSSProperties = {
        width: '300px',
        height: '300px',
        position: 'relative'
    };

    const svgStyle: CSSProperties = {
        width: '100%',
        height: '100%'
    };

    const textContainerStyle: CSSProperties = {
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#000'
    };

    const lStyle: CSSProperties = {
        fill: 'none',
        strokeWidth: '5'
    };

    const backgroundLStyle: CSSProperties = {
        ...lStyle,
        stroke: '#dc3545'
    };

    const foregroundLStyle: CSSProperties = {
        ...lStyle,
        stroke: '#007bff',
    };

    const totalLength = 300;
    const firstLineLength = totalLength * 0.8;
    const secondLineLength = totalLength * 0.2;
    const lLength = firstLineLength + secondLineLength;

    const startX = 10;
    const startY = 150;

    const progress = winRateData ? (winRateData.winRate / 100) * lLength : 0;

    return (
        <div style={containerStyle}>
            {winRateData !== null ? (
                <div style={lContainerStyle}>
                    <svg style={svgStyle}>
                        <path
                            d={`M ${startX},${startY} L ${startX + firstLineLength},${startY} L ${startX + firstLineLength},${startY - secondLineLength}`}
                            style={backgroundLStyle}
                            strokeDasharray={lLength}
                            strokeDashoffset={0}
                        />
                        <path
                            d={`M ${startX},${startY} L ${startX + firstLineLength},${startY} L ${startX + firstLineLength},${startY - secondLineLength}`}
                            style={foregroundLStyle}
                            strokeDasharray={lLength}
                            strokeDashoffset={lLength - progress}
                        />
                    </svg>
                    <div style={{...textContainerStyle, marginTop: '40px', marginLeft: '38px'}}>
                        <div style={{fontSize: '14px'}}>
                            {Math.round(winRateData.winRate)}% WINRATE
                        </div>
                    </div>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    );
};

export default WinRateDisplayL;
