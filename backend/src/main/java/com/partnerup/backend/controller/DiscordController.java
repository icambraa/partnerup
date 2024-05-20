package com.partnerup.backend.controller;

import com.partnerup.backend.model.Anuncio;
import com.partnerup.backend.service.AnuncioService;
import net.dv8tion.jda.api.entities.Guild;
import net.dv8tion.jda.api.entities.channel.concrete.VoiceChannel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/discord")
public class DiscordController {

    private final Guild guild;
    private final AnuncioService anuncioService;

    @Autowired
    public DiscordController(Guild guild, AnuncioService anuncioService) {
        this.guild = guild;
        this.anuncioService = anuncioService;
    }

    @PostMapping("/create-channel")
    public ResponseEntity<?> createChannel(@RequestBody Anuncio anuncio) {
        try {
            String channelName = "anuncio-" + anuncio.getId();
            VoiceChannel channel = guild.createVoiceChannel(channelName).complete();

            if (channel == null) {
                return ResponseEntity.status(500).body("Error creating Discord voice channel: channel is null");
            }

            String channelLink = "https://discord.com/channels/" + guild.getId() + "/" + channel.getId();
            String inviteLink = channel.createInvite().setMaxAge(0).setMaxUses(0).complete().getUrl();

            return ResponseEntity.ok(new ChannelResponse(channel.getId(), inviteLink));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error creating Discord voice channel: " + e.getMessage());
        }
    }

    @PostMapping("/channel-link")
    public ResponseEntity<?> getChannelLink(@RequestBody Map<String, Long> request) {
        Long anuncioId = request.get("anuncioId");
        if (anuncioId == null) {
            return ResponseEntity.status(400).body("Anuncio ID is missing");
        }

        Anuncio anuncio = anuncioService.getAnuncioById(anuncioId);
        if (anuncio != null) {
            String channelName = "anuncio-" + anuncio.getId();
            VoiceChannel channel = guild.getVoiceChannelsByName(channelName, true).stream().findFirst().orElse(null);

            if (channel != null) {
                String channelLink = "https://discord.com/channels/" + guild.getId() + "/" + channel.getId();
                return ResponseEntity.ok(new ChannelResponse(channel.getId(), channelLink));
            } else {
                return ResponseEntity.status(404).body("Channel not found");
            }
        } else {
            return ResponseEntity.status(404).body("Anuncio not found");
        }
    }

    public static class ChannelResponse {
        private String channelId;
        private String channelLink;

        public ChannelResponse(String channelId, String channelLink) {
            this.channelId = channelId;
            this.channelLink = channelLink;
        }

        // Getters y setters
        public String getChannelId() {
            return channelId;
        }

        public void setChannelId(String channelId) {
            this.channelId = channelId;
        }

        public String getChannelLink() {
            return channelLink;
        }

        public void setChannelLink(String channelLink) {
            this.channelLink = channelLink;
        }
    }
}