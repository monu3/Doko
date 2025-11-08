package org.com.meropasal.meropasalbackend.follower.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Created On : 2025 08 Jul 9:47 PM
 * Author : Monu Siddiki
 * Description :
 **/

@Getter
@Setter
public class FollowerResponseDTO {

    private UUID id;
    private UUID customerId;
    private UUID shopId;
    private LocalDateTime followedAt;
}
