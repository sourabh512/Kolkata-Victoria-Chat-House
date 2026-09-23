package com.kolkata.restaurant.repository;

import com.kolkata.restaurant.model.MenuItem;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuItemRepository
        extends JpaRepository<MenuItem, Long> {
}