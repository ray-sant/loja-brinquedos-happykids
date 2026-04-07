package com.catalogo.loja;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/brinquedos")
@CrossOrigin("*") 
public class Controller {

    @Autowired
    private ItemRepository repository;

    @GetMapping
    public List<Item> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Item salvar(@RequestBody Item item) {
        return repository.save(item);
    }

    @PutMapping("/{id}")
    public Item editar(@PathVariable Long id, @RequestBody Item item) {
        item.setId(id);
        return repository.save(item);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        repository.deleteById(id);
    }
}