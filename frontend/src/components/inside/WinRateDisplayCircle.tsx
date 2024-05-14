import React, { useState, useEffect, CSSProperties } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

type WinRateDisplayCircleProps = {
    gameName: string;
    tagLine: string;
};

type WinRateResponse = {
    winRate: number;
    wins: number;
    losses: number;
};

const WinRateDisplayCircle: React.FC<WinRateDisplayCircleProps> = ({ gameName, tagLine }) => {
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

    const containerStyle: CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%'
    };

    const circleContainerStyle: CSSProperties = {
        width: '150px',
        height: '150px',
        position: 'relative'
    };

    const svgStyle: CSSProperties = {
        width: '100%',
        height: '100%',
        transform: 'rotate(-185deg)'
    };

    const textStyle: CSSProperties = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '1.2em',
        fontWeight: 'bold',
        color: '#000'
    };

    const circleStyle: CSSProperties = {
        fill: 'none',
        strokeWidth: '10'
    };

    const backgroundCircleStyle: CSSProperties = {
        ...circleStyle,
        stroke: '#dc3545'
    };

    const foregroundCircleStyle: CSSProperties = {
        ...circleStyle,
        stroke: '#007bff',
        strokeLinecap: 'round',
        transition: 'stroke-dasharray 0.6s ease 0s'
    };

    const radius = 30;
    const circumference = 2 * Math.PI * radius;

    const progress = winRateData ? (winRateData.winRate / 100) * circumference : 0;

    return (
        <div style={containerStyle}>
            {error ? (
                <div>{error}</div>
            ) : winRateData !== null ? (
                <div style={circleContainerStyle}>
                    <svg style={svgStyle}>
                        <circle
                            style={backgroundCircleStyle}
                            cx="50%"
                            cy="50%"
                            r={`${radius}%`}
                        />
                        <circle
                            style={foregroundCircleStyle}
                            cx="50%"
                            cy="50%"
                            r={`${radius}%`}
                            strokeDasharray={circumference}
                            strokeDashoffset={circumference - progress}
                        />
                    </svg>
                    <div style={textStyle}>
                        {Math.round(winRateData.winRate)}%
                    </div>
                </div>
            ) : (
                <div>Cargando...</div>
            )}
        </div>
    );
};

export default WinRateDisplayCircle;
