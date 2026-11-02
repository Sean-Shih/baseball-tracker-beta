import type { Player } from "../types/player";

function parseStatistic(
    value: string | null | undefined
): number | null {

    if(value == null || value.trim() === "") return null;

    const number = Number(value);

    return Number.isFinite(number) && number >= 0 ? number : null;
}

export function calculateAverageBattingAverage(
    players: Player[]
): number | null {

    const values = players
        .filter((player) => player.position !== "P")
        .map((player) => parseStatistic(player.battingAvg))
        .filter((value): value is number => value !== null)
        .filter((value) => value <= 1);

    if (values.length === 0) return null;

    const total = values.reduce(
        (sum, value) => sum + value, 
        0
    );

    return total / values.length
}

export function calculateAverageEra(
    players: Player[]
): number | null {

    const values = players
        .filter((player) => player.position === "P")
        .map((player) => parseStatistic(player.era))
        .filter((value): value is number => value !== null)


    if (values.length === 0) return null;

    const total = values.reduce(
        (sum, value) => sum + value, 
        0
    );

    return total / values.length
}

export function getBattingAverageLeaders(
    players: Player[]
): Player[] {

    const validPlayers = players
        .filter((player) => player.position !== "P")
        .filter((player) => {
            const value = parseStatistic(player.battingAvg);
            return value !== null && value <= 1;
        });

    if (validPlayers.length === 0) return [];

    const sortedPlayers = [...validPlayers].sort(
        (a, b) => Number(b.battingAvg) - Number(a.battingAvg)
    );

    const highestAverage = Number(sortedPlayers[0].battingAvg)

    return sortedPlayers.filter((player) => Number(player.battingAvg) === highestAverage);
}

export function getEraLeaders(
    players: Player[]
): Player[] {

    const validPlayers = players
        .filter((player) => player.position === "P")
        .filter(
            (player) => parseStatistic(player.era) !== null
        );

    if (validPlayers.length === 0) return [];

    const sortedPlayers = [...validPlayers].sort(
        (a, b) => Number(a.era) - Number(b.era)
    );

    const lowestEra = Number(sortedPlayers[0].era)

    return sortedPlayers.filter((player) => Number(player.era) === lowestEra);
}