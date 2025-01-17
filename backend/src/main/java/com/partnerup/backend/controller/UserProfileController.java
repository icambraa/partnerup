package com.partnerup.backend.controller;

import com.partnerup.backend.model.UserProfile;
import com.partnerup.backend.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "http://localhost:3000")
public class UserProfileController {
    @Autowired
    private UserProfileService profileService;



    @PostMapping
    public ResponseEntity<?> createUserProfile(@RequestBody UserProfile userProfile) {
        if (profileService.existsByNombreusuario(userProfile.getNombreusuario())) {
            return ResponseEntity.badRequest().body("Nombre de usuario ya existe");
        }
        if (profileService.existsByRiotnickname(userProfile.getRiotnickname())) {
            return ResponseEntity.badRequest().body("Riot Nickname ya existe");
        }
        if (!profileService.isRiotNicknameValid(userProfile.getRiotnickname())) {
            return ResponseEntity.badRequest().body("Riot Nickname no es válido o no existe en la región");
        }

        UserProfile savedProfile = profileService.saveUserProfile(userProfile);
        return ResponseEntity.ok(savedProfile);
    }


    @GetMapping("/{id}")
    public ResponseEntity<UserProfile> getUserProfile(@PathVariable Long id) {
        UserProfile userProfile = profileService.getUserProfileById(id);
        return userProfile != null ? ResponseEntity.ok(userProfile) : ResponseEntity.notFound().build();
    }

    @GetMapping("/by-email")
    public ResponseEntity<UserProfile> getUserProfileByEmail(@RequestParam String email) {
        UserProfile userProfile = profileService.getUserProfileByEmail(email);
        return userProfile != null ? ResponseEntity.ok(userProfile) : ResponseEntity.notFound().build();
    }

    @GetMapping("/by-firebaseUid")
    public ResponseEntity<UserProfile> getUserProfileByFirebaseUid(@RequestParam String firebaseUid) {
        UserProfile userProfile = profileService.getUserProfileByFirebaseUid(firebaseUid);
        return userProfile != null ? ResponseEntity.ok(userProfile) : ResponseEntity.notFound().build();
    }

    @GetMapping("/by-riotnickname")
    public ResponseEntity<UserProfile> getUserProfileByRiotnickname(@RequestParam String riotnickname) {
        UserProfile userProfile = profileService.getUserProfileByRiotNickname(riotnickname);
        return userProfile != null ? ResponseEntity.ok(userProfile) : ResponseEntity.notFound().build();
    }

    @GetMapping("/is-banned")
    public ResponseEntity<Boolean> checkIfUserIsBanned(@RequestParam String firebaseUid) {
        boolean isBanned = profileService.isUserBanned(firebaseUid);
        return ResponseEntity.ok(isBanned);
    }
}