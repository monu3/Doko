package org.com.meropasal.meropasalbackend.authSystem.service;

/**
 * Created On : 2025 26 Jan 12:00 PM
 * Author : Monu Siddiki
 * Description :
 **/
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import org.com.meropasal.meropasalbackend.authSystem.config.JwtService;
import org.com.meropasal.meropasalbackend.authSystem.dto.LoginRequest;
import org.com.meropasal.meropasalbackend.authSystem.dto.OtpData;
import org.com.meropasal.meropasalbackend.authSystem.dto.RegisterRequest;
import org.com.meropasal.meropasalbackend.authSystem.dto.VerifyOtpRequest;
import org.com.meropasal.meropasalbackend.authSystem.entity.Users;
import org.com.meropasal.meropasalbackend.authSystem.enums.UserRole;
import org.com.meropasal.meropasalbackend.authSystem.repo.UsersRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {


    //to print something in the console
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);


    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final JwtService jwtService;

    public AuthService(UsersRepository usersRepository,JwtService jwtService, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, EmailService emailService) {
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
    }

    // Store OTPs temporarily (in-memory)
    private final Map<String, OtpData> otpStorage = new HashMap<>();

    public String register(RegisterRequest request) {
        // Create a new user
        Users users = new Users();
        users.setEmail(request.getEmail());
        users.setPassword(passwordEncoder.encode(request.getPassword()));
        users.setRole(UserRole.SHOP_OWNER);
        users.setEnabled(false); // User is not enabled until verified
        usersRepository.save(users);
//


        // Generate and store OTP with expiration time (e.g., 2 minutes)
        String otp = OTPGenerator.generateOTP(request.getEmail());
        Instant expirationTime = Instant.now().plusSeconds(120); // 2 minutes
        otpStorage.put(request.getEmail(), new OtpData(otp, expirationTime));

        logger.info("Generated OTP for email: {} -> {}", request.getEmail(), otp);


        // Send OTP via email
        emailService.sendOtpEmail(request.getEmail(), otp);

        return "Registration successful. Please check your email for the OTP.";
    }

    public String verifyOtp(VerifyOtpRequest request) {
        OtpData otpData = otpStorage.get(request.getEmail());

        if (otpData == null) {
            logger.error("No OTP found for email: {}", request.getEmail());
            throw new RuntimeException("Invalid OTP null wala");
        }

        if (!otpData.getOtp().equals(request.getOtp())) {
            logger.error("OTP mismatch for email: {}. Expected: {}, Received: {}", request.getEmail(), otpData.getOtp(), request.getOtp());
            throw new RuntimeException("Invalid OTP 2nd wala");
        }

        if (Instant.now().isAfter(otpData.getExpirationTime())) {
            logger.error("OTP expired for email: {}", request.getEmail());
            throw new RuntimeException("OTP has expired");
        }

        // OTP is valid, enable the shop
        Users users = usersRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        users.setEnabled(true);
        usersRepository.save(users);

        // Clear the OTP from storage
        otpStorage.remove(request.getEmail());

        // Generate and return the JWT token
        return jwtService.generateToken(users.getEmail());
    }

    // (Optional) A method to resend OTP if needed.
    public String resendOtp(String email) {
        // You might want to generate a new OTP and update otpStorage accordingly.
        String otp = OTPGenerator.generateOTP(email);
        Instant expirationTime = Instant.now().plusSeconds(120);
        otpStorage.put(email, new OtpData(otp, expirationTime));

        logger.info("Resent OTP for email: {} -> {}", email, otp);
        emailService.sendOtpEmail(email, otp);

        return "OTP has been resent successfully.";
    }

    public String login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        Users users = usersRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!users.isEnabled()) {
            throw new RuntimeException("User is not verified");
        }

        // Generate and return JWT token
        return jwtService.generateToken(users.getEmail());
    }


}
