export const getChampionImageUrl = (championName: string) => {
    if (championName === "FiddleSticks") {
        return `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/Fiddlesticks.png`;
    }
    return `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${championName}.png`;
};

export const getSummonerSpellIconUrl = (spellId: string) => {
    return `https://lolcdn.darkintaqt.com/cdn/spells/${spellId}`;
};
