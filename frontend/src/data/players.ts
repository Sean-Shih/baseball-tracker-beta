import type { Player } from "../types/player";

export const players: Player[] = [
    {
        id: 1,
        name: "Paul Skenes",
        team: "Pittsburgh Pirates",
        position: "P",
        era: 3.78,
    },
    {
        id: 2,
        name: "Shohei Ohtani",
        team: "Los Angeles Dodgers",
        position: "DH",
        battingAvg: .281,
        obp: .375,
        slugging: .950,
    },
    {
        id: 3,
        name: "Pete Crow-Armstrong",
        team: "Chicago Cubs",
        position: "CF",
        battingAvg: .282,
        obp: .320,
        slugging: .811,
    },
    {
        id: 4,
        name: "Logan Gilbert",
        team: "Seattle Mariners",
        position: "P",
        era: 3.69,
    },
    {
        id: 5,
        name: "Kazuma Okamoto",
        team: "Toronto Blue Jays",
        position: "3B",
        battingAvg: .235,
        obp: .464,
        slugging: .774,
    }
]