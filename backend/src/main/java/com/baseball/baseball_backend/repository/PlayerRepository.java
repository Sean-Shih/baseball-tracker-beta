package com.baseball.baseball_backend.repository;

import com.baseball.baseball_backend.Player;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlayerRepository extends JpaRepository<Player, Integer>{
}
