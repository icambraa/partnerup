package com.partnerup.backend.service;

import com.partnerup.backend.model.Anuncio;
import com.partnerup.backend.model.UserProfile;
import com.partnerup.backend.repository.AnuncioRepository;
import com.partnerup.backend.repository.UserProfileRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AnuncioServiceTest {

    @Mock
    private AnuncioRepository anuncioRepository;

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private ReportService reportService;

    @InjectMocks
    private AnuncioService anuncioService;

    @Test
    public void testCreateAnuncio() {
        Anuncio anuncio = new Anuncio();
        when(anuncioRepository.save(anuncio)).thenReturn(anuncio);

        Anuncio createdAnuncio = anuncioService.createAnuncio(anuncio);

        assertEquals(anuncio, createdAnuncio);
        verify(anuncioRepository, times(1)).save(anuncio);
    }

    @Test
    public void testGetAnunciosByUserId() {
        String userId = "testUserId";
        List<Anuncio> anuncios = Collections.singletonList(new Anuncio());
        when(anuncioRepository.findByUserId(userId)).thenReturn(anuncios);

        List<Anuncio> result = anuncioService.getAnunciosByUserId(userId);

        assertEquals(anuncios, result);
        verify(anuncioRepository, times(1)).findByUserId(userId);
    }

    @Test
    public void testDeleteAnuncio() throws Exception {
        Long anuncioId = 1L;
        String userId = "testUserId";
        boolean isAdmin = false;
        boolean isReported = false;
        Anuncio anuncio = new Anuncio();
        anuncio.setUserId(userId);
        UserProfile userProfile = new UserProfile();
        when(anuncioRepository.findById(anuncioId)).thenReturn(Optional.of(anuncio));
        when(userProfileRepository.findByFirebaseUid(userId)).thenReturn(userProfile);

        anuncioService.deleteAnuncio(anuncioId, userId, isAdmin, isReported);

        verify(anuncioRepository, times(1)).delete(anuncio);
        verify(userProfileRepository, times(1)).save(userProfile);
        verify(reportService, times(1)).updateReportsStatusByAnuncioId(anuncioId, "revisado");
    }

    @Test
    public void testGetAllAnuncios() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Anuncio> page = new PageImpl<>(Collections.singletonList(new Anuncio()));
        when(anuncioRepository.findAll(pageable)).thenReturn(page);

        Page<Anuncio> result = anuncioService.getAllAnuncios(pageable);

        assertEquals(page, result);
        verify(anuncioRepository, times(1)).findAll(pageable);
    }

    @Test
    public void testUpdateAnuncio() throws Exception {
        Long anuncioId = 1L;
        Anuncio updatedAnuncio = new Anuncio();
        updatedAnuncio.setRiotNickname("newNickname");
        Anuncio existingAnuncio = new Anuncio();
        when(anuncioRepository.findById(anuncioId)).thenReturn(Optional.of(existingAnuncio));
        when(anuncioRepository.save(existingAnuncio)).thenReturn(existingAnuncio);

        Anuncio result = anuncioService.updateAnuncio(anuncioId, updatedAnuncio);

        assertEquals("newNickname", result.getRiotNickname());
        verify(anuncioRepository, times(1)).findById(anuncioId);
        verify(anuncioRepository, times(1)).save(existingAnuncio);
    }
}
