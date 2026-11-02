package com.baseball.baseball_backend;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;

import java.math.BigDecimal;

@Entity
@Table(name = "players")
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank(message = "Player name is required")
    private String name;

    @NotBlank(message = "Team is required")
    private String team;

    @NotBlank(message = "Position is required")
    @Pattern(
            regexp = "^(P|C|1B|2B|3B|SS|LF|CF|RF|DH)$",
            message = "Position must be uppercase"
    )
    private String position;

    @DecimalMin(value = "0.000", message = "Batting average cannot be negative")
    @DecimalMax(value = "1.000", message = "Batting average cannot exceed 1.000")
    @Column(precision = 4, scale = 3)
    private BigDecimal battingAvg;

    @DecimalMin(value = "0.00", message = "ERA cannot be negative")
    @Column(precision = 6, scale = 2)
    private BigDecimal era;

    @DecimalMin(value = "0.000", message = "OBP cannot be negative")
    @DecimalMax(value = "1.000", message = "OBP cannot exceed 1.000")
    @Column(precision = 4, scale = 3)
    private BigDecimal obp;

    @DecimalMin(value = "0.000", message = "Slugging cannot be negative")
    @DecimalMax(value = "4.000", message = "Slugging cannot exceed 4.000")
    @Column(precision = 4, scale = 3, name = "slugging")
    private BigDecimal slugging;

    public Player() {}

    public Player(
            int id,
            String name,
            String team,
            String position,
            BigDecimal battingAvg,
            BigDecimal obp,
            BigDecimal slugging,
            BigDecimal era
    ) {
        this.id = id;
        this.name = name;
        this.team = team;
        this.position = position;
        this.battingAvg = battingAvg;
        this.obp = obp;
        this.slugging = slugging;
        this.era = era;
    }

    public Player(String name, String team, String position,
                  BigDecimal battingAvg, BigDecimal obp, BigDecimal slugging, BigDecimal era) {
        this.name = name;
        this.team = team;
        this.position = position;
        this.battingAvg = battingAvg;
        this.obp = obp;
        this.slugging = slugging;
        this.era = era;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getTeam() {
        return team;
    }

    public String getPosition() {
        return position;
    }

    public BigDecimal getBattingAvg() {
        return battingAvg;
    }

    public BigDecimal getObp() {
        return obp;
    }

    public BigDecimal getSlugging() {
        return slugging;
    }

    public BigDecimal getEra() {
        return era;
    }

    @Transient
    public BigDecimal getOps() {
        if (obp == null || slugging == null) return null;
        
        return obp.add(slugging);
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setTeam(String team) {
        this.team = team;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public void setBattingAvg(BigDecimal battingAvg) {
        this.battingAvg = battingAvg;
    }

    public void setObp(BigDecimal obp) {
        this.obp = obp;
    }

    public void setSlugging(BigDecimal slugging) {
        this.slugging = slugging;
    }

    public void setEra(BigDecimal era) {
        this.era = era;
    }

}
