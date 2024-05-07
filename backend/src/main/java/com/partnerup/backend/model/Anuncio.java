package com.partnerup.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "anuncios")
public class Anuncio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "riot_nickname")
    private String riotNickname;

    @Column(name = "rol")
    private String rol;

    @Column(name = "busca_rol")
    private String buscaRol;

    @Column(name = "rango")
    private String rango;

    @Column(name = "comentario")
    private String comentario;

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
}