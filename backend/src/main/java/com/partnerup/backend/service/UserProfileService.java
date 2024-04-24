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

    public UserProfile saveUserProfile(UserProfile userProfile) {
        return userRepository.save(userProfile);
    }

    public UserProfile getUserProfileById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

}