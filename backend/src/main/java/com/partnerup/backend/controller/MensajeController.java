package com.partnerup.backend.controller;

import com.partnerup.backend.model.Mensaje;
import com.partnerup.backend.repository.MensajeRepository;
import com.partnerup.backend.service.MensajeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mensajes")
@CrossOrigin(origins = "http://localhost:5173")
public class MensajeController {
    @Autowired
    private MensajeService mensajeService;

    @PostMapping
    public ResponseEntity<Mensaje> crearMensaje(@RequestBody Mensaje mensaje) {
        Mensaje mensajeGuardado = mensajeService.saveMensaje(mensaje);
        return new ResponseEntity<>(mensajeGuardado, HttpStatus.CREATED);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadMessagesCount(@RequestParam String userId) {
        long unreadCount = mensajeService.countUnreadMessages(userId);
        return ResponseEntity.ok(unreadCount);
    }

    @GetMapping("/unread")
    public ResponseEntity<List<Mensaje>> getUnreadMessages(@RequestParam String userId) {
        List<Mensaje> unreadMessages = mensajeService.getUnreadMessages(userId);
        return ResponseEntity.ok(unreadMessages);
    }

}
