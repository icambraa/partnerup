export interface Anuncio {
    discordChannelLink: string | undefined;
    id: number;
    riotNickname: string;
    winrate: number;
    rol: string;
    buscaRol: string;
    rango: string;
    comentario: string;
    createdAt: string;
    userId?: string;
    profileIconUrl: string;
}