package com.partnerup.backend.repository;

import com.partnerup.backend.model.Anuncio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AnuncioRepository extends JpaRepository<Anuncio, Long> {
    List<Anuncio> findByUserId(String userId);
    Page<Anuncio> findAll(Pageable pageable);
    Page<Anuncio> findByRol(String rol, Pageable pageable);
    Page<Anuncio> findByRango(String rango, Pageable pageable);
    Page<Anuncio> findByRolAndRango(String rol, String rango, Pageable pageable);
}