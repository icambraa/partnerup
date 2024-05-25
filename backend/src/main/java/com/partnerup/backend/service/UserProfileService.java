package com.partnerup.backend.service;

import com.partnerup.backend.model.UserProfile;
import com.partnerup.backend.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserProfileService {
    @Autowired
    private UserProfileRepository userRepository;

    @Autowired
    private SummonerService summonerService;

    public UserProfile saveUserProfile(UserProfile userProfile) {
        return userRepository.save(userProfile);
    }

    public UserProfile getUserProfileById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public UserProfile getUserProfileByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public UserProfile getUserProfileByFirebaseUid(String firebaseUid) {
        return userRepository.findByFirebaseUid(firebaseUid);
    }

    public UserProfile getUserProfileByRiotNickname(String riotnickname) {
        return userRepository.findByRiotnickname(riotnickname);
    }

    public boolean existsByNombreusuario(String nombreusuario) {
        return userRepository.existsByNombreusuario(nombreusuario);
    }

    public boolean existsByRiotnickname(String riotnickname) {
        return userRepository.existsByRiotnickname(riotnickname);
    }

    public boolean isRiotNicknameValid(String riotnickname) {
        String[] parts = riotnickname.split("#");
        if (parts.length != 2) {
            return false;
        }
        return summonerService.isRiotNicknameValid(parts[0], parts[1]);
    }

    public boolean isAdmin(String userId) {
        UserProfile user = userRepository.findByFirebaseUid(userId);
        return user != null && user.isAdmin();
    }

    public boolean isUserBanned(String firebaseUid) {
        UserProfile userProfile = userRepository.findByFirebaseUid(firebaseUid);
        return userProfile != null && userProfile.isBanned();
    }
}