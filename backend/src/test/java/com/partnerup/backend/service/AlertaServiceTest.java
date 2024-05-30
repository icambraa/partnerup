package com.partnerup.backend.service;

import com.partnerup.backend.model.Alerta;
import com.partnerup.backend.repository.AlertaRepository;
import com.partnerup.backend.service.AlertaService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AlertaServiceTest {

    @Mock
    private AlertaRepository alertaRepository;

    @InjectMocks
    private AlertaService alertaService;

    @Test
    public void testCreateAlerta() {
        Alerta alerta = new Alerta();
        when(alertaRepository.save(any(Alerta.class))).thenReturn(alerta);

        Alerta result = alertaService.createAlerta(alerta);

        assertNotNull(result);
        verify(alertaRepository).save(alerta);
    }

    @Test
    public void testGetAlertasByUserId() {
        Alerta alerta = new Alerta();
        when(alertaRepository.findByUserId(anyString())).thenReturn(Arrays.asList(alerta));

        List<Alerta> result = alertaService.getAlertasByUserId("testUser");

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(alertaRepository).findByUserId("testUser");
    }

    @Test
    public void testGetUnreadAlertasByUserId() {
        Alerta alerta = new Alerta();
        when(alertaRepository.findByUserIdAndReadFalse(anyString())).thenReturn(Arrays.asList(alerta));

        List<Alerta> result = alertaService.getUnreadAlertasByUserId("testUser");

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(alertaRepository).findByUserIdAndReadFalse("testUser");
    }

    @Test
    public void testMarkAlertasAsRead() {
        Alerta alerta = new Alerta();
        alerta.setRead(false);
        when(alertaRepository.findByUserIdAndReadFalse(anyString())).thenReturn(Arrays.asList(alerta));

        alertaService.markAlertasAsRead("testUser");

        assertTrue(alerta.isRead());
        verify(alertaRepository).findByUserIdAndReadFalse("testUser");
        verify(alertaRepository, times(1)).save(alerta);
    }
}
