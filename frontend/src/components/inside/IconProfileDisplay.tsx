import React, { useState, useEffect } from 'react';

type IconProfileDisplayProps = {
    gameName: string;
    tagLine: string;
    width: string;
    height: string;
    borderRadius: string;
    style?: React.CSSProperties;
};

const IconProfileDisplay: React.FC<IconProfileDisplayProps> = ({ gameName, tagLine, width, height, borderRadius }) => {
    const [profileIconUrl, setProfileIconUrl] = useState<string>('');
    const [imageLoaded, setImageLoaded] = useState<boolean>(true);

    useEffect(() => {
        const fetchProfileIconUrl = async () => {
            try {
                const url = `http://localhost:8080/summoner/profileiconurl?gameName=${gameName}&tagLine=${tagLine}`;
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.text();
                    setProfileIconUrl(data);
                    setImageLoaded(true); // Reset imageLoaded in case of retry
                } else {
                    throw new Error('Failed to fetch profile icon URL');
                }
            } catch (error) {
                console.error('Error fetching profile icon URL:', error);
                setImageLoaded(false);
            }
        };

        fetchProfileIconUrl();
    }, [gameName, tagLine]);

    const handleImageError = () => {
        setImageLoaded(false);
    };

    return (
        <div className="icon-profile-container">
            {imageLoaded && (
                <img
                    src={profileIconUrl}
                    alt="Profile Icon"
                    className="icon-profile-image"
                    style={{ width, height, borderRadius }}
                    onError={handleImageError}
                />
            )}
        </div>
    );
};

export default IconProfileDisplay;
