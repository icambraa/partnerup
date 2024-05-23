package com.partnerup.backend.controller;

import com.partnerup.backend.model.Alerta;
import com.partnerup.backend.service.AlertaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alertas")
@CrossOrigin(origins = "http://localhost:5173")
public class AlertaController {
    @Autowired
    private AlertaService alertaService;

    @PostMapping
    public ResponseEntity<Alerta> createAlerta(@RequestBody Alerta alerta) {
        Alerta newAlerta = alertaService.createAlerta(alerta);
        return ResponseEntity.ok(newAlerta);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Alerta>> getAlertasByUserId(@PathVariable String userId) {
        List<Alerta> alertas = alertaService.getAlertasByUserId(userId);
        return ResponseEntity.ok(alertas);
    }
}
