package org.com.meropasal.meropasalbackend.socialMediaAndSupport.controller;

import org.com.meropasal.meropasalbackend.socialMediaAndSupport.dto.SocialAccountDTO;
import org.com.meropasal.meropasalbackend.socialMediaAndSupport.service.SocialAccountService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Created On : 2025 25 Jun 3:47 PM
 * Author : Monu Siddiki
 * Description :
 **/
@RestController
@RequestMapping("/socialAccount/{shopId}")
public class SocialAccountController {

    private final SocialAccountService socialAccountService;

    public SocialAccountController(SocialAccountService socialAccountService) {
        this.socialAccountService = socialAccountService;
    }

    @PostMapping
    public ResponseEntity<SocialAccountDTO> createSocialAccount(
            @PathVariable UUID shopId,
            @RequestBody SocialAccountDTO dto) {
        SocialAccountDTO created = socialAccountService.createSocialAccount(shopId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<SocialAccountDTO> getSocialAccount(@PathVariable UUID shopId) {
        SocialAccountDTO dto = socialAccountService.getByShopId(shopId);
        return ResponseEntity.ok(dto);
    }

    @PutMapping
    public ResponseEntity<SocialAccountDTO> updateSocialAccount(
            @PathVariable UUID shopId,
            @RequestBody SocialAccountDTO dto) {
        SocialAccountDTO updated = socialAccountService.updateSocialAccount(shopId, dto);
        return ResponseEntity.ok(updated);
    }
}
