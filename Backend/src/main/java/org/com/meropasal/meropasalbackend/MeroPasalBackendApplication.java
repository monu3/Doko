package org.com.meropasal.meropasalbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class MeroPasalBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(MeroPasalBackendApplication.class, args);
    }

}
