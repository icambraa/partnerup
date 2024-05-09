package com.partnerup.backend.service;

import com.partnerup.backend.model.Anuncio;
import com.partnerup.backend.repository.AnuncioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@Service
public class AnuncioService {

    @Autowired
    private AnuncioRepository anuncioRepository;

    public Anuncio createAnuncio(Anuncio anuncio) {
        return anuncioRepository.save(anuncio);
    }

    public List<Anuncio> getAnunciosByUserId(String userId) {
        return anuncioRepository.findByUserId(userId);
    }

    public void deleteAnuncio(Long id, String userId) throws Exception {
        Anuncio anuncio = anuncioRepository.findById(id)
                .orElseThrow(() -> new Exception("Anuncio no encontrado"));

        if (!anuncio.getUserId().equals(userId)) {
            throw new Exception("No autorizado para borrar este anuncio");
        }

        anuncioRepository.delete(anuncio);
    }

    public Page<Anuncio> getAllAnuncios(Pageable pageable) {
        return anuncioRepository.findAll(pageable);
    }

    public Page<Anuncio> getAnunciosFiltered(String rol, String rango, Pageable pageable) {
        if (rol != null && rango != null) {
            return anuncioRepository.findByRolAndRangoOrderByCreatedAtDesc(rol, rango, pageable);
        } else if (rol != null) {
            return anuncioRepository.findByRolOrderByCreatedAtDesc(rol, pageable);
        } else if (rango != null) {
            return anuncioRepository.findByRangoOrderByCreatedAtDesc(rango, pageable);
        } else {
            return anuncioRepository.findAllByOrderByCreatedAtDesc(pageable);
        }
    }
}