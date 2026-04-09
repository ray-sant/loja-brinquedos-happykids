package com.catalogo.loja.model;

import jakarta.persistence.*;

@Entity
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String codigoDoBrinquedo;
    private String descricao;

    @ManyToOne
    @JoinColumn(name = "id_categoria")
    private Categoria categoria;
    
    private String marca;

    // EDIÇÃO AQUI: @Lob e LONGTEXT permitem salvar o Base64 da imagem sem cortar o código
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String imagemUrl;

    private Double valor;
    private Boolean destaque;
    
    @Column(columnDefinition = "TEXT")
    private String detalhes;

    public Item() {} 

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getDescricao() { return descricao; }
    public void setDescricao(String d) { this.descricao = d; }
    
    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria c) { this.categoria = c; }
    
    public String getMarca() { return marca; }
    public void setMarca(String m) { this.marca = m; }
    
    public String getImagemUrl() { return imagemUrl; }
    public void setImagemUrl(String i) { this.imagemUrl = i; }
    
    public Double getValor() { return valor; }
    public void setValor(Double v) { this.valor = v; }
    
    public String getDetalhes() { return detalhes; }
    public void setDetalhes(String det) { this.detalhes = det; }
    
    public String getCodigoDoBrinquedo() { return codigoDoBrinquedo; }
    public void setCodigoDoBrinquedo(String codigoDoBrinquedo) { this.codigoDoBrinquedo = codigoDoBrinquedo; }
    
    public Boolean getDestaque() { return destaque; }
    public void setDestaque(Boolean destaque) { this.destaque = destaque; }
}