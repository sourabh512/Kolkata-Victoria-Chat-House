package com.kolkata.restaurant.controller;

import com.kolkata.restaurant.model.CustomerOrder;
import com.kolkata.restaurant.repository.CustomerOrderRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(
        origins = "http://127.0.0.1:5500",
        allowCredentials = "true"
)
public class OrderController {

    private final CustomerOrderRepository repository;

    public OrderController(CustomerOrderRepository repository) {
        this.repository = repository;
    }

    // PLACE NEW ORDER
    @PostMapping
    public CustomerOrder placeOrder(@RequestBody CustomerOrder order) {

        order.setStatus("NEW");

        order.setOrderDateTime(LocalDateTime.now());

        return repository.save(order);
    }

    // VIEW ALL ORDERS
    @GetMapping
    public List<CustomerOrder> getAllOrders() {

        return repository.findAll();
    }

    @GetMapping("/{id}")
    public CustomerOrder getOrderById(
            @PathVariable Long id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found"
                        )
                );
    }

    // UPDATE ORDER STATUS
    @PutMapping("/{id}/status")
    public CustomerOrder updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        CustomerOrder order = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));

        order.setStatus(status);

        return repository.save(order);
    }
}

