
import type { Player } from "../types/player";

export const testPlayers: Player[] = [
    {
        id: 1,
        name: "Paul Skenes",
        team: "Pittsburgh Pirates",
        position: "P",
        battingAvg: null,
        era: 2.05,
        obp: null,
        slugging: null,
        ops: null
    },
    {
        id: 2,
        name: "Shohei Ohtani",
        team: "Los Angeles Dodgers",
        position: "DH",
        battingAvg: 0.281,
        era: null,
        obp: 0.390,
        slugging: 0.620,
        ops: 1.010
    },
    {
        id: 3,
        name: "Aaron Judge",
        team: "New York Yankees",
        position: "RF",
        battingAvg: 0.322,
        era: null,
        obp: 0.458,
        slugging: 0.701,
        ops: 1.159
    }
];