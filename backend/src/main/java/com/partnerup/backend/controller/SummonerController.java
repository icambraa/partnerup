package com.partnerup.backend.controller;

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
    public ResponseEntity<?> getSummonerWinrate(@RequestParam String gameName, @RequestParam String tagLine) {
        try {
            double winRate = summonerService.calculateWinRate(gameName, tagLine);
            return ResponseEntity.ok(winRate);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing request: " + e.getMessage());
        }
    }
}