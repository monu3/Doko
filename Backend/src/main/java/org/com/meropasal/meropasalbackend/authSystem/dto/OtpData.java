package org.com.meropasal.meropasalbackend.authSystem.dto;

import lombok.Data;

import java.time.Instant;

/**
 * Created On : 2025 26 Jan 11:07 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Data
public class OtpData {

    private final String otp;
    private final Instant expirationTime;
}
