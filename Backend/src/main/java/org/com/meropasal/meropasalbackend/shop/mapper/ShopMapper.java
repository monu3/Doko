package org.com.meropasal.meropasalbackend.shop.mapper;

/**
 * Created On : 2025 09 Feb 2:20 PM
 * Author : Monu Siddiki
 * Description :
 **/

import org.com.meropasal.meropasalbackend.address.dto.AddressDto;
import org.com.meropasal.meropasalbackend.address.entity.Address;
import org.com.meropasal.meropasalbackend.shop.dto.ShopDTO;
import org.com.meropasal.meropasalbackend.shop.dto.ShopThemeDTO;
import org.com.meropasal.meropasalbackend.shop.entity.Shop;
import org.springframework.stereotype.Component;

@Component
public class ShopMapper {

    public ShopDTO toDTO(Shop shop) {
        if (shop == null) {
            return null;
        }
        ShopDTO dto = new ShopDTO();
        dto.setShopUrl(shop.getShopUrl());
        dto.setBusinessName(shop.getBusinessName());
        dto.setDistrict(shop.getDistrict());
        dto.setProvince(shop.getProvince());
        dto.setLogoUrl(shop.getLogoUrl());
        dto.setTheme(shop.getTheme());

        // Convert embedded Address to AddressDTO
        if (shop.getAddress() != null) {
            dto.setAddress(convertToAddressDTO(shop.getAddress()));
        }
        return dto;
    }


    // New method for theme gallery
    public ShopThemeDTO toThemeDTO(Shop shop) {
        if (shop == null) return null;

        ShopThemeDTO dto = new ShopThemeDTO();
        dto.setShopId(shop.getId());
        dto.setShopUrl(shop.getShopUrl());
        dto.setBusinessName(shop.getBusinessName());
        dto.setThemeName(shop.getTheme());
        dto.setLogoUrl(shop.getLogoUrl());
        return dto;
    }


    public static Shop toEntity(ShopDTO dto) {
        if (dto == null) {
            return null;
        }
        Shop shop = new Shop();
        shop.setShopUrl(dto.getShopUrl());
        shop.setBusinessName(dto.getBusinessName());
        shop.setTheme(dto.getTheme());
        shop.setProvince(dto.getProvince());
        shop.setDistrict(dto.getDistrict());
        shop.setLogoUrl(dto.getLogoUrl());

        // Convert AddressDTO to embeddable Address
        if (dto.getAddress() != null) {
            shop.setAddress(convertToAddress(dto.getAddress()));
        }

        return shop;
    }

    public static AddressDto convertToAddressDTO(Address address) {
        AddressDto dto = new AddressDto();
        dto.setStreet(address.getStreet());
        dto.setTole(address.getTole());
        dto.setCity(address.getCity());
        dto.setPostalCode(address.getPostalCode());
        dto.setMapUrl(address.getMapUrl());
        return dto;
    }


    public static Address convertToAddress(AddressDto dto) {
        Address address = new Address();
        address.setStreet(dto.getStreet());
        address.setTole(dto.getTole());
        address.setCity(dto.getCity());
        address.setPostalCode(dto.getPostalCode());
        address.setMapUrl(dto.getMapUrl());
        return address;
    }

}

