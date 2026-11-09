import type { Player } from "../types/player";

function parseStatistic(
    value: number | null | undefined
): number | null {

    if(value == null || !Number.isFinite(value) || value < 0) {
        return null;
    };

    return value;
}

function getOffensivePlayers(
    players: Player[],
    getValue: (player: Player) => number | null
): number[] { 
    return players.filter((player) => player.position !== "P").map(getValue).filter((value): value is number => value !== null);
}

function calculateAverage(values: number[]): number | null {
    if (values.length === 0) return null;

    const total = values.reduce(
        (sum, value) => sum + value, 
        0
    );

    return total / values.length
}

export function calculateAverageBattingAverage(
    players: Player[]
): number | null {

    const values = getOffensivePlayers(players, (player) => {
        const value = parseStatistic(player.battingAvg);
        return value !== null && value <= 1 ? value : null;
    });

    return calculateAverage(values);
}

export function calculateAverageObp(
    players: Player[]
): number | null {

    const values = getOffensivePlayers(players, (player) => {
        const value = parseStatistic(player.obp);
        return value !== null && value <= 1 ? value : null;
    });

    return calculateAverage(values);
}

export function calculateAverageSlugging(
    players: Player[]
): number | null {

    const values = getOffensivePlayers(players, (player) => {
        return parseStatistic(player.slugging);
    });

    return calculateAverage(values);
}

export function getPlayerOps(
    player: Player
): number | null {

    const storedOps = parseStatistic(player.ops);

    if (storedOps !== null) return storedOps;

    const obp = parseStatistic(player.obp);
    const slugging = parseStatistic(player.slugging);

    if (obp === null || slugging === null) return null;

    return obp + slugging;
}

export function calculateAverageOps(
    players: Player[]
): number | null {

    const values = getOffensivePlayers(players, getPlayerOps);

    return calculateAverage(values);
}

export function calculateAverageEra(
    players: Player[]
): number | null {

    const values = players
        .filter((player) => player.position === "P")
        .map((player) => parseStatistic(player.era))
        .filter((value): value is number => value !== null)


    return calculateAverage(values);
}

// Leaderboard

function getLeaders(
    players: Player[],
    getValue: (player: Player) => number | null,
    lowestIsBest = false
): Player[] {
    const validPlayers = players.map((player) => ({
        player,
        value: getValue(player),
    })).filter(
        (entry): entry is { player: Player; value: number } => entry.value !== null
    );

    if (validPlayers.length === 0) return [];

    const sortedPlayers = [...validPlayers].sort((a, b) => lowestIsBest ? a.value - b.value : b.value - a.value);

    const bestValue = sortedPlayers[0].value;

    return sortedPlayers.filter((entry) => entry.value === bestValue).map((entry) => entry.player);
}

export function getBattingAverageLeaders(
    players: Player[]
): Player[] {

    return getLeaders(
        players.filter((player) => player.position !== "P"),
        (player) => {
            const value = parseStatistic(player.battingAvg);
            return value !== null && value <= 1 ? value : null;
        }
    );
}

export function getObpLeaders(
    players: Player[]
): Player[] {

    return getLeaders(
        players.filter((player) => player.position !== "P"),
        (player) => {
            const value = parseStatistic(player.obp);
            return value !== null && value <= 1 ? value : null;
        }
    );
}

export function getSluggingLeaders(
    players: Player[]
): Player[] {

    return getLeaders(
        players.filter((player) => player.position !== "P"),
        (player) => parseStatistic(player.slugging)
        
    );
}

export function getOpsLeaders(
    players: Player[]
): Player[] {

    return getLeaders(
        players.filter((player) => player.position !== "P"),
        getPlayerOps
    );
}

export function getEraLeaders(
    players: Player[]
): Player[] {
    return getLeaders(
        players.filter((player) => player.position === "P"),
        (player) => parseStatistic(player.era),
        true
    );
}