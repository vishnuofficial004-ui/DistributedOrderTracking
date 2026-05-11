package com.example.DistributedOrderTracking.dto;

import com.example.DistributedOrderTracking.model.User;

public class UserResponse {

    private Long id;
    private String name;
    private String email;

    public UserResponse() {}

    public static UserResponse fromUser(User u) {
        UserResponse r = new UserResponse();
        r.setId(u.getId());
        r.setName(u.getName());
        r.setEmail(u.getEmail());
        return r;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}