package com.partnerup.backend.controller;

import com.partnerup.backend.controller.UserProfileController;
import com.partnerup.backend.model.UserProfile;
import com.partnerup.backend.service.UserProfileService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class UserProfileControllerTest {

    @Mock
    private UserProfileService userProfileService;

    @InjectMocks
    private UserProfileController userProfileController;

    private MockMvc mockMvc;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(userProfileController).build();
    }

    @Test
    public void testCreateUserProfile() throws Exception {
        UserProfile userProfile = new UserProfile();
        userProfile.setNombreusuario("testUser");
        userProfile.setRiotnickname("test#1234");
        userProfile.setEmail("test@example.com");

        when(userProfileService.existsByNombreusuario(anyString())).thenReturn(false);
        when(userProfileService.existsByRiotnickname(anyString())).thenReturn(false);
        when(userProfileService.isRiotNicknameValid(anyString())).thenReturn(true);
        when(userProfileService.saveUserProfile(any(UserProfile.class))).thenReturn(userProfile);

        mockMvc.perform(post("/api/profiles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nombreusuario\":\"testUser\", \"riotnickname\":\"test#1234\", \"email\":\"test@example.com\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombreusuario").value("testUser"))
                .andExpect(jsonPath("$.riotnickname").value("test#1234"))
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    public void testGetUserProfile() throws Exception {
        Long id = 1L;
        UserProfile userProfile = new UserProfile();
        userProfile.setId(id);
        userProfile.setEmail("test@example.com");

        when(userProfileService.getUserProfileById(id)).thenReturn(userProfile);

        mockMvc.perform(get("/api/profiles/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    public void testGetUserProfileByEmail() throws Exception {
        String email = "test@example.com";
        UserProfile userProfile = new UserProfile();
        userProfile.setEmail(email);

        when(userProfileService.getUserProfileByEmail(email)).thenReturn(userProfile);

        mockMvc.perform(get("/api/profiles/by-email")
                        .param("email", email))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(email));
    }

    @Test
    public void testGetUserProfileByFirebaseUid() throws Exception {
        String firebaseUid = "testFirebaseUid";
        UserProfile userProfile = new UserProfile();
        userProfile.setFirebaseUid(firebaseUid);

        when(userProfileService.getUserProfileByFirebaseUid(firebaseUid)).thenReturn(userProfile);

        mockMvc.perform(get("/api/profiles/by-firebaseUid")
                        .param("firebaseUid", firebaseUid))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firebaseUid").value(firebaseUid));
    }

    @Test
    public void testGetUserProfileByRiotnickname() throws Exception {
        String riotnickname = "testRiotNickname";
        UserProfile userProfile = new UserProfile();
        userProfile.setRiotnickname(riotnickname);

        when(userProfileService.getUserProfileByRiotNickname(riotnickname)).thenReturn(userProfile);

        mockMvc.perform(get("/api/profiles/by-riotnickname")
                        .param("riotnickname", riotnickname))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.riotnickname").value(riotnickname));
    }

    @Test
    public void testCheckIfUserIsBanned() throws Exception {
        String firebaseUid = "testFirebaseUid";
        when(userProfileService.isUserBanned(firebaseUid)).thenReturn(true);

        mockMvc.perform(get("/api/profiles/is-banned")
                        .param("firebaseUid", firebaseUid))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }
}
