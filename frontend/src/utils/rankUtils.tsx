export const getRankIconUrl = (rank: string): string => {
    const rankIcons: { [key: string]: string } = {
        'IRON': 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/iron.png',
        'BRONZE': 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/bronze.png',
        'SILVER': 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/silver.png',
        'GOLD': 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/gold.png',
        'PLATINUM': 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/platinum.png',
        'DIAMOND': 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/diamond.png',
        'MASTER': 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/master.png',
        'GRANDMASTER': 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/grandmaster.png',
        'CHALLENGER': 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/challenger.png'
    };

    console.log("Rank received:", rank);
    console.log("Icon URL returned:", rankIcons[rank] || '');

    return rankIcons[rank] || '';
};