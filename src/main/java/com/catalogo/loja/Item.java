package com.catalogo.loja;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String descricao;
    private String categoria;
    private String marca;
    private String imagemUrl;
    private Double valor;
    
    @Column(columnDefinition = "TEXT")
    private String detalhes;

    public Item() {} 

 
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String d) { this.descricao = d; }
    public String getCategoria() { return categoria; }
    public void setCategoria(String c) { this.categoria = c; }
    public String getMarca() { return marca; }
    public void setMarca(String m) { this.marca = m; }
    public String getImagemUrl() { return imagemUrl; }
    public void setImagemUrl(String i) { this.imagemUrl = i; }
    public Double getValor() { return valor; }
    public void setValor(Double v) { this.valor = v; }
    public String getDetalhes() { return detalhes; }
    public void setDetalhes(String det) { this.detalhes = det; }
}