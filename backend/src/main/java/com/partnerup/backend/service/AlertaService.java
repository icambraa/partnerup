package com.partnerup.backend.service;

import com.partnerup.backend.model.Alerta;
import com.partnerup.backend.repository.AlertaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlertaService {
    @Autowired
    private AlertaRepository alertaRepository;

    public Alerta createAlerta(Alerta alerta) {
        return alertaRepository.save(alerta);
    }

    public List<Alerta> getAlertasByUserId(String userId) {
        return alertaRepository.findByUserId(userId);
    }
}
