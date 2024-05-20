package com.partnerup.backend.repository;

import com.partnerup.backend.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    UserProfile findByEmail(String email);
    UserProfile findByFirebaseUid(String firebaseUid);

    UserProfile findByRiotnickname(String riotnickname);

    UserProfile findByNombreusuario(String nombreusuario);
    boolean existsByNombreusuario(String nombreusuario);
    boolean existsByRiotnickname(String riotnickname);
}