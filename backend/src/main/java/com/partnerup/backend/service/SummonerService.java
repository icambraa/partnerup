package com.partnerup.backend.service;

import com.partnerup.backend.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
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

    @Value("${riot.profile.icon.base.url}")
    private String profileIconBaseUrl;

    public WinRateResponse calculateWinRate(String gameName, String tagLine) throws Exception {
        String puuid = getPUUID(gameName, tagLine);
        SummonerDto summoner = getSummoner(puuid);
        LeagueEntryDto[] leagueEntries = getLeagueEntries(summoner.getId());
        return calculateWinRateDetails(leagueEntries);
    }

    public String getRiotNicknameByPUUID(String puuid) {
        String url = String.format("https://europe.api.riotgames.com/riot/account/v1/accounts/by-puuid/%s?api_key=%s", puuid, apiKey);
        try {
            ResponseEntity<AccountDto> response = restTemplate.getForEntity(url, AccountDto.class);
            AccountDto accountDto = response.getBody();
            return accountDto.getGameName() + " " + accountDto.getTagLine();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching Riot nickname: " + e.getMessage());
        }
    }


    private String getPUUID(String gameName, String tagLine) {
        String url = String.format("https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/%s/%s?api_key=%s",
                gameName, tagLine, apiKey);
        try {
            ResponseEntity<AccountDto> response = restTemplate.getForEntity(url, AccountDto.class);
            return response.getBody().getPuuid();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching PUUID: " + e.getMessage());
        }
    }

    public boolean isRiotNicknameValid(String gameName, String tagLine) {
        String url = String.format("https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/%s/%s?api_key=%s",
                gameName, tagLine, apiKey);
        try {
            ResponseEntity<AccountDto> response = restTemplate.getForEntity(url, AccountDto.class);
            return response.getStatusCode().is2xxSuccessful() && response.getBody() != null;
        } catch (Exception e) {
            return false;
        }
    }

    private SummonerDto getSummoner(String puuid) {
        String url = String.format("https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/%s?api_key=%s", puuid, apiKey);
        try {
            ResponseEntity<SummonerDto> response = restTemplate.getForEntity(url, SummonerDto.class);
            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching Summoner: " + e.getMessage());
        }
    }

    private LeagueEntryDto[] getLeagueEntries(String summonerId) {
        String url = String.format("https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/%s?api_key=%s", summonerId, apiKey);
        try {
            ResponseEntity<LeagueEntryDto[]> response = restTemplate.getForEntity(url, LeagueEntryDto[].class);
            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching League Entries: " + e.getMessage());
        }
    }

    public RankInfo getRankInfo(String gameName, String tagLine) throws Exception {
        String puuid = getPUUID(gameName, tagLine);
        SummonerDto summoner = getSummoner(puuid);
        LeagueEntryDto[] leagueEntries = getLeagueEntries(summoner.getId());

        if (leagueEntries.length > 0) {
            LeagueEntryDto leagueEntry = leagueEntries[0];
            String tier = leagueEntry.getTier();
            String rank = leagueEntry.getRank();
            int leaguePoints = leagueEntry.getLeaguePoints();
            return new RankInfo(tier, rank, leaguePoints);
        } else {
            return new RankInfo("UNRANKED", "", 0);
        }
    }

    private WinRateResponse calculateWinRateDetails(LeagueEntryDto[] leagueEntries) {
        if (leagueEntries.length == 0) {
            return new WinRateResponse(0, 0, 0);
        }
        int totalWins = 0;
        int totalLosses = 0;
        for (LeagueEntryDto entry : leagueEntries) {
            totalWins += entry.getWins();
            totalLosses += entry.getLosses();
        }
        int totalGames = totalWins + totalLosses;
        double winRate = totalGames == 0 ? 0 : Math.round(100.0 * totalWins / totalGames);
        return new WinRateResponse(winRate, totalWins, totalLosses);
    }

    public String getProfileIconUrl(String gameName, String tagLine) {
        String puuid = getPUUID(gameName, tagLine);
        SummonerDto summoner = getSummoner(puuid);
        int profileIconId = summoner.getProfileIconId();
        return profileIconBaseUrl + profileIconId + ".png";
    }

    public List<String> getLastMatchIds(String puuid, int start, int count) {
        String url = String.format("https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/%s/ids?start=%d&count=%d&api_key=%s",
                puuid, start, count, apiKey);
        try {
            ResponseEntity<List<String>> response = restTemplate.exchange(
                    url, HttpMethod.GET, null, new ParameterizedTypeReference<List<String>>() {});
            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching Match IDs: " + e.getMessage());
        }
    }

    public MatchDetailsDto getMatchDetails(String matchId) {
        String url = String.format("https://europe.api.riotgames.com/lol/match/v5/matches/%s?api_key=%s", matchId, apiKey);
        try {
            ResponseEntity<MatchDetailsDto> response = restTemplate.getForEntity(url, MatchDetailsDto.class);
            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching Match Details: " + e.getMessage());
        }
    }

    public List<MatchDetailsDto> getLastMatchDetails(String gameName, String tagLine, int count) {
        String puuid = getPUUID(gameName, tagLine);
        List<String> matchIds = getLastMatchIds(puuid, 0, count);
        List<MatchDetailsDto> matchDetailsList = new ArrayList<>();

        for (String matchId : matchIds) {
            MatchDetailsDto matchDetails = getMatchDetails(matchId);
            matchDetailsList.add(matchDetails);
        }

        return matchDetailsList;
    }
}