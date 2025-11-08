package org.com.meropasal.meropasalbackend.shop.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

/**
 * Created On : 2025 04 Jul 3:40 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Getter
@Setter
public class ShopThemeDTO {

    private UUID shopId;
    private String shopUrl;
    private String businessName;
    private String themeName;
    private String logoUrl;
}
