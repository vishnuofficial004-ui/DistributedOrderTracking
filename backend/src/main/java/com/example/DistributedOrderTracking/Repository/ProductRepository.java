package com.example.DistributedOrderTracking.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.DistributedOrderTracking.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Search by name
    List<Product> findByNameContainingIgnoreCase(String name);

    // Find products within price range
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :min AND :max ORDER BY p.price ASC")
    List<Product> findByPriceRange(
            @Param("min") Double min,
            @Param("max") Double max);

    // Find cheapest products
    List<Product> findTop5ByOrderByPriceAsc();

    // Find most expensive products
    List<Product> findTop5ByOrderByPriceDesc();
}