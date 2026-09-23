
package com.kolkata.restaurant.repository;

import com.kolkata.restaurant.model.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerOrderRepository
        extends JpaRepository<CustomerOrder, Long> {

}