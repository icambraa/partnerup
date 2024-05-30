package com.partnerup.backend.controller;

import com.partnerup.backend.model.Anuncio;
import com.partnerup.backend.service.AnuncioService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class AnuncioControllerTest {

    @Mock
    private AnuncioService anuncioService;

    @InjectMocks
    private AnuncioController anuncioController;

    private MockMvc mockMvc;

    @Test
    public void testCreateAnuncio() throws Exception {
        Anuncio anuncio = new Anuncio();
        anuncio.setRiotNickname("test");
        when(anuncioService.createAnuncio(any(Anuncio.class))).thenReturn(anuncio);

        mockMvc = MockMvcBuilders.standaloneSetup(anuncioController).build();
        mockMvc.perform(post("/api/anuncios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"riotNickname\":\"test\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.riotNickname").value("test"));
    }


    @Test
    public void testGetAnunciosByUserId() throws Exception {
        String userId = "testUserId";
        when(anuncioService.getAnunciosByUserId(userId)).thenReturn(Collections.singletonList(new Anuncio()));

        mockMvc = MockMvcBuilders.standaloneSetup(anuncioController).build();
        mockMvc.perform(get("/api/anuncios/user/{userId}", userId))
                .andExpect(status().isOk());
    }

    @Test
    public void testDeleteAnuncio() throws Exception {
        Long anuncioId = 1L;
        String userId = "testUserId";
        boolean isAdmin = true;
        boolean isReported = false;

        doNothing().when(anuncioService).deleteAnuncio(anuncioId, userId, isAdmin, isReported);

        mockMvc = MockMvcBuilders.standaloneSetup(anuncioController).build();
        mockMvc.perform(delete("/api/anuncios/{id}", anuncioId)
                        .header("userId", userId)
                        .header("isAdmin", isAdmin)
                        .param("isReported", String.valueOf(isReported)))
                .andExpect(status().isOk());
    }

    @Test
    public void testUpdateAnuncio() throws Exception {
        Long anuncioId = 1L;
        Anuncio anuncio = new Anuncio();
        when(anuncioService.updateAnuncio(eq(anuncioId), any(Anuncio.class))).thenReturn(anuncio);

        mockMvc = MockMvcBuilders.standaloneSetup(anuncioController).build();
        mockMvc.perform(put("/api/anuncios/{id}", anuncioId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"riotNickname\":\"updatedNickname\"}"))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetDiscordLink() throws Exception {
        Long anuncioId = 1L;
        String discordLink = "https://discord.gg/test";
        when(anuncioService.getDiscordLinkForAnuncio(anuncioId)).thenReturn(discordLink);

        mockMvc = MockMvcBuilders.standaloneSetup(anuncioController).build();
        mockMvc.perform(get("/api/anuncios/{id}/discord-link", anuncioId))
                .andExpect(status().isOk())
                .andExpect(content().string(discordLink));
    }

    @Test
    public void testGetAnunciosByIds() throws Exception {
        when(anuncioService.getAnunciosByIds(anyList())).thenReturn(Collections.singletonList(new Anuncio()));

        mockMvc = MockMvcBuilders.standaloneSetup(anuncioController).build();
        mockMvc.perform(post("/api/anuncios/by-ids")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2, 3]"))
                .andExpect(status().isOk());
    }
}
