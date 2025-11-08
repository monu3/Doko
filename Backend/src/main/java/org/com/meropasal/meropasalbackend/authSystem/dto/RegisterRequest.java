package org.com.meropasal.meropasalbackend.authSystem.dto;

import lombok.*;
import org.com.meropasal.meropasalbackend.authSystem.enums.UserRole;

/**
 * Created On : 2025 26 Jan 11:59 AM
 * Author : Monu Siddiki
 * Description :
 **/
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String email;
    private String password;
    private UserRole role ;
}
