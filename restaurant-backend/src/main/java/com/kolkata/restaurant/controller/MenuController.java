package com.kolkata.restaurant.controller;

import com.kolkata.restaurant.model.MenuItem;
import com.kolkata.restaurant.repository.MenuItemRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(
        origins = {
                "http://localhost:5500",
                "http://127.0.0.1:5500"
        }
)
public class MenuController {

    private final MenuItemRepository repository;

    public MenuController(MenuItemRepository repository) {
        this.repository = repository;
    }


    // GET ALL MENU ITEMS

    @GetMapping
    public List<MenuItem> getAllMenuItems() {

        return repository.findAll();

    }


    // GET ONE MENU ITEM

    @GetMapping("/{id}")
    public MenuItem getMenuItem(
            @PathVariable Long id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Menu item not found"
                        )
                );

    }


    // ADD MENU ITEM

    @PostMapping
    public MenuItem addMenuItem(
            @RequestBody MenuItem menuItem) {

        return repository.save(menuItem);

    }


    // UPDATE MENU ITEM

    @PutMapping("/{id}")
    public MenuItem updateMenuItem(
            @PathVariable Long id,
            @RequestBody MenuItem updatedItem) {

        MenuItem item =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Menu item not found"
                                )
                        );

        item.setName(updatedItem.getName());

        item.setPrice(updatedItem.getPrice());

        item.setImage(updatedItem.getImage());

        item.setAvailable(
                updatedItem.isAvailable()
        );

        return repository.save(item);

    }


    // DELETE MENU ITEM

    @DeleteMapping("/{id}")
    public String deleteMenuItem(
            @PathVariable Long id) {

        if (!repository.existsById(id)) {

            throw new RuntimeException(
                    "Menu item not found"
            );

        }

        repository.deleteById(id);

        return "Menu item deleted successfully";

    }

}