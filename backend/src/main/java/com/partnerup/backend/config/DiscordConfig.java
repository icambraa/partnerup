package com.partnerup.backend.config;

import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.entities.Guild;
import net.dv8tion.jda.api.requests.GatewayIntent;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;

import javax.security.auth.login.LoginException;

@Configuration
public class DiscordConfig {

    @Value("${discord.bot.token}")
    private String discordBotToken;

    @Value("${discord.guild.id}")
    private String guildId;

    @Bean
    public JDA jda() throws LoginException, InterruptedException {
        JDA jda = JDABuilder.createDefault(discordBotToken)
                .enableIntents(GatewayIntent.GUILD_MEMBERS, GatewayIntent.GUILD_MESSAGES)
                .build();
        jda.awaitReady();
        return jda;
    }

    @Bean
    public Guild guild(JDA jda) {
        Guild guild = jda.getGuildById(guildId);
        if (guild == null) {
            throw new IllegalStateException("Guild with ID '" + guildId + "' not found");
        }
        return guild;
    }
}