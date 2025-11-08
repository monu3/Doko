package org.com.meropasal.meropasalbackend.customer.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.com.meropasal.meropasalbackend.authSystem.dto.OtpData;
import org.com.meropasal.meropasalbackend.authSystem.enums.UserRole;
import org.com.meropasal.meropasalbackend.authSystem.service.EmailService;
import org.com.meropasal.meropasalbackend.authSystem.service.OTPGenerator;
import org.com.meropasal.meropasalbackend.customer.entity.CustomerDetails;
import org.com.meropasal.meropasalbackend.customer.repo.CustomerRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created On : 2025 01 Jul 6:14 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final EmailService emailService;
    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();


    public CustomerService(CustomerRepository customerRepository, EmailService emailService) {
        this.customerRepository = customerRepository;
        this.emailService = emailService;
    }

    @Transactional
    public void initiateSignup(String email) {
        // Validate email format
        if (!isValidEmail(email)) {
            throw new IllegalArgumentException("Invalid email format");
        }

        // Allow resend for unverified users
        Optional<CustomerDetails> existing = customerRepository.findByEmail(email);
        if (existing.isPresent() && existing.get().isVerified()) {
            throw new IllegalStateException("Email already registered");
        }

        // Generate and store OTP
        String otp = OTPGenerator.generateOTP(email);
        Instant expirationTime = Instant.now().plusSeconds(120);
        otpStorage.put(email, new OtpData(otp, expirationTime));

        // Send OTP email
        emailService.sendOtpEmail(email, otp);
    }


    @Transactional
    public CustomerDetails verifyAndCompleteSignup(String email, String otp, UserRole role) {
        OtpData otpData = otpStorage.get(email);

        // Verify OTP
        if (otpData == null || !otpData.getOtp().equals(otp)) {
            throw new SecurityException("Invalid OTP");
        }

        if (Instant.now().isAfter(otpData.getExpirationTime())) {
            throw new SecurityException("OTP expired");
        }

        // Handle existing customer
        Optional<CustomerDetails> existingCustomer = customerRepository.findByEmail(email);
        CustomerDetails customer;

        if (existingCustomer.isPresent()) {
            customer = existingCustomer.get();
            customer.setVerified(true);
        } else {
            customer = new CustomerDetails();
            customer.setEmail(email);
            customer.setRole(role);
            customer.setVerified(true);
        }
        otpStorage.remove(email);

        return customerRepository.save(customer);
    }

    @Transactional
    public void logout(UUID customerId) {
        CustomerDetails customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found"));
        customer.setVerified(false);
        customerRepository.save(customer);
    }

    public void resendOtp(String email) {
        if (!otpStorage.containsKey(email)) {
            throw new IllegalStateException("No pending signup for this email");
        }

        String otp = OTPGenerator.generateOTP(email);
        Instant expirationTime = Instant.now().plusSeconds(120);
        otpStorage.put(email, new OtpData(otp, expirationTime));

        emailService.sendOtpEmail(email, otp);
    }

    private boolean isValidEmail(String email) {
        return email.matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
    }

}
