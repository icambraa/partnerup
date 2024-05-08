package com.partnerup.backend.controller;

import com.partnerup.backend.model.Anuncio;
import com.partnerup.backend.service.AnuncioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/anuncios")
@CrossOrigin(origins = "http://localhost:5173")
public class AnuncioController {

    @Autowired
    private AnuncioService anuncioService;

    @GetMapping
    public List<Anuncio> getAllAnuncios() {
        return anuncioService.getAllAnuncios();
    }

    @PostMapping
    public Anuncio createAnuncio(@RequestBody Anuncio anuncio) {
        return anuncioService.createAnuncio(anuncio);
    }

    @GetMapping("/user/{userId}")
    public List<Anuncio> getAnunciosByUserId(@PathVariable String userId) {
        return anuncioService.getAnunciosByUserId(userId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnuncio(@PathVariable Long id, @RequestHeader("userId") String userId) {
        try {
            anuncioService.deleteAnuncio(id, userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



}