package org.com.meropasal.meropasalbackend.authSystem.service;

/**
 * Created On : 2025 26 Jan 12:00 PM
 * Author : Monu Siddiki
 * Description :
 **/
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }


    @Async
    //for otp
    public void sendOtpEmail(String email, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your OTP for Verification");
        message.setText("Your OTP is: " + otp);
        mailSender.send(message);
    }
}
