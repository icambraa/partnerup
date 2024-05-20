export interface MatchDetails {
    metadata: {
        matchId: string;
        participants: string[];
    };
    info: {
        gameDuration: number;
        participants: Participant[];
    };
}

export interface Participant {
    puuid: string;
    championName: string;
    kills: number;
    deaths: number;
    assists: number;
    win: boolean;
    riotIdGameName: string;
    riotIdTagline: string;
    summoner1Id: number;
    summoner2Id: number;
}