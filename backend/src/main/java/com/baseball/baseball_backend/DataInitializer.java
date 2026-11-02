package com.baseball.baseball_backend;

import com.baseball.baseball_backend.repository.PlayerRepository;
import jakarta.persistence.Column;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeDatabase(PlayerRepository playerRepository) {
        return args -> {

            if (playerRepository.count() > 0) return;

//            List.of(
            playerRepository.save(new Player(
            "Paul Skenes",
            "Pittsburgh Pirates",
            "P",
            null,
            null,
            null,
            new BigDecimal("2.05")
            ));

            playerRepository.save(new Player(
            "Shohei Ohtani",
            "Los Angeles Dodgers",
            "DH",
            new BigDecimal(".281"),
            new BigDecimal(".377"),
            new BigDecimal(".512"),
            new BigDecimal("1.79")
            ));

            playerRepository.save(new Player(
            "Pete Crow-Armstrong",
            "Chicago Cubs",
            "CF",
            new BigDecimal(".282"),
            new BigDecimal(".372"),
            new BigDecimal(".570"),
            null
            ));

            playerRepository.save(new Player(
            "Logan Gilbert",
            "Seattle Mariners",
            "P",
            null,
            null,
            null,
            new BigDecimal("3.69")
            ));

            playerRepository.save(new Player(
            "Kazuma Okamoto",
            "Toronto Blue Jays",
            "3B",
            new BigDecimal(".235"),
            new BigDecimal(".464"),
            new BigDecimal(".774"),
            null
            ));

        System.out.println("Player data Inserted");
        };
    }
}
