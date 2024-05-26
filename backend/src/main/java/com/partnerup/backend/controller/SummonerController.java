package com.partnerup.backend.controller;

import com.partnerup.backend.model.MatchDetailsDto;
import com.partnerup.backend.model.WinRateResponse;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.partnerup.backend.service.SummonerService;
import com.partnerup.backend.model.RankInfo;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class SummonerController {

    @Autowired
    private SummonerService summonerService;

    @GetMapping("/summoner/winrate")
    @Cacheable(value = "winRateCache", key = "#gameName.concat('-').concat(#tagLine)")
    public ResponseEntity<?> getSummonerWinrate(@RequestParam String gameName, @RequestParam String tagLine) {
        try {
            WinRateResponse winRateResponse = summonerService.calculateWinRate(gameName, tagLine);
            return ResponseEntity.ok(winRateResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing request: " + e.getMessage());
        }
    }

    @GetMapping("/summoner/profileiconurl")
    @Cacheable(value = "profileiconurl", key = "#gameName.concat('-').concat(#tagLine)")
    public ResponseEntity<?> getSummonerProfileIconUrl(@RequestParam String gameName, @RequestParam String tagLine) {
        try {
            String profileIconUrl = summonerService.getProfileIconUrl(gameName, tagLine);
            return ResponseEntity.ok(profileIconUrl);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("User exists but is inactive")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User exists but is inactive");
            }
            return ResponseEntity.badRequest().body("Error processing request: " + e.getMessage());
        }
    }

    @GetMapping("/summoner/validate")
    @Cacheable(value = "validateNicknameCache", key = "#gameName.concat('-').concat(#tagLine)")
    public ResponseEntity<?> validateRiotNickname(@RequestParam String gameName, @RequestParam String tagLine) {
        try {
            boolean isValid = summonerService.isRiotNicknameValid(gameName, tagLine);
            return ResponseEntity.ok(isValid);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing request: " + e.getMessage());
        }
    }

    @GetMapping("/lastgames")
    @Cacheable(value = "lastGamesCache", key = "#gameName.concat('-').concat(#tagLine).concat('-').concat(#count)")
    public ResponseEntity<?> getLastGames(@RequestParam String gameName, @RequestParam String tagLine, @RequestParam int count) {
        try {
            List<MatchDetailsDto> matchDetailsList = summonerService.getLastMatchDetails(gameName, tagLine, count);
            return ResponseEntity.ok().body(matchDetailsList);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing request: " + e.getMessage());
        }
    }

    @GetMapping("/summoner/rankinfo")
    @Cacheable(value = "rankInfoCache", key = "#gameName.concat('-').concat(#tagLine)")
    public ResponseEntity<?> getSummonerRankInfo(@RequestParam String gameName, @RequestParam String tagLine) {
        try {
            RankInfo rankInfo = summonerService.getRankInfo(gameName, tagLine);
            if (rankInfo != null) {
                return ResponseEntity.ok(rankInfo);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing request: " + e.getMessage());
        }
    }

    @GetMapping("/summoner/riotnickname")
    @Cacheable(value = "riotNicknameCache", key = "#gameName.concat('-').concat(#tagLine)")
    public ResponseEntity<?> getSummonerRiotNickname(@RequestParam String puuid) {
        try {
            String riotNickname = summonerService.getRiotNicknameByPUUID(puuid);
            return ResponseEntity.ok(riotNickname);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing request: " + e.getMessage());
        }
    }
}
