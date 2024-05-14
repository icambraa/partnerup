package com.partnerup.backend.service;

import com.partnerup.backend.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class SummonerService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${riot.api.key}")
    private String apiKey;

    public WinRateResponse calculateWinRate(String gameName, String tagLine) throws Exception {
        String puuid = getPUUID(gameName, tagLine);
        SummonerDto summoner = getSummoner(puuid);
        LeagueEntryDto[] leagueEntries = getLeagueEntries(summoner.getId());
        return calculateWinRateDetails(leagueEntries);
    }

    private String getPUUID(String gameName, String tagLine) {
        String url = String.format("https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/%s/%s?api_key=%s",
                gameName, tagLine, apiKey);
        ResponseEntity<AccountDto> response = restTemplate.getForEntity(url, AccountDto.class);
        return response.getBody().getPuuid();
    }

    private SummonerDto getSummoner(String puuid) {
        String url = String.format("https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/%s?api_key=%s", puuid, apiKey);
        ResponseEntity<SummonerDto> response = restTemplate.getForEntity(url, SummonerDto.class);
        return response.getBody();
    }

    private LeagueEntryDto[] getLeagueEntries(String summonerId) {
        String url = String.format("https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/%s?api_key=%s", summonerId, apiKey);
        ResponseEntity<LeagueEntryDto[]> response = restTemplate.getForEntity(url, LeagueEntryDto[].class);
        return response.getBody();
    }

    private WinRateResponse calculateWinRateDetails(LeagueEntryDto[] leagueEntries) {
        if (leagueEntries.length == 0) {
            return new WinRateResponse(0, 0, 0);
        }
        LeagueEntryDto entry = leagueEntries[0];
        int wins = entry.getWins();
        int losses = entry.getLosses();
        int totalGames = wins + losses;
        double winRate = totalGames == 0 ? 0 : Math.round(100.0 * wins / totalGames);
        return new WinRateResponse(winRate, wins, losses);
    }

    @Value("${riot.profile.icon.base.url}")
    private String profileIconBaseUrl;

    public String getProfileIconUrl(String gameName, String tagLine) {
        String puuid = getPUUID(gameName, tagLine);
        SummonerDto summoner = getSummoner(puuid);
        int profileIconId = summoner.getProfileIconId();
        return profileIconBaseUrl + profileIconId + ".png";
    }


    public List<String> getLastMatchIds(String puuid, int start, int count) {
        String url = String.format("https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/%s/ids?start=%d&count=%d&api_key=%s",
                puuid, start, count, apiKey);
        ResponseEntity<List<String>> response = restTemplate.getForEntity(url, (Class<List<String>>)(Object)List.class);
        return response.getBody();
    }

    // Nuevo método para obtener los detalles de una partida
    public MatchDetailsDto getMatchDetails(String matchId) {
        String url = String.format("https://europe.api.riotgames.com/lol/match/v5/matches/%s?api_key=%s", matchId, apiKey);
        ResponseEntity<MatchDetailsDto> response = restTemplate.getForEntity(url, MatchDetailsDto.class);
        return response.getBody();
    }

    // Método para obtener las estadísticas de las últimas partidas
    public List<MatchStatDto> getLastMatchStats(String gameName, String tagLine, int count) {
        String puuid = getPUUID(gameName, tagLine);
        List<String> matchIds = getLastMatchIds(puuid, 0, count);
        List<MatchStatDto> matchStats = new ArrayList<>();

        for (String matchId : matchIds) {
            MatchDetailsDto matchDetails = getMatchDetails(matchId);
            MatchStatDto matchStat = new MatchStatDto();
            matchStat.setMatchId(matchId);
            matchStat.setGameDuration(matchDetails.getInfo().getGameDuration());

            for (MatchDetailsDto.Info.Participant participant : matchDetails.getInfo().getParticipants()) {
                if (participant.getPuuid().equals(puuid)) {
                    matchStat.setChampionName(participant.getChampionName());
                    matchStat.setKills(participant.getKills());
                    matchStat.setDeaths(participant.getDeaths());
                    matchStat.setAssists(participant.getAssists());
                    matchStat.setWin(participant.isWin());
                    break;
                }
            }

            matchStats.add(matchStat);
        }

        return matchStats;
    }
}