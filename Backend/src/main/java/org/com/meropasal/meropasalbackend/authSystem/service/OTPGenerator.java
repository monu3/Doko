package org.com.meropasal.meropasalbackend.authSystem.service;

import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

/**
 * Created On : 2025 26 Jan 3:59 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Service
public class OTPGenerator {

    public static String generateOTP(String email) {
        try {
            // Create a timestamp string accurate to the current minute (UTC-based)
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmm");
            String minuteKey = LocalDateTime.now(ZoneOffset.UTC).format(formatter);

            // Combine email with minute-based timestamp
            String input = email + minuteKey;

            // Create a SHA-256 hash
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes());

            // Convert the hash to a 6-digit OTP
            StringBuilder otp = new StringBuilder();
            for (byte b : hash) {
                otp.append(Math.abs(b % 10)); // Take the last digit of each byte
                if (otp.length() == 6) break; // Stop when we have 6 digits
            }

            return otp.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Failed to generate OTP", e);
        }
    }
}
