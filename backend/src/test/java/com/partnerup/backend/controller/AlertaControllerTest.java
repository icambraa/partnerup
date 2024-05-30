package com.partnerup.backend.controller;

import com.partnerup.backend.controller.AlertaController;
import com.partnerup.backend.model.Alerta;
import com.partnerup.backend.service.AlertaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class AlertaControllerTest {

    @Mock
    private AlertaService alertaService;

    @InjectMocks
    private AlertaController alertaController;

    private MockMvc mockMvc;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(alertaController).build();
    }

    @Test
    public void testCreateAlerta() throws Exception {
        Alerta alerta = new Alerta();
        alerta.setUserId("testUser");
        alerta.setMensaje("testMessage");

        when(alertaService.createAlerta(any(Alerta.class))).thenReturn(alerta);

        mockMvc.perform(post("/api/alertas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"userId\":\"testUser\", \"mensaje\":\"testMessage\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value("testUser"))
                .andExpect(jsonPath("$.mensaje").value("testMessage"));
    }

    @Test
    public void testGetAlertasByUserId() throws Exception {
        Alerta alerta = new Alerta();
        alerta.setUserId("testUser");
        when(alertaService.getAlertasByUserId(anyString())).thenReturn(Arrays.asList(alerta));

        mockMvc.perform(get("/api/alertas/by-user/{userId}", "testUser"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].userId").value("testUser"));
    }

    @Test
    public void testGetUnreadAlertasByUserId() throws Exception {
        Alerta alerta = new Alerta();
        alerta.setUserId("testUser");
        when(alertaService.getUnreadAlertasByUserId(anyString())).thenReturn(Arrays.asList(alerta));

        mockMvc.perform(get("/api/alertas/unread-by-user/{userId}", "testUser"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].userId").value("testUser"));
    }

    @Test
    public void testMarkAlertasAsRead() throws Exception {
        mockMvc.perform(post("/api/alertas/mark-as-read/{userId}", "testUser"))
                .andExpect(status().isOk());
    }
}
