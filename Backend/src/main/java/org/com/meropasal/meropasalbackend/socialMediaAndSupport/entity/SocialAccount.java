package org.com.meropasal.meropasalbackend.socialMediaAndSupport.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.com.meropasal.meropasalbackend.shop.entity.Shop;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

/**
 * Created On : 2025 25 Jun 3:12 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Entity
@Table(name = "social_accounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SocialAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @UuidGenerator
    @Column(updatable = false, nullable = false)
    private UUID id;

    private String supportEmail;

    private String supportPhone;

    private String facebookLink;

    private String tiktokLink;

    private String instagramLink;

    private String youtubeLink;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", nullable = false)
    @JsonIgnore
    private Shop shop;

}
