package com.baseball.baseball_backend;

import com.baseball.baseball_backend.repository.PlayerRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Locale;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class PlayerController {

    private final PlayerRepository playerRepository;

    private void normalizePlayer(Player player) {
        player.setName(player.getName().trim());
        player.setTeam(player.getTeam().trim());
        player.setPosition(player.getPosition().trim().toUpperCase());

        player.setBattingAvg(player.getBattingAvg() == null ? null : player.getBattingAvg());

        player.setObp(player.getObp() == null ? null : player.getObp());

        player.setSlugging(player.getSlugging() == null ? null : player.getSlugging());

        player.setEra(player.getEra() == null ? null : player.getEra());

    }

    public PlayerController(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    @GetMapping("/api/players")
    public List<Player> getPlayers() {
        return playerRepository.findAll();
    }

    @GetMapping("/api/players/{id}")
    public Player getPlayer(@PathVariable int id) {

        // orElseThrow throws exception if player does not exist
        // NOT_FOUND represents http error 404
        return playerRepository.findById(id).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Player with ID " + id + " not found"
        ));
    }

    @PostMapping("/api/players")
    public ResponseEntity<Player> createPlayer(@Valid @RequestBody Player player) {

        normalizePlayer(player);
        Player savedPlayer = playerRepository.save(player);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedPlayer);
    }

    @PutMapping("/api/players/{id}")
    public ResponseEntity<Player> updatePlayer(@PathVariable int id, @Valid @RequestBody Player updatedPlayer) {
        Player existingPlayer = playerRepository.findById(id).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Player with ID " + id + " not found"
        ));

        normalizePlayer(updatedPlayer);

        existingPlayer.setName(updatedPlayer.getName());
        existingPlayer.setTeam(updatedPlayer.getTeam());
        existingPlayer.setPosition(updatedPlayer.getPosition());
        existingPlayer.setBattingAvg(updatedPlayer.getBattingAvg());

        existingPlayer.setObp(updatedPlayer.getObp());
        existingPlayer.setSlugging(updatedPlayer.getSlugging());

        existingPlayer.setEra(updatedPlayer.getEra());

        Player savedPlayer = playerRepository.save(existingPlayer);

        return ResponseEntity.ok(savedPlayer);
    }

    @DeleteMapping("api/players/{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable int id) {
        Player existingPlayer = playerRepository.findById(id).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Player with ID " + id + " not found"
        ));

        playerRepository.delete(existingPlayer);

        return ResponseEntity.noContent().build();

    }

}
