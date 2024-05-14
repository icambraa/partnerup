package com.partnerup.backend.model;
import java.util.List;

public class MatchDetailsDto {

    private Metadata metadata;
    private Info info;

    // Getters y Setters

    public static class Metadata {
        private String matchId;
        private List<String> participants;

        // Getters y Setters
        public String getMatchId() {
            return matchId;
        }

        public void setMatchId(String matchId) {
            this.matchId = matchId;
        }

        public List<String> getParticipants() {
            return participants;
        }

        public void setParticipants(List<String> participants) {
            this.participants = participants;
        }
    }

    public static class Info {
        private long gameDuration;
        private List<Participant> participants;

        // Getters y Setters
        public long getGameDuration() {
            return gameDuration;
        }

        public void setGameDuration(long gameDuration) {
            this.gameDuration = gameDuration;
        }

        public List<Participant> getParticipants() {
            return participants;
        }

        public void setParticipants(List<Participant> participants) {
            this.participants = participants;
        }

        public static class Participant {
            private String puuid;
            private String championName;
            private int kills;
            private int deaths;
            private int assists;
            private boolean win;

            // Getters y Setters
            public String getPuuid() {
                return puuid;
            }

            public void setPuuid(String puuid) {
                this.puuid = puuid;
            }

            public String getChampionName() {
                return championName;
            }

            public void setChampionName(String championName) {
                this.championName = championName;
            }

            public int getKills() {
                return kills;
            }

            public void setKills(int kills) {
                this.kills = kills;
            }

            public int getDeaths() {
                return deaths;
            }

            public void setDeaths(int deaths) {
                this.deaths = deaths;
            }

            public int getAssists() {
                return assists;
            }

            public void setAssists(int assists) {
                this.assists = assists;
            }

            public boolean isWin() {
                return win;
            }

            public void setWin(boolean win) {
                this.win = win;
            }
        }
    }

    public Metadata getMetadata() {
        return metadata;
    }

    public void setMetadata(Metadata metadata) {
        this.metadata = metadata;
    }

    public Info getInfo() {
        return info;
    }

    public void setInfo(Info info) {
        this.info = info;
    }
}
