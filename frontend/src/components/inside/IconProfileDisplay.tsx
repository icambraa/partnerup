import React, { useState, useEffect } from 'react';

type IconProfileDisplayProps = {
    gameName: string;
    tagLine: string;
};

const IconProfileDisplay: React.FC<IconProfileDisplayProps> = ({ gameName, tagLine }) => {
    const [profileIconUrl, setProfileIconUrl] = useState<string>('');

    useEffect(() => {
        const fetchProfileIconUrl = async () => {
            try {
                const url = `http://localhost:8080/summoner/profileiconurl?gameName=${gameName}&tagLine=${tagLine}`;
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.text();
                    setProfileIconUrl(data);
                } else {
                    throw new Error('Failed to fetch profile icon URL');
                }
            } catch (error) {
                console.error('Error fetching profile icon URL:', error);
            }
        };

        fetchProfileIconUrl();
    }, [gameName, tagLine]);

    return (
        <img src={profileIconUrl} alt="Profile Icon" className="icon-profile-image"/>
    );
};

export default IconProfileDisplay;