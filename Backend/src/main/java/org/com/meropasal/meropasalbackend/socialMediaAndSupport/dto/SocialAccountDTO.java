package org.com.meropasal.meropasalbackend.socialMediaAndSupport.dto;


import lombok.*;

import java.util.UUID;

/**
 * Created On : 2025 25 Jun 3:15 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocialAccountDTO {
    private UUID id;

    private String supportEmail;

    private String supportPhone;

    private String facebookLink;

    private String tiktokLink;

    private String instagramLink;

    private String youtubeLink;

    private UUID shopId;

}
