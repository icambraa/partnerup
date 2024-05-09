package com.partnerup.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.partnerup.backend.model.AccountDto;
import com.partnerup.backend.model.SummonerDto;
import com.partnerup.backend.model.LeagueEntryDto;

@Service
public class SummonerService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${riot.api.key}")
    private String apiKey;

    public double calculateWinRate(String gameName, String tagLine) throws Exception {
        String puuid = getPUUID(gameName, tagLine);
        SummonerDto summoner = getSummoner(puuid);
        LeagueEntryDto[] leagueEntries = getLeagueEntries(summoner.getId());
        return calculateWinRate(leagueEntries);
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

    private int calculateWinRate(LeagueEntryDto[] leagueEntries) {
        if (leagueEntries.length == 0) {
            return 0;
        }
        LeagueEntryDto entry = leagueEntries[0];
        int totalGames = entry.getWins() + entry.getLosses();
        if (totalGames == 0) {
            return 0;
        }
        return (int) Math.round(100.0 * entry.getWins() / totalGames);
    }
}