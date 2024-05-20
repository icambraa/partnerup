package com.partnerup.backend.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class MatchDetailsDto {

    private Metadata metadata;
    private Info info;

    // Getters y Setters

    @Setter
    @Getter
    public static class Metadata {
        // Getters y Setters
        private String matchId;
        private List<String> participants;
    }

    @Setter
    @Getter
    public static class Info {
        // Getters y Setters
        private long gameDuration;
        private List<Participant> participants;

        @Setter
        @Getter
        public static class Participant {
            // Getters y Setters
            private String puuid;
            private String championName;
            private int kills;
            private int deaths;
            private int assists;
            private boolean win;
            private String riotIdGameName;
            private String riotIdTagline;
            private int summoner1Id; // Nuevo campo
            private int summoner2Id; // Nuevo campo
        }
    }
}