package org.com.meropasal.meropasalbackend.customer.login;

import lombok.Getter;
import lombok.Setter;

/**
 * Created On : 2025 30 Jun 6:27 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Getter
@Setter
public class SendOtpRequest {
    private String email;
    private String otp;
}
