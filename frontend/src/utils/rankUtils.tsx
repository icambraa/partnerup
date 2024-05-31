export const getRankIconUrl = (rank: string): string => {
    const rankIcons: { [key: string]: string } = {
        'Hierro': 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/iron.png',
        'Bronce': 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/bronze.png',
        'Plata': 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/silver.png',
        'Oro': 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/gold.png',
        'Platino': 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/platinum.png',
        'Diamante': 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/diamond.png',
        'Master': 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/master.png',
        'Grandmaster': 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/grandmaster.png',
        'Challenger': 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/challenger.png'
    };

    return rankIcons[rank] || '';
};
