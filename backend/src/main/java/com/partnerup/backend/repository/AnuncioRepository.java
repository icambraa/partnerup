package com.partnerup.backend.repository;

import com.partnerup.backend.model.Anuncio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnuncioRepository extends JpaRepository<Anuncio, Long> {

}