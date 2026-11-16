package com.baseball.baseball_backend;

import com.baseball.baseball_backend.service.PlayerService;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// Loads web layer needed to test controller
@WebMvcTest(PlayerController.class)
public class PlayerControllerTest {

    private Player createTestPlayer() {
        return new Player(
                1,
                "Paul Skenes",
                "Pittsburgh Pirates",
                "P",
                null,
                null,
                null,
                new BigDecimal("2.05")
        );
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // supplies a fake PlayerRepository for testing
    @MockitoBean
    private PlayerService playerService;

    @Test
    void getPlayerById_whenPlayerDoesNotExist_returns404() throws Exception {

        // tells Mockito what repository should return when ID 999 is requested
        when(playerService.getPlayerById(999)).thenReturn(Optional.empty());

        // simulates a GET request; andExpect verifies controller returns 404
        mockMvc.perform(get("/api/players/999")).andExpect(status().isNotFound());
    }

    @Test
    void getPlayerById_whenPlayerExists_returns200() throws Exception {

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

        when((playerService.getPlayerById(1))).thenReturn(Optional.of(player));

        mockMvc.perform(get("/api/players/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Paul Skenes"))
                .andExpect(jsonPath("$.team").value("Pittsburgh Pirates"))
                .andExpect(jsonPath("$.position").value("P"))
                .andExpect(jsonPath("$.era").value("2.05"));
    }

    @Test
    void getPlayerById_whenPlayerExists_returnsAllStatistics() throws Exception {
        Player player = new Player(
                1,
                "Aaron Judge",
                "New York Yankees",
                "RF",
                new BigDecimal("0.322"),
                new BigDecimal("0.458"),
                new BigDecimal("0.701"),
                null
        );

        when(playerService.getPlayerById(1)).thenReturn(Optional.of(player));

        mockMvc.perform(get("/api/players/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Aaron Judge"))
                .andExpect(jsonPath("$.team").value("New York Yankees"))
                .andExpect(jsonPath("$.position").value("RF"))
                .andExpect(jsonPath("$.battingAvg").value(0.322))
                .andExpect(jsonPath("$.obp").value(0.458))
                .andExpect(jsonPath("$.slugging").value(0.701))
                .andExpect(jsonPath("$.ops").value(1.159))
                .andExpect(jsonPath("$.era").doesNotExist());
    }

    @Test
    void getAllPlayers_whenNoPlayersExist_returnsEmptyArray() throws Exception {

        when (playerService.getAllPlayers()).thenReturn(List.of());

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
            new BigDecimal(".250"), new BigDecimal(".350"), new BigDecimal(".450"), null);


        // mockito intercepts save() and returns test player
        when(playerService.createPlayer(any(Player.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // sends simulated JSON POST request
        mockMvc.perform(post("/api/players")
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(player)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Test Player"))
                .andExpect(jsonPath("$.team").value("Test Team"))
                .andExpect(jsonPath("$.position").value("P"))
                .andExpect(jsonPath("$.battingAvg").value(0.250))
                .andExpect(jsonPath("$.obp").value(0.350))
                .andExpect(jsonPath("$.slugging").value(0.450))
                .andExpect(jsonPath("$.ops").value(0.800));
    }

    @Test
    void createPlayer_whenNameIsBlank_returns400() throws Exception {

        String invalidJson = """
                {
                    "name": "",
                    "team": "Test Team",
                    "position": "P",
                    "battingAvg": 0.250,
                    "era": 3.50
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
                    "battingAvg": 0.250,
                    "era": 3.50
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
                    "battingAvg": 1.5
                }
            """;

        // sends simulated JSON POST request
        mockMvc.perform(post("/api/players")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createPlayer_whenBattingAverageIsNegative_returns400() throws Exception {

        String invalidJson = """
                {
                    "name": "Test Name",
                    "team": "Test Team",
                    "position": "P",
                    "battingAvg": -0.456
                }
            """;

        // sends simulated JSON POST request
        mockMvc.perform(post("/api/players")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createPlayer_whenObpAboveMax_returns400() throws Exception {
        String invalidJson = """
                {
                    "name": "Test Player",
                    "team": "Test Team",
                    "position": "RF",
                    "obp": 1.500
                }
            """;

        mockMvc.perform(post("/api/players")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createPlayer_whenObpNegative_returns400() throws Exception {
        String invalidJson = """
                {
                    "name": "Test Player",
                    "team": "Test Team",
                    "position": "RF",
                    "obp": -0.500
                }
            """;

        mockMvc.perform(post("/api/players")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createPlayer_whenSluggingAboveMax_returns400() throws Exception {
        String invalidJson = """
                {
                    "name": "Test Player",
                    "team": "Test Team",
                    "position": "RF",
                    "slugging": 4.500
                }
            """;

        mockMvc.perform(post("/api/players")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createPlayer_whenSluggingNegative_returns400() throws Exception {
        String invalidJson = """
                {
                    "name": "Test Player",
                    "team": "Test Team",
                    "position": "RF",
                    "slugging": -0.500
                }
            """;

        mockMvc.perform(post("/api/players")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createPlayer_whenEraNegative_returns400() throws Exception {
        String invalidJson = """
                {
                    "name": "Test Player",
                    "team": "Test Team",
                    "position": "RF",
                    "era": -1.2
                }
            """;

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
            new BigDecimal(".200"), new BigDecimal(".250"), new BigDecimal(".350"), null);

        Player updatedPlayer = new Player(
                1,
                "Updated Player",
                "Updated Team",
                "P",
                new BigDecimal("0.300"),
                new BigDecimal("0.400"),
                new BigDecimal("0.500"),
                null
        );

        when(playerService.updatePlayer(eq(1), any(Player.class)))
                .thenReturn(Optional.of(updatedPlayer));

//        when(playerService.findById(1)).thenReturn(Optional.of(existingPlayer));
//
//        when(playerService.save(any(Player.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String updatedJson = """
                {
                    "name": "Updated Player",
                    "team": "Updated Team",
                    "position": "P",
                    "battingAvg": 0.300,
                    "obp": 0.400,
                    "slugging": 0.500,
                    "era": null
                }
            """;

        mockMvc.perform(put("/api/players/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(updatedJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Player"))
                .andExpect(jsonPath("$.team").value("Updated Team"))
                .andExpect(jsonPath("$.battingAvg").value(0.300))
                .andExpect(jsonPath("$.obp").value(0.400))
                .andExpect(jsonPath("$.slugging").value(0.500))
                .andExpect(jsonPath("$.ops").value(0.900))
                .andExpect(jsonPath("$.era").doesNotExist());
    }

    @Test
    void updatePlayer_whenPlayerDoesNotExists_returns404() throws Exception {

        when(playerService.updatePlayer(eq(999), any(Player.class))).thenReturn(Optional.empty());

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

        Player player = createTestPlayer();

        when(playerService.deletePlayer(1)).thenReturn(true);

        mockMvc.perform(delete("/api/players/1"))
                .andExpect(status().isNoContent())
                .andExpect(content().string(""));
        verify(playerService, times(1)).deletePlayer(1);
    }

    @Test
    void deletePlayer_whenPlayerDoesNotExist_returns404() throws Exception {

        when(playerService.deletePlayer(999)).thenReturn(false);

        mockMvc.perform(delete("/api/players/999"))
                .andExpect(status().isNotFound());

        verify(playerService, times(1)).deletePlayer(999);
    }

}
