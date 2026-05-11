package com.example.DistributedOrderTracking.dto;

import com.example.DistributedOrderTracking.model.Product;

public class ProductResponse {

    private Long id;
    private String name;
    private Double price;

    public ProductResponse() {}

    public static ProductResponse fromProduct(Product p) {
        ProductResponse r = new ProductResponse();
        r.setId(p.getId());
        r.setName(p.getName());
        r.setPrice(p.getPrice());
        return r;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
}