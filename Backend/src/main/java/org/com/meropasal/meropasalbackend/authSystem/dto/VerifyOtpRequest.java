package org.com.meropasal.meropasalbackend.authSystem.dto;

import lombok.Data;

/**
 * Created On : 2025 26 Jan 4:08 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Data
public class VerifyOtpRequest {

    private String email;
    private String otp;
}
