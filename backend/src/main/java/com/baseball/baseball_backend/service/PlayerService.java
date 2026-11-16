package com.baseball.baseball_backend.service;

import com.baseball.baseball_backend.Player;
import com.baseball.baseball_backend.repository.PlayerRepository;

import org.hibernate.dialect.unique.CreateTableUniqueDelegate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// tells Spring this class is a service component
@Service
public class PlayerService {

    private final PlayerRepository playerRepository;

    public PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    public Optional<Player> getPlayerById(Integer id) {
        return playerRepository.findById(id);
    }

    public Player createPlayer(Player player) {
        return playerRepository.save(player);
    }

    public Optional<Player> updatePlayer(Integer id, Player updatedPlayer) {
        return playerRepository.findById(id).map(existingPlayer -> {
            existingPlayer.setName(updatedPlayer.getName());
            existingPlayer.setTeam(updatedPlayer.getTeam());
            existingPlayer.setPosition(updatedPlayer.getPosition());
            existingPlayer.setBattingAvg(updatedPlayer.getBattingAvg());
            existingPlayer.setObp(updatedPlayer.getObp());
            existingPlayer.setSlugging(updatedPlayer.getSlugging());
            existingPlayer.setEra(updatedPlayer.getEra());

            return playerRepository.save(existingPlayer);
        });
    }

    public boolean deletePlayer(Integer id) {

        if (!playerRepository.existsById(id)) return false;

        playerRepository.deleteById(id);

        return true;
    }
}
