package com.partnerup.backend.controller;

import com.partnerup.backend.model.Anuncio;
import com.partnerup.backend.service.AnuncioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

@RestController
@RequestMapping("/api/anuncios")
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE}, allowedHeaders = "*", allowCredentials = "true")
public class AnuncioController {

    @Autowired
    private AnuncioService anuncioService;

    @PostMapping
    public Anuncio createAnuncio(@RequestBody Anuncio anuncio) {
        return anuncioService.createAnuncio(anuncio);
    }

    @GetMapping("/user/{userId}")
    public List<Anuncio> getAnunciosByUserId(@PathVariable String userId) {
        return anuncioService.getAnunciosByUserId(userId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnuncio(@PathVariable Long id,
                                           @RequestHeader("userId") String userId,
                                           @RequestHeader("isAdmin") boolean isAdmin,
                                           @RequestParam(name = "isReported", defaultValue = "false") boolean isReported) {
        try {
            anuncioService.deleteAnuncio(id, userId, isAdmin, isReported);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<Page<Anuncio>> getAllAnuncios(
            @RequestParam(required = false) String rol,
            @RequestParam(required = false) String rango,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Anuncio> anuncios = anuncioService.getAnunciosFiltered(rol, rango, pageable);
        return ResponseEntity.ok(anuncios);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Anuncio> updateAnuncio(@PathVariable Long id, @RequestBody Anuncio updatedAnuncio) {
        try {
            Anuncio anuncio = anuncioService.updateAnuncio(id, updatedAnuncio);
            return ResponseEntity.ok(anuncio);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/{id}/discord-link")
    public ResponseEntity<String> getDiscordLink(@PathVariable Long id) {
        String discordLink = anuncioService.getDiscordLinkForAnuncio(id);
        if (discordLink != null) {
            return ResponseEntity.ok(discordLink);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/by-ids")
    public ResponseEntity<List<Anuncio>> getAnunciosByIds(@RequestBody List<Long> ids) {
        List<Anuncio> anuncios = anuncioService.getAnunciosByIds(ids);
        return ResponseEntity.ok(anuncios);
    }
}
