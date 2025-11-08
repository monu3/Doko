package org.com.meropasal.meropasalbackend.authSystem.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.com.meropasal.meropasalbackend.authSystem.repo.UsersRepository;
import org.com.meropasal.meropasalbackend.authSystem.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    private final SecretKey secretKey;
    private final UsersRepository usersRepository;
    private final CustomUserDetailsService customUserDetailsService; // Inject CustomUserDetailsService

    // Use a fixed password to derive the key (read from environment variable)
    public JwtService(@Value("${jwt.secret-password}") String secretPassword, UsersRepository usersRepository, CustomUserDetailsService customUserDetailsService) {
        // Derive a secure key from the password using HMAC-SHA-256
        this.secretKey = Keys.hmacShaKeyFor(secretPassword.getBytes());
        this.usersRepository = usersRepository;
        this.customUserDetailsService = customUserDetailsService;
    }

    public  String generateToken(String email) {

        Map<String, Object> claims = new HashMap<>();

        UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);
        String role = userDetails.getAuthorities().stream()
                .findFirst() // Assuming a user has only one role
                .orElseThrow(() -> new RuntimeException("User has no roles assigned"))
                .getAuthority();

        claims.put("role", role); // Add user role to JWT claims

        //building the claims for the user
        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(email)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis()+7L * 24 * 60 * 60 * 1000))  //for 7 day
                .and()
                .signWith(secretKey)
                .compact();

    }

    public String extractEmail(String token) {
        // extract the email from jwt token
        return extractClaim(token, Claims::getSubject);
    }

    // Extract the role from the JWT token
    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    // Fetch userId by email from UserRepository
    private String getUserIdByEmail(String email) {
        return usersRepository.findByEmail(email) // Assuming findByEmail exists in your repository
                .map(users -> users.getId().toString()) // Return userId as string (UUID to string)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }


    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String email = extractEmail(token);
        return (email.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
