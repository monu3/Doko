package org.com.meropasal.meropasalbackend.authSystem.config;

/**
 * Created On : 2025 26 Jan 11:58 AM
 * Author : Monu Siddiki
 * Description :
 **/

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthFilter) throws Exception {
       return  http
               .cors()
               .and()
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeRequests()
               .requestMatchers("/shops/by-url/**").permitAll()
               .requestMatchers(HttpMethod.GET, "/**").permitAll()
                .requestMatchers("/auth/register","/auth/verify-otp","/auth/login","/auth/check-auth","/auth/**").permitAll() // Allow public access to auth endpoints
                .requestMatchers("/shops/**","/api/shop-gateway-config/**").hasAnyRole("SHOP_OWNER", "ADMIN") // Only SHOP_OWNER and ADMIN can access /shops/**
                .requestMatchers("/admin/**").hasRole("ADMIN") // Only ADMIN can access /admin/**
               .requestMatchers("/customer/**","/follower/**","/cart/**","/wishlist/**","/orders/**","/api/payments/**").permitAll()
                .anyRequest().authenticated() // Secure all other endpoints
                .and()
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class) // Add JWT filter
                .build();
    }



    //method to config the cross origin to connect the frontend
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Allow all endpoints
                        .allowedOrigins("http://localhost:2025","http://192.168.1.88:2025") // Allow requests from React frontend
                        .allowedMethods("GET", "POST", "PUT","PATCH", "DELETE", "OPTIONS") // Allowed HTTP methods
                        .allowedHeaders("*") // Allow all headers
                        .allowCredentials(true) // Allow cookies and credentials
                        .exposedHeaders("Set-Cookie");
            }
        };
    }


    //for the encryption of the password
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
