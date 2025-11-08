package org.com.meropasal.meropasalbackend.category.dto;

/**
 * Created On : 2025 11 Feb 2:47 PM
 * Author : Monu Siddiki
 * Description :
 **/

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoryDto {
    private UUID id;
    private String name;
    private String categoryUrl;
    private String bannerUrl;
    private String description;
    private boolean deleted;
    private LocalDateTime createdAt;
    private boolean active;
    private UUID shopId;
    private long productCount;
}

