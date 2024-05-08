package com.partnerup.backend.repository;

import com.partnerup.backend.model.Anuncio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnuncioRepository extends JpaRepository<Anuncio, Long> {
    List<Anuncio> findByUserId(String userId);
}