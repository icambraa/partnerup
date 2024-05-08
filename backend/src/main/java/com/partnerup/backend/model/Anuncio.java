package com.partnerup.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "anuncios")
public class Anuncio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String riotNickname;

    @Column(nullable = false)
    private String rol;

    @Column(nullable = false)
    private String buscaRol;

    @Column(nullable = false)
    private String rango;

    @Column(length = 1024)  // Ajusta según tus necesidades
    private String comentario;

    @Column(nullable = false)
    private String userId;  // UID de Firebase

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRiotNickname() {
        return riotNickname;
    }

    public void setRiotNickname(String riotNickname) {
        this.riotNickname = riotNickname;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getBuscaRol() {
        return buscaRol;
    }

    public void setBuscaRol(String buscaRol) {
        this.buscaRol = buscaRol;
    }

    public String getRango() {
        return rango;
    }

    public void setRango(String rango) {
        this.rango = rango;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}