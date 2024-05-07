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
        return anuncioService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Anuncio> getAnuncioById(@PathVariable Long id) {
        return anuncioService.findById(id)
                .map(anuncio -> ResponseEntity.ok().body(anuncio))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Anuncio createAnuncio(@RequestBody Anuncio anuncio) {
        return anuncioService.save(anuncio);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Anuncio> updateAnuncio(@PathVariable Long id, @RequestBody Anuncio anuncioDetails) {
        Anuncio updatedAnuncio = anuncioService.findById(id)
                .map(anuncio -> {
                    anuncio.setRiotNickname(anuncioDetails.getRiotNickname());
                    anuncio.setRol(anuncioDetails.getRol());
                    anuncio.setBuscaRol(anuncioDetails.getBuscaRol());
                    anuncio.setRango(anuncioDetails.getRango());
                    anuncio.setComentario(anuncioDetails.getComentario());
                    return anuncioService.save(anuncio);
                }).orElseGet(() -> anuncioService.save(anuncioDetails));

        return ResponseEntity.ok(updatedAnuncio);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnuncio(@PathVariable Long id) {
        return anuncioService.findById(id)
                .map(anuncio -> {
                    anuncioService.deleteById(id);
                    return ResponseEntity.ok().<Void>build();
                }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}