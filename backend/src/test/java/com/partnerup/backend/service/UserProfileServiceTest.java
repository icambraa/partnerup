package com.partnerup.backend.service;

import com.partnerup.backend.model.UserProfile;
import com.partnerup.backend.repository.UserProfileRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserProfileServiceTest {

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private SummonerService summonerService;

    @InjectMocks
    private UserProfileService userProfileService;

    @Test
    public void testSaveUserProfile() {
        UserProfile userProfile = new UserProfile();
        when(userProfileRepository.save(any(UserProfile.class))).thenReturn(userProfile);

        UserProfile result = userProfileService.saveUserProfile(userProfile);

        assertNotNull(result);
        verify(userProfileRepository).save(userProfile);
    }

    @Test
    public void testGetUserProfileById() {
        Long id = 1L;
        UserProfile userProfile = new UserProfile();
        when(userProfileRepository.findById(id)).thenReturn(Optional.of(userProfile));

        UserProfile result = userProfileService.getUserProfileById(id);

        assertNotNull(result);
        assertEquals(userProfile, result);
        verify(userProfileRepository).findById(id);
    }

    @Test
    public void testGetUserProfileByEmail() {
        String email = "test@example.com";
        UserProfile userProfile = new UserProfile();
        when(userProfileRepository.findByEmail(email)).thenReturn(userProfile);

        UserProfile result = userProfileService.getUserProfileByEmail(email);

        assertNotNull(result);
        assertEquals(userProfile, result);
        verify(userProfileRepository).findByEmail(email);
    }

    @Test
    public void testGetUserProfileByFirebaseUid() {
        String firebaseUid = "testFirebaseUid";
        UserProfile userProfile = new UserProfile();
        when(userProfileRepository.findByFirebaseUid(firebaseUid)).thenReturn(userProfile);

        UserProfile result = userProfileService.getUserProfileByFirebaseUid(firebaseUid);

        assertNotNull(result);
        assertEquals(userProfile, result);
        verify(userProfileRepository).findByFirebaseUid(firebaseUid);
    }

    @Test
    public void testGetUserProfileByRiotNickname() {
        String riotnickname = "testRiotNickname";
        UserProfile userProfile = new UserProfile();
        when(userProfileRepository.findByRiotnickname(riotnickname)).thenReturn(userProfile);

        UserProfile result = userProfileService.getUserProfileByRiotNickname(riotnickname);

        assertNotNull(result);
        assertEquals(userProfile, result);
        verify(userProfileRepository).findByRiotnickname(riotnickname);
    }

    @Test
    public void testExistsByNombreusuario() {
        String nombreusuario = "testNombreusuario";
        when(userProfileRepository.existsByNombreusuario(nombreusuario)).thenReturn(true);

        boolean result = userProfileService.existsByNombreusuario(nombreusuario);

        assertTrue(result);
        verify(userProfileRepository).existsByNombreusuario(nombreusuario);
    }

    @Test
    public void testExistsByRiotnickname() {
        String riotnickname = "testRiotNickname";
        when(userProfileRepository.existsByRiotnickname(riotnickname)).thenReturn(true);

        boolean result = userProfileService.existsByRiotnickname(riotnickname);

        assertTrue(result);
        verify(userProfileRepository).existsByRiotnickname(riotnickname);
    }

    @Test
    public void testIsRiotNicknameValid() {
        String riotnickname = "test#1234";
        when(summonerService.isRiotNicknameValid(anyString(), anyString())).thenReturn(true);

        boolean result = userProfileService.isRiotNicknameValid(riotnickname);

        assertTrue(result);
        verify(summonerService).isRiotNicknameValid("test", "1234");
    }

    @Test
    public void testIsAdmin() {
        String firebaseUid = "testFirebaseUid";
        UserProfile userProfile = new UserProfile();
        userProfile.setAdmin(true);
        when(userProfileRepository.findByFirebaseUid(firebaseUid)).thenReturn(userProfile);

        boolean result = userProfileService.isAdmin(firebaseUid);

        assertTrue(result);
        verify(userProfileRepository).findByFirebaseUid(firebaseUid);
    }

    @Test
    public void testIsUserBanned() {
        String firebaseUid = "testFirebaseUid";
        UserProfile userProfile = new UserProfile();
        userProfile.setBanned(true);
        when(userProfileRepository.findByFirebaseUid(firebaseUid)).thenReturn(userProfile);

        boolean result = userProfileService.isUserBanned(firebaseUid);

        assertTrue(result);
        verify(userProfileRepository).findByFirebaseUid(firebaseUid);
    }
}
