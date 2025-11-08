package org.com.meropasal.meropasalbackend.follower.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

/**
 * Created On : 2025 05 Feb 11:34 AM
 * Author : Monu Siddiki
 * Description :
 **/
@Getter
@Setter
public class FollowerRequestDTO {

    private UUID customerId;

    private UUID shopId;
}
