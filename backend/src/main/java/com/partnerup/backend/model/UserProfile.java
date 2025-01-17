package com.partnerup.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "perfiles")
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombreusuario")
    private String nombreusuario;

    @Column(name = "rolprincipal")
    private String rolprincipal;

    @Column(name = "region")
    private String region;

    @Column(name = "riotnickname")
    private String riotnickname;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "firebase_uid")
    private String firebaseUid;

    @Column(name = "admin")
    private boolean admin;

    @Column(name = "deleted_ads_count")
    private int deletedAdsCount;

    @Column(name = "banned")
    private boolean banned;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreusuario() {
        return nombreusuario;
    }

    public void setNombreusuario(String nombreusuario) {
        this.nombreusuario = nombreusuario;
    }

    public String getRolprincipal() {
        return rolprincipal;
    }

    public void setRolprincipal(String rolprincipal) {
        this.rolprincipal = rolprincipal;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getRiotnickname() {
        return riotnickname;
    }

    public void setRiotnickname(String riotnickname) {
        this.riotnickname = riotnickname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirebaseUid() {
        return firebaseUid;
    }

    public void setFirebaseUid(String firebaseUid) {
        this.firebaseUid = firebaseUid;
    }

    public boolean isAdmin() {
        return admin;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }

    public int getDeletedAdsCount() {
        return deletedAdsCount;
    }

    public void setDeletedAdsCount(int deletedAdsCount) {
        this.deletedAdsCount = deletedAdsCount;
    }

    public boolean isBanned() {
        return banned;
    }

    public void setBanned(boolean banned) {
        this.banned = banned;
    }
}