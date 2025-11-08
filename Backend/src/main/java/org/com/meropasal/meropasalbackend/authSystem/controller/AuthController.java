package org.com.meropasal.meropasalbackend.authSystem.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.com.meropasal.meropasalbackend.authSystem.config.JwtService;
import org.com.meropasal.meropasalbackend.authSystem.dto.LoginRequest;
import org.com.meropasal.meropasalbackend.authSystem.dto.RegisterRequest;
import org.com.meropasal.meropasalbackend.authSystem.dto.VerifyOtpRequest;
import org.com.meropasal.meropasalbackend.authSystem.entity.Users;
import org.com.meropasal.meropasalbackend.authSystem.repo.UsersRepository;
import org.com.meropasal.meropasalbackend.authSystem.service.AuthService;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.Cookie;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/**
 * Created On : 2025 26 Jan 11:58 AM
 * Author : Monu Siddiki
 * Description :
 **/
@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final UsersRepository usersRepository;


    public AuthController(AuthService authService, JwtService jwtService, UserDetailsService userDetailsService, UsersRepository usersRepository) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.usersRepository = usersRepository;
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    /**
     * Endpoint to verify OTP during registration.
     * If successful, the endpoint generates a JWT token and sets it as an httpOnly cookie.
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request, HttpServletResponse response) {
        // The service method now returns a JWT token upon successful OTP verification.
        String jwtToken = authService.verifyOtp(request);
//        Users users = usersRepository.findByEmail(request.getEmail()).orElseThrow();

        // Optionally, create an httpOnly cookie to store the JWT token.
        ResponseCookie cookie = ResponseCookie.from("jwt", jwtToken)
                .httpOnly(true)                     // Prevent JavaScript access
                .secure(false)                      // Use true if serving over HTTPS
                .path("/")                          // Cookie valid for the entire domain
                .maxAge(7 * 24 * 60 * 60)             // 7 days expiration
                .sameSite("Strict")                 // CSRF protection
                .build();

        // Add the cookie to the response header.
        response.addHeader("Set-Cookie", cookie.toString());

        // ✅ Return the token inside an object { "token": "JWT-TOKEN" }
        Map<String, String> responseBody = new HashMap<>();
//        responseBody.put("ownerId", users.getId().toString());
        responseBody.put("token", jwtToken);

        return ResponseEntity.ok(responseBody);
    }

    /**
     * Separate endpoint to resend the OTP (if needed).
     */
    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody VerifyOtpRequest request) {
        // You may create a dedicated service method for resending the OTP.
        String responseMessage = authService.resendOtp(request.getEmail());
        return ResponseEntity.ok().body(responseMessage);
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        String jwtToken = authService.login(request);

        // Create an httpOnly cookie
        ResponseCookie cookie = ResponseCookie.from("jwt", jwtToken)
                .httpOnly(true) // Prevent JavaScript from accessing the cookie
//                .secure(true) // Ensure the cookie is only sent over HTTPS
                .secure(false) // Ensure the cookie is only sent over HTTP
                .path("/") // Set the cookie path
                .maxAge(7 * 24 * 60 * 60) // Set cookie expiration (e.g., 7 days)
//                .maxAge(-1) // Set cookie expiration until logout
                .sameSite("Strict") // Prevent CSRF attacks
                .build();

        // Add the cookie to the response
        response.addHeader("Set-Cookie", cookie.toString());
        // Return a success response
        return ResponseEntity.ok().body("Login successful");
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // Clear the JWT cookie
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false) // Set to true in production with HTTPS
                .path("/")
                .maxAge(0) // Expire the cookie immediately
                .sameSite("Strict")
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
        return ResponseEntity.ok("Logged out successfully");
    }


//    @GetMapping("/check-auth")
//    public ResponseEntity<?> checkAuth(HttpServletRequest request) {
//        // Extract JWT from cookies
//        String jwt = null;
//        Cookie[] cookies = request.getCookies();
//
//        if (cookies != null) {
//            jwt = Arrays.stream(cookies)
//                    .filter(cookie -> "jwt".equals(cookie.getName()))
//                    .map(Cookie::getValue)
//                    .findFirst()
//                    .orElse(null);
//        }
//
//        if (jwt == null) {
//            return ResponseEntity.status(401).body("Unauthorized: No token found");
//        }
//
//        try {
//            // Extract user email from JWT
//            String userEmail = jwtService.extractEmail(jwt);
//
//            if (userEmail == null) {
//                return ResponseEntity.status(401).body("Unauthorized: Invalid token");
//            }
//
//            // Load user details
//            UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
//
//            // Validate token
//            if (!jwtService.isTokenValid(jwt, userDetails)) {
//                return ResponseEntity.status(401).body("Unauthorized: Invalid token");
//            }
//
//            // If everything is valid, return success response
//            return ResponseEntity.ok().body("User is authenticated");
//
//        } catch (Exception e) {
//            return ResponseEntity.status(401).body("Unauthorized: " + e.getMessage());
//        }
//    }

    @GetMapping("/check-auth")
    public ResponseEntity<?> checkAuth(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return ResponseEntity.status(401).body("Unauthorized: No cookies found");
        }

        String jwt = Arrays.stream(cookies)
                .filter(cookie -> "jwt".equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);

        if (jwt == null) {
            return ResponseEntity.status(401).body("Unauthorized: No token found");
        }

        try {
            String userEmail = jwtService.extractEmail(jwt);
            if (userEmail == null) {
                return ResponseEntity.status(401).body("Unauthorized: Invalid token");
            }

            UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
            if (!jwtService.isTokenValid(jwt, userDetails)) {
                return ResponseEntity.status(401).body("Unauthorized: Invalid token");
            }

            return ResponseEntity.ok().body("User is authenticated");

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Unauthorized: " + e.getMessage());
        }
    }
    @GetMapping("/getOwnerId")
    public ResponseEntity<String> getOwnerId(HttpServletRequest request) {
        // Retrieve cookies from the request
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return ResponseEntity.status(401).body("Unauthorized: No cookies found");
        }

        // Extract the JWT from the cookie
        String jwt = Arrays.stream(cookies)
                .filter(cookie -> "jwt".equals(cookie.getName())) // Cookie name is 'jwt'
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);

        if (jwt == null) {
            return ResponseEntity.status(401).body("Unauthorized: No token found");
        }

        // Extract email from the JWT token
        String email = jwtService.extractEmail(jwt); // Extract email using JwtService

        if (email == null) {
            return ResponseEntity.status(401).body("Unauthorized: No email in token");
        }

        // Fetch the user by email
        Users users = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));

        // Return the ownerId (userId) as a response
        return ResponseEntity.ok(users.getId().toString()); // Assuming ID is UUID
    }

}
