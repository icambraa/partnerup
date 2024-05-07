package com.partnerup.backend.service;

import com.partnerup.backend.model.Anuncio;
import com.partnerup.backend.repository.AnuncioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnuncioService {

    @Autowired
    private AnuncioRepository anuncioRepository;

    public List<Anuncio> findAll() {
        return anuncioRepository.findAll();
    }

    public Optional<Anuncio> findById(Long id) {
        return anuncioRepository.findById(id);
    }

    public Anuncio save(Anuncio anuncio) {
        return anuncioRepository.save(anuncio);
    }

    public void deleteById(Long id) {
        anuncioRepository.deleteById(id);
    }
}