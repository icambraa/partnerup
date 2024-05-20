package com.partnerup.backend.service;

import com.partnerup.backend.model.Mensaje;
import com.partnerup.backend.repository.MensajeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MensajeService {
    @Autowired
    private MensajeRepository mensajeRepository;

    public Mensaje saveMensaje(Mensaje mensaje) {
        return mensajeRepository.save(mensaje);
    }

    public List<Mensaje> getAllMensajes() {
        return mensajeRepository.findAll();
    }

    public long countUnreadMessages(String receiverId) {
        return mensajeRepository.countByReceiverIdAndReadFalse(receiverId);
    }

    public List<Mensaje> getUnreadMessages(String userId) {
        return mensajeRepository.findUnreadMessagesByReceiverId(userId);
    }

    public Mensaje markMessageAsRead(Long messageId) {
        Mensaje mensaje = mensajeRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Mensaje no encontrado"));
        mensaje.setRead(true);
        return mensajeRepository.save(mensaje);
    }

    public void deleteMessage(Long messageId) {
        mensajeRepository.deleteById(messageId);
    }
}
