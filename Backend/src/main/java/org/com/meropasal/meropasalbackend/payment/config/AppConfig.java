package org.com.meropasal.meropasalbackend.payment.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Created On : 2025 05 Sep 10:39 PM
 * Author : Monu Siddiki
 * Description :
 **/
@Configuration
public class AppConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
