package com.partnerup.backend.service;

import com.partnerup.backend.model.Mensaje;
import com.partnerup.backend.repository.MensajeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MensajeServiceTest {

    @Mock
    private MensajeRepository mensajeRepository;

    @InjectMocks
    private MensajeService mensajeService;

    @Test
    public void testSaveMensaje() {
        Mensaje mensaje = new Mensaje();
        when(mensajeRepository.save(any(Mensaje.class))).thenReturn(mensaje);

        Mensaje result = mensajeService.saveMensaje(mensaje);

        assertNotNull(result);
        verify(mensajeRepository).save(mensaje);
    }

    @Test
    public void testGetAllMensajes() {
        Mensaje mensaje = new Mensaje();
        when(mensajeRepository.findAll()).thenReturn(Collections.singletonList(mensaje));

        List<Mensaje> result = mensajeService.getAllMensajes();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(mensajeRepository).findAll();
    }

    @Test
    public void testCountUnreadMessages() {
        String receiverId = "testReceiver";
        long expectedCount = 5L;
        when(mensajeRepository.countByReceiverIdAndReadFalse(receiverId)).thenReturn(expectedCount);

        long result = mensajeService.countUnreadMessages(receiverId);

        assertEquals(expectedCount, result);
        verify(mensajeRepository).countByReceiverIdAndReadFalse(receiverId);
    }

    @Test
    public void testGetUnreadMessages() {
        String userId = "testUser";
        Mensaje mensaje = new Mensaje();
        when(mensajeRepository.findUnreadMessagesByReceiverId(userId)).thenReturn(Collections.singletonList(mensaje));

        List<Mensaje> result = mensajeService.getUnreadMessages(userId);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(mensajeRepository).findUnreadMessagesByReceiverId(userId);
    }

    @Test
    public void testMarkMessageAsRead() {
        Long messageId = 1L;
        Mensaje mensaje = new Mensaje();
        mensaje.setId(messageId);
        mensaje.setRead(false);

        when(mensajeRepository.findById(messageId)).thenReturn(Optional.of(mensaje));
        when(mensajeRepository.save(any(Mensaje.class))).thenReturn(mensaje);

        Mensaje result = mensajeService.markMessageAsRead(messageId);

        assertNotNull(result);
        assertTrue(result.isRead());
        verify(mensajeRepository).findById(messageId);
        verify(mensajeRepository).save(mensaje);
    }

    @Test
    public void testDeleteMessage() {
        Long messageId = 1L;
        doNothing().when(mensajeRepository).deleteById(messageId);

        mensajeService.deleteMessage(messageId);

        verify(mensajeRepository).deleteById(messageId);
    }
}
