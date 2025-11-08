package org.com.meropasal.meropasalbackend.customer.controller;

import org.com.meropasal.meropasalbackend.authSystem.config.CustomerJwtService;
import org.com.meropasal.meropasalbackend.authSystem.enums.UserRole;
import org.com.meropasal.meropasalbackend.customer.entity.CustomerDetails;
import org.com.meropasal.meropasalbackend.customer.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;
import java.util.UUID;

/**
 * Created On : 2025 01 Jul 6:12 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Controller
@RequestMapping("/customer")
public class CustomerController {


    private final CustomerService customerService;
    private final CustomerJwtService customerJwtService;

    public CustomerController(CustomerService customerService, CustomerJwtService customerJwtService) {
        this.customerService = customerService;
        this.customerJwtService = customerJwtService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> initiateSignup(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        customerService.initiateSignup(email);
        return ResponseEntity.ok().body(Map.of(
                "status", "success",
                "message", "OTP sent to email"
        ));
    }

    @PostMapping("/signup/verify")
    public ResponseEntity<?> verifySignup(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        UserRole role = UserRole.valueOf(request.getOrDefault("role", "USER"));

        CustomerDetails customer = customerService.verifyAndCompleteSignup(email, otp, role);
        String token = customerJwtService.generateToken(customer.getId().toString(), customer.getEmail());
        return ResponseEntity.ok().body(Map.of(
                "status", "success",
                "customer", Map.of(
                        "id", customer.getId(),
                        "email", customer.getEmail(),
                        "verified", customer.isVerified(),
                        "role", customer.getRole().name()
                ),
                "token", token
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> request
    ) {
        // Extract customer ID from JWT
        String token = authHeader.substring(7);
        String customerId = customerJwtService.extractCustomerId(token);

        customerService.logout(UUID.fromString(customerId));
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Logged out successfully"
        ));
    }

    @PostMapping("/signup/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        customerService.resendOtp(email);
        return ResponseEntity.ok().body(Map.of(
                "status", "success",
                "message", "New OTP sent"
        ));
    }
}
