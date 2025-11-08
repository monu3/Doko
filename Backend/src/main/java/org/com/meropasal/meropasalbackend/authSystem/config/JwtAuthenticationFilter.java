package org.com.meropasal.meropasalbackend.authSystem.config;

/**
 * Created On : 2025 26 Jan 11:55 AM
 * Author : Monu Siddiki
 * Description :
 **/

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;

import jakarta.servlet.http.Cookie;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        // Skip JWT processing for public endpoints
        return path.startsWith("/auth/register") ||
                path.startsWith("/auth/verify-otp") ||
                path.startsWith("/auth/login") ||
                path.startsWith("/auth/check-auth");
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
// Extract JWT from cookies
            String jwt = null;
            Cookie[] cookies = request.getCookies(); // Fetch cookies from the request

            if (cookies != null) {
                // Look for the cookie named "jwt"
                jwt = Arrays.stream(cookies)
                        .filter(cookie -> "jwt".equals(cookie.getName()))
                        .map(Cookie::getValue)
                        .findFirst()
                        .orElse(null);
            }

            if (jwt != null) {
                String userEmail = jwtService.extractEmail(jwt);
                String role = jwtService.extractRole(jwt); // Extract role from the token


                // Validate the token and set authentication in the SecurityContext
                if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

                    if (jwtService.isTokenValid(jwt, userDetails)) {

                        // Ensure the role has the "ROLE_" prefix, as Spring Security uses this convention.
                        String authority = role;
                        if (!authority.startsWith("ROLE_")) {
                            authority = "ROLE_" + authority;
                        }

                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                userDetails, null, Collections.singleton(new SimpleGrantedAuthority(authority)));
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            }
        } catch (Exception e) {
            // Log and handle unexpected exceptions
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Authentication error: " + e.getMessage());
            return;
        }

        filterChain.doFilter(request, response);
    }
}
