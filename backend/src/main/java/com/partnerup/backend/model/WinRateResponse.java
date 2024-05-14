package com.partnerup.backend.model;

public class WinRateResponse {
    private double winRate;
    private int wins;
    private int losses;

    public WinRateResponse(double winRate, int wins, int losses) {
        this.winRate = winRate;
        this.wins = wins;
        this.losses = losses;
    }

    public double getWinRate() {
        return winRate;
    }

    public int getWins() {
        return wins;
    }

    public int getLosses() {
        return losses;
    }
}