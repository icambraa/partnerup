package com.partnerup.backend.model;

public class RankInfo {
    private String tier;
    private String rank;
    private int leaguePoints;

    public RankInfo(String tier, String rank, int leaguePoints) {
        this.tier = tier;
        this.rank = rank;
        this.leaguePoints = leaguePoints;
    }

    public String getTier() {
        return tier;
    }

    public void setTier(String tier) {
        this.tier = tier;
    }

    public String getRank() {
        return rank;
    }

    public void setRank(String rank) {
        this.rank = rank;
    }

    public int getLeaguePoints() {
        return leaguePoints;
    }

    public void setLeaguePoints(int leaguePoints) {
        this.leaguePoints = leaguePoints;
    }
}