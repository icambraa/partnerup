package com.partnerup.backend.controller;

import com.partnerup.backend.model.Alerta;
import com.partnerup.backend.service.AlertaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alertas")
@CrossOrigin(origins = "http://localhost:3000")
public class AlertaController {
    @Autowired
    private AlertaService alertaService;

    @PostMapping
    public ResponseEntity<Alerta> createAlerta(@RequestBody Alerta alerta) {
        Alerta newAlerta = alertaService.createAlerta(alerta);
        return ResponseEntity.ok(newAlerta);
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<List<Alerta>> getAlertasByUserId(@PathVariable String userId) {
        List<Alerta> alertas = alertaService.getAlertasByUserId(userId);
        return ResponseEntity.ok(alertas);
    }

    @GetMapping("/unread-by-user/{userId}")
    public ResponseEntity<List<Alerta>> getUnreadAlertasByUserId(@PathVariable String userId) {
        List<Alerta> alertas = alertaService.getUnreadAlertasByUserId(userId);
        return ResponseEntity.ok(alertas);
    }

    @PostMapping("/mark-as-read/{userId}")
    public ResponseEntity<Void> markAlertasAsRead(@PathVariable String userId) {
        alertaService.markAlertasAsRead(userId);
        return ResponseEntity.ok().build();
    }
}
