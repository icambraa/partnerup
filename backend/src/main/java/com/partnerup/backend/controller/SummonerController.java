package com.partnerup.backend.controller;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.partnerup.backend.service.SummonerService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class SummonerController {

    @Autowired
    private SummonerService summonerService;

    @GetMapping("/summoner/winrate")
    @Cacheable(value = "winRateCache", key = "#gameName.concat('-').concat(#tagLine)")
    public ResponseEntity<?> getSummonerWinrate(@RequestParam String gameName, @RequestParam String tagLine) {
        try {
            double winRate = summonerService.calculateWinRate(gameName, tagLine);
            return ResponseEntity.ok(winRate);
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
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing request: " + e.getMessage());
        }
    }
}