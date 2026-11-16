package com.baseball.baseball_backend;

import com.baseball.baseball_backend.service.PlayerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:3000" })
@RequestMapping("api/players")
public class PlayerController {

    private final PlayerService playerService;

    private void normalizePlayer(Player player) {
        player.setName(player.getName().trim());
        player.setTeam(player.getTeam().trim());
        player.setPosition(player.getPosition().trim());

    }

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    // @GetMapping("/api/players")
    @GetMapping 
    public List<Player> getPlayers() {
        return playerService.getAllPlayers();
    }

    // @GetMapping("/api/players/{id}")
    @GetMapping("/{id}") 
    public Player getPlayer(@PathVariable int id) {

        // orElseThrow throws exception if player does not exist
        // NOT_FOUND represents http error 404
        return playerService.getPlayerById(id).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Player with ID " + id + " not found"
        ));
    }

    // @PostMapping("/api/players")
    @PostMapping
    public ResponseEntity<Player> createPlayer(@Valid @RequestBody Player player) {

        normalizePlayer(player);
        Player savedPlayer = playerService.createPlayer(player);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedPlayer);
    }

    // @PutMapping("/api/players/{id}")
    @PutMapping("{id}")
    public ResponseEntity<Player> updatePlayer(@PathVariable int id, @Valid @RequestBody Player updatedPlayer) {

        normalizePlayer(updatedPlayer);

        Player savedPlayer = playerService.updatePlayer(id, updatedPlayer).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Player with ID " + id + " not found"
        ));

        return ResponseEntity.ok(savedPlayer);
    }

    // @DeleteMapping("api/players/{id}")
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable int id) {

        boolean deleted = playerService.deletePlayer(id);

        if (!deleted) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Player with ID " + id + " not found");

        return ResponseEntity.noContent().build();

    }

}
