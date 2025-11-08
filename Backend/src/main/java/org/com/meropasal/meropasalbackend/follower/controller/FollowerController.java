package org.com.meropasal.meropasalbackend.follower.controller;

import org.com.meropasal.meropasalbackend.follower.dto.FollowerRequestDTO;
import org.com.meropasal.meropasalbackend.follower.dto.FollowerResponseDTO;
import org.com.meropasal.meropasalbackend.follower.service.FollowerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Created On : 2025 08 Jul 10:02 PM
 * Author : Monu Siddiki
 * Description :
 **/

@RestController
@RequestMapping("/follower")
public class FollowerController {

    private final FollowerService followerService;

    public FollowerController(FollowerService followerService) {
        this.followerService = followerService;
    }

    @PostMapping("/follow")
    public ResponseEntity<FollowerResponseDTO> followShop(@RequestBody FollowerRequestDTO dto) {
        return ResponseEntity.ok(followerService.followShop(dto));
    }

    @PostMapping("/unfollow")
    public ResponseEntity<String> unfollowShop(
            @RequestBody FollowerRequestDTO dto) {
        followerService.unfollowShop(dto);
        return ResponseEntity.ok("Unfollowed successfully.");
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countFollowers(@RequestParam UUID shopId) {
        return ResponseEntity.ok(followerService.countFollowers(shopId));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<String>> getUserFollowedShops(@PathVariable UUID customerId) {
        List<String> followedShopIds = followerService.getFollowedShopsByCustomer(customerId);
        return ResponseEntity.ok(followedShopIds);
    }
}
