package com.partnerup.backend.repository;

import com.partnerup.backend.model.Mensaje;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MensajeRepository extends JpaRepository<Mensaje, Long> {

    long countByReceiverIdAndReadFalse(String receiverId);

    List<Mensaje> findUnreadMessagesByReceiverId(String receiverId);

}