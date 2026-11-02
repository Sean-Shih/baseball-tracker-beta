package com.baseball.baseball_backend;

import com.baseball.baseball_backend.repository.PlayerRepository;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import javax.print.attribute.standard.Media;
import javax.swing.text.html.Option;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// Loads web layer needed to test controller
@WebMvcTest(PlayerController.class)
public class PlayerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // supplies a fake PlayerRepository for testing
    @MockitoBean
    private PlayerRepository playerRepository;

    @Test
    void getPlayerById_whenPlayerDoesNotExist_returns404() throws Exception {

        // tells Mockito what repository should return when ID 999 is requested
        when(playerRepository.findById(999)).thenReturn(Optional.empty());

        // simulates a GET request; andExpect verifies controller returns 404
        mockMvc.perform(get("/api/players/999")).andExpect(status().isNotFound());
    }

    @Test
    void getPlayerById_whenPlayerDoesNotExist_doesNotReturn200() throws Exception {

        when (playerRepository.findById(999)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/players/999")).andExpect(status().isNotFound())
                .andExpect(status().is4xxClientError());
    }

    @Test
    void getPlayerById_whenPlayerExists_returns200() throws Exception {

//        Player player = new Player(
//                1,
//                "Paul Skenes",
//                "Pittsburgh Pirates",
//                "P",
//                ".000",
//                "2.05"
//        );


        Player player = new Player(
                1,
        "Paul Skenes",
                "Pittsburgh Pirates",
                "P",
                null,
                null,
                null,
                new BigDecimal("2.05")
        );

        when((playerRepository.findById(1))).thenReturn(Optional.of(player));

        mockMvc.perform(get("/api/players/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Paul Skenes"))
                .andExpect(jsonPath("$.team").value("Pittsburgh Pirates"))
                .andExpect(jsonPath("$.position").value("P"))
                .andExpect(jsonPath("$.era").value("2.05"));
    }

    @Test
    void getAllPlayers_whenNoPlayersExist_returnsEmptyArray() throws Exception {

        when (playerRepository.findAll()).thenReturn(List.of());

        mockMvc.perform(get("/api/players"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void createPlayer_whenValid_returns201() throws Exception {

        // test player
//        Player player = new Player("Test Player", "Test Team", "P", ".250", "3.50");

        Player player = new Player("Test Player", "Test Team", "P",
            new BigDecimal(".250"), new BigDecimal(".350"), new BigDecimal(".450"), new BigDecimal("3.50"));


        // mockito intercepts save() and returns test player
        when(playerRepository.save(any(Player.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // sends simulated JSON POST request
        mockMvc.perform(post("/api/players")
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(player)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Test Player"))
                .andExpect(jsonPath("$.team").value("Test Team"));
    }

    @Test
    void createPlayer_whenNameIsBlank_returns400() throws Exception {

        String invalidJson = """
                {
                    "name": "",
                    "team": "Test Team",
                    "position": "P",
                    "battingAvg": ".250",
                    "era": "3.50"
                }
            """;

        // sends simulated JSON POST request
        mockMvc.perform(post("/api/players")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createPlayer_whenTeamIsBlank_returns400() throws Exception {

        String invalidJson = """
                {
                    "name": "Test Name",
                    "team": "",
                    "position": "P",
                    "battingAvg": ".250",
                    "era": "3.50"
                }
            """;

        // sends simulated JSON POST request
        mockMvc.perform(post("/api/players")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createPlayer_whenBattingAverageIsInvalid_returns400() throws Exception {

        String invalidJson = """
                {
                    "name": "Test Name",
                    "team": "Test Team",
                    "position": "P",
                    "battingAvg": "1.5",
                    "era": "3.50"
                }
            """;

        // sends simulated JSON POST request
        mockMvc.perform(post("/api/players")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());
    }


    // PUT

    @Test
    void updatePlayer_whenPlayerExists_returns200() throws Exception {

//        Player existingPlayer = new Player(1, "Old Name", "Old Team", "P", ".200", "4.00");
        Player existingPlayer = new Player(1, "Old Name", "Old Team", "P",
            new BigDecimal(".200"), new BigDecimal(".250"), new BigDecimal(".350"), new BigDecimal("4.00"));

        when(playerRepository.findById(1)).thenReturn(Optional.of(existingPlayer));

        when(playerRepository.save(any(Player.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String updatedJson = """
                {
                    "name": "Updated Player",
                    "team": "Updated Team",
                    "position": "P",
                    "battingAvg": ".250",
                    "era": "3.50"
                }
            """;

        mockMvc.perform(put("/api/players/1").contentType(MediaType.APPLICATION_JSON).content(updatedJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Player"))
                .andExpect(jsonPath("$.team").value("Updated Team"));
    }

    @Test
    void updatePlayer_whenPlayerDoesNotExists_returns404() throws Exception {

        when(playerRepository.findById(999)).thenReturn(Optional.empty());

        String updatedJson = """
                {
                    "name": "Updated Player",
                    "team": "Updated Team",
                    "position": "P",
                    "battingAvg": ".250",
                    "era": "3.50"
                }
            """;

        mockMvc.perform(put("/api/players/999").contentType(MediaType.APPLICATION_JSON).content(updatedJson))
                .andExpect(status().isNotFound());
    }

    @Test
    void updatePlayer_whenNameIsBlank_returns400() throws Exception {

        String invalidJson = """
                {
                    "name": "",
                    "team": "Updated Team",
                    "position": "P",
                    "battingAvg": ".250",
                    "era": "3.50"
                }
            """;

        mockMvc.perform(put("/api/players/1").contentType(MediaType.APPLICATION_JSON).content(invalidJson))
                .andExpect(status().isBadRequest());
    }


    // DELETE

    @Test
    void deletePlayer_whenPlayerExists_returns204() throws Exception {

//        Player player = new Player("Paul Skenes", "Pittsburgh Pirates", "P", ".000", "2.05");
        Player player = new Player("Paul Skenes", "Pittsburgh Pirates", "P",
            null, null, null, new BigDecimal("2.05"));

        when(playerRepository.findById(1)).thenReturn(Optional.of(player));

        mockMvc.perform(delete("/api/players/1"))
                .andExpect(status().isNoContent())
                .andExpect(content().string(""));
    }

    @Test
    void deletePlayer_whenPlayerDoesNotExist_returns404() throws Exception {

        when(playerRepository.findById(999)).thenReturn(Optional.empty());

        mockMvc.perform(delete("/api/players/999"))
                .andExpect(status().isNotFound());
    }

}
