package com.partnerup.backend.controller;

import com.partnerup.backend.controller.MensajeController;
import com.partnerup.backend.model.Mensaje;
import com.partnerup.backend.service.MensajeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class MensajeControllerTest {

    @Mock
    private MensajeService mensajeService;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private MensajeController mensajeController;

    private MockMvc mockMvc;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(mensajeController).build();
    }

    @Test
    public void testCrearMensaje() throws Exception {
        Mensaje mensaje = new Mensaje();
        when(mensajeService.saveMensaje(any(Mensaje.class))).thenReturn(mensaje);

        mockMvc.perform(post("/api/mensajes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"senderId\":\"testSender\", \"receiverId\":\"testReceiver\", \"messageText\":\"Hello\"}"))
                .andExpect(status().isCreated());
    }

    @Test
    public void testGetUnreadMessagesCount() throws Exception {
        String userId = "testUser";
        long unreadCount = 5L;
        when(mensajeService.countUnreadMessages(userId)).thenReturn(unreadCount);

        mockMvc.perform(get("/api/mensajes/unread-count")
                        .param("userId", userId))
                .andExpect(status().isOk())
                .andExpect(content().string(String.valueOf(unreadCount)));
    }

    @Test
    public void testGetUnreadMessages() throws Exception {
        String userId = "testUser";
        Mensaje mensaje = new Mensaje();
        when(mensajeService.getUnreadMessages(userId)).thenReturn(Collections.singletonList(mensaje));

        mockMvc.perform(get("/api/mensajes/unread")
                        .param("userId", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").exists());
    }

    @Test
    public void testMarkMessageAsRead() throws Exception {
        Long messageId = 1L;
        Mensaje mensaje = new Mensaje();
        when(mensajeService.markMessageAsRead(messageId)).thenReturn(mensaje);

        mockMvc.perform(post("/api/mensajes/mark-as-read/{messageId}", messageId))
                .andExpect(status().isOk());
    }

    @Test
    public void testDeleteMessage() throws Exception {
        Long messageId = 1L;
        doNothing().when(mensajeService).deleteMessage(messageId);

        mockMvc.perform(delete("/api/mensajes/{messageId}", messageId))
                .andExpect(status().isNoContent());
    }
}
