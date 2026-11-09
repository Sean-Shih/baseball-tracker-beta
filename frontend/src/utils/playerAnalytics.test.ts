import { describe, it, expect } from "vitest";
import type { Player } from "../types/player";

import {
    calculateAverageBattingAverage,
    calculateAverageObp,
    calculateAverageSlugging,
    calculateAverageOps,
    calculateAverageEra,
    getPlayerOps,
    getBattingAverageLeaders,
    getObpLeaders,
    getSluggingLeaders,
    getOpsLeaders,
    getEraLeaders,
} from "./playerAnalytics";


function makePlayer(overrides: Partial<Player> = {}): Player {
    return {
        id: 1,
        name: "Test Player",
        team: "Test Team",
        position: "RF",
        battingAvg: 0.300,
        obp: 0.400,
        slugging: 0.500,
        ops: 0.900,
        era: null,
        ...overrides,
    };
}

describe("calculateAverageBattingAverage", () => {

    it("calculates the average batting average", () => {
        const players = [
            makePlayer({ battingAvg: 0.300 }),
            makePlayer({ id: 2, battingAvg: 0.400 }),
        ];

        expect(calculateAverageBattingAverage(players)).toBe(0.350);
    });

    it("excludes pitchers", () => {
        const players = [
            makePlayer({ battingAvg: 0.300 }),
            makePlayer({
                id: 2,
                position: "P",
                battingAvg: 0.900,
            }),
        ];

        expect(calculateAverageBattingAverage(players)).toBe(0.300);
    });

    it("ignores missing and invalid statistics", () => {
        const players = [
            makePlayer({ battingAvg: 0.300 }),
            makePlayer({ id: 2, battingAvg: null }),
            makePlayer({ id: 3, battingAvg: -0.100 }),
            makePlayer({ id: 4, battingAvg: 1.200 }),
        ];

        expect(calculateAverageBattingAverage(players)).toBe(0.300);
    });

    it("returns null when no valid offensive statistics exist", () => {
        const players = [
            makePlayer({ battingAvg: null }),
            makePlayer({ id: 2, position: "P", battingAvg: 0.300 }),
        ];

        expect(calculateAverageBattingAverage(players)).toBeNull();
    });

    it("accepts zero as a valid statistic", () => {
        const players = [
            makePlayer({ battingAvg: 0 }),
        ];

        expect(calculateAverageBattingAverage(players)).toBe(0);
    });
});

describe("calculateAverageObp", () => {

    it("calculates average OBP", () => {
        const players = [
            makePlayer({ obp: 0.350 }),
            makePlayer({ id: 2, obp: 0.450 }),
        ];

        expect(calculateAverageObp(players)).toBe(0.400);
    });

    it("ignores invalid OBP values", () => {
        const players = [
            makePlayer({ obp: 0.350 }),
            makePlayer({ id: 2, obp: null }),
            makePlayer({ id: 3, obp: 1.200 }),
        ];

        expect(calculateAverageObp(players)).toBe(0.350);
    });

    it("returns null when no valid OBP exists", () => {
        expect(
            calculateAverageObp([
                makePlayer({ obp: null }),
            ])
        ).toBeNull();
    });
});


describe("calculateAverageSlugging", () => {

    it("calculates average slugging percentage", () => {
        const players = [
            makePlayer({ slugging: 0.500 }),
            makePlayer({ id: 2, slugging: 0.600 }),
        ];

        expect(calculateAverageSlugging(players)).toBe(0.550);
    });

    it("allows slugging values greater than 1", () => {
        const players = [
            makePlayer({ slugging: 1.200 }),
        ];

        expect(calculateAverageSlugging(players)).toBe(1.200);
    });

    it("returns null when no valid slugging values exist", () => {
        expect(
            calculateAverageSlugging([
                makePlayer({ slugging: null }),
            ])
        ).toBeNull();
    });
});

describe("calculateAverageOps", () => {

    it("calculates average OPS", () => {
        const players = [
            makePlayer({ ops: 0.850 }),
            makePlayer({ id: 2, ops: 1.000 }),
        ];

        expect(calculateAverageOps(players)).toBe(0.925);
    });

    it("excludes pitchers", () => {
        const players = [
            makePlayer({ ops: 0.900 }),
            makePlayer({
                id: 2,
                position: "P",
                ops: 1.500,
            }),
        ];

        expect(calculateAverageOps(players)).toBe(0.900);
    });

    it("returns null when no valid OPS exists", () => {
        const players = [
            makePlayer({
                ops: null,
                obp: null,
                slugging: null,
            }),
        ];

        expect(calculateAverageOps(players)).toBeNull();
    });
});


describe("calculateAverageEra", () => {

    it("calculates average ERA for pitchers", () => {
        const players = [
            makePlayer({ position: "P", era: 2.00 }),
            makePlayer({ id: 2, position: "P", era: 4.00 }),
        ];

        expect(calculateAverageEra(players)).toBe(3.00);
    });

    it("excludes non-pitchers", () => {
        const players = [
            makePlayer({ position: "P", era: 3.00 }),
            makePlayer({ id: 2, position: "RF", era: 5.00 }),
        ];

        expect(calculateAverageEra(players)).toBe(3.00);
    });

    it("ignores missing and negative ERA values", () => {
        const players = [
            makePlayer({ position: "P", era: 3.00 }),
            makePlayer({ id: 2, position: "P", era: null }),
            makePlayer({ id: 3, position: "P", era: -1 }),
        ];

        expect(calculateAverageEra(players)).toBe(3.00);
    });

    it("returns null when no valid pitcher ERA exists", () => {
        expect(
            calculateAverageEra([
                makePlayer({ position: "P", era: null }),
            ])
        ).toBeNull();
    });
});

describe("getPlayerOps", () => {

    it("returns stored OPS when available", () => {
        const player = makePlayer({
            ops: 0.950,
            obp: 0.400,
            slugging: 0.500,
        });

        expect(getPlayerOps(player)).toBe(0.950);
    });

    it("calculates OPS when stored OPS is missing", () => {
        const player = makePlayer({
            ops: null,
            obp: 0.400,
            slugging: 0.500,
        });

        expect(getPlayerOps(player)).toBe(0.900);
    });

    it("returns null when OBP is missing", () => {
        const player = makePlayer({
            ops: null,
            obp: null,
            slugging: 0.500,
        });

        expect(getPlayerOps(player)).toBeNull();
    });

    it("returns null when slugging is missing", () => {
        const player = makePlayer({
            ops: null,
            obp: 0.400,
            slugging: null,
        });

        expect(getPlayerOps(player)).toBeNull();
    });

    it("returns null when both OBP and slugging are missing", () => {
        const player = makePlayer({
            ops: null,
            obp: null,
            slugging: null,
        });

        expect(getPlayerOps(player)).toBeNull();
    });

    it("rejects negative stored OPS and falls back to OBP plus slugging", () => {
        const player = makePlayer({
            ops: -0.100,
            obp: 0.400,
            slugging: 0.500,
        });

        expect(getPlayerOps(player)).toBe(0.900);
    });
});

describe("getBattingAverageLeaders", () => {

    it("returns the player with the highest batting average", () => {
        const players = [
            makePlayer({ name: "Player A", battingAvg: 0.300 }),
            makePlayer({ id: 2, name: "Player B", battingAvg: 0.400 }),
            makePlayer({ id: 3, name: "Player C", battingAvg: 0.350 }),
        ];

        expect(
            getBattingAverageLeaders(players).map((p) => p.name)
        ).toEqual(["Player B"]);
    });

    it("returns all players tied for the highest batting average", () => {
        const players = [
            makePlayer({ name: "Player A", battingAvg: 0.400 }),
            makePlayer({ id: 2, name: "Player B", battingAvg: 0.400 }),
            makePlayer({ id: 3, name: "Player C", battingAvg: 0.350 }),
        ];

        expect(
            getBattingAverageLeaders(players).map((p) => p.name)
        ).toEqual(["Player A", "Player B"]);
    });

    it("excludes pitchers", () => {
        const players = [
            makePlayer({ name: "Player A", battingAvg: 0.300 }),
            makePlayer({
                id: 2,
                name: "Pitcher",
                position: "P",
                battingAvg: 0.900,
            }),
        ];

        expect(
            getBattingAverageLeaders(players).map((p) => p.name)
        ).toEqual(["Player A"]);
    });

    it("returns an empty array when no valid players exist", () => {
        const players = [
            makePlayer({ battingAvg: null }),
        ];

        expect(getBattingAverageLeaders(players)).toEqual([]);
    });
});

describe("getObpLeaders", () => {

    it("returns all players tied for the highest OBP", () => {
        const players = [
            makePlayer({ name: "Player A", obp: 0.400 }),
            makePlayer({ id: 2, name: "Player B", obp: 0.450 }),
            makePlayer({ id: 3, name: "Player C", obp: 0.450 }),
        ];

        expect(
            getObpLeaders(players).map((p) => p.name)
        ).toEqual(["Player B", "Player C"]);
    });

    it("returns an empty array when no valid OBP exists", () => {
        expect(
            getObpLeaders([
                makePlayer({ obp: null }),
            ])
        ).toEqual([]);
    });
});


describe("getSluggingLeaders", () => {

    it("returns the player with the highest slugging percentage", () => {
        const players = [
            makePlayer({ name: "Player A", slugging: 0.500 }),
            makePlayer({ id: 2, name: "Player B", slugging: 1.200 }),
        ];

        expect(
            getSluggingLeaders(players).map((p) => p.name)
        ).toEqual(["Player B"]);
    });

    it("returns an empty array when no valid slugging exists", () => {
        expect(
            getSluggingLeaders([
                makePlayer({ slugging: null }),
            ])
        ).toEqual([]);
    });
});

describe("getOpsLeaders", () => {

    it("returns the player with the highest OPS", () => {
        const players = [
            makePlayer({ name: "Player A", ops: 0.800 }),
            makePlayer({ id: 2, name: "Player B", ops: 1.000 }),
        ];

        expect(
            getOpsLeaders(players).map((p) => p.name)
        ).toEqual(["Player B"]);
    });

    it("uses calculated OPS when stored OPS is missing", () => {
        const players = [
            makePlayer({
                ops: null,
                obp: 0.400,
                slugging: 0.600,
            }),
        ];

        expect(
            getOpsLeaders(players).map((p) => p.name)
        ).toEqual(["Test Player"]);
    });

    it("returns an empty array when no valid OPS exists", () => {
        expect(
            getOpsLeaders([
                makePlayer({
                    ops: null,
                    obp: null,
                    slugging: null,
                }),
            ])
        ).toEqual([]);
    });
});

describe("getOpsLeaders", () => {

    it("returns the player with the highest OPS", () => {
        const players = [
            makePlayer({ name: "Player A", ops: 0.800 }),
            makePlayer({ id: 2, name: "Player B", ops: 1.000 }),
        ];

        expect(
            getOpsLeaders(players).map((p) => p.name)
        ).toEqual(["Player B"]);
    });

    it("uses calculated OPS when stored OPS is missing", () => {
        const players = [
            makePlayer({
                ops: null,
                obp: 0.400,
                slugging: 0.600,
            }),
        ];

        expect(
            getOpsLeaders(players).map((p) => p.name)
        ).toEqual(["Test Player"]);
    });

    it("returns an empty array when no valid OPS exists", () => {
        expect(
            getOpsLeaders([
                makePlayer({
                    ops: null,
                    obp: null,
                    slugging: null,
                }),
            ])
        ).toEqual([]);
    });
});

describe("getEraLeaders", () => {

    it("returns the pitcher with the lowest ERA", () => {
        const players = [
            makePlayer({
                name: "Pitcher A",
                position: "P",
                era: 3.50,
            }),
            makePlayer({
                id: 2,
                name: "Pitcher B",
                position: "P",
                era: 2.10,
            }),
            makePlayer({
                id: 3,
                name: "Pitcher C",
                position: "P",
                era: 4.00,
            }),
        ];

        expect(
            getEraLeaders(players).map((p) => p.name)
        ).toEqual(["Pitcher B"]);
    });

    it("returns all pitchers tied for the lowest ERA", () => {
        const players = [
            makePlayer({
                name: "Pitcher A",
                position: "P",
                era: 2.50,
            }),
            makePlayer({
                id: 2,
                name: "Pitcher B",
                position: "P",
                era: 2.50,
            }),
        ];

        expect(
            getEraLeaders(players).map((p) => p.name)
        ).toEqual(["Pitcher A", "Pitcher B"]);
    });

    it("excludes non-pitchers", () => {
        const players = [
            makePlayer({
                name: "Pitcher",
                position: "P",
                era: 3.00,
            }),
            makePlayer({
                id: 2,
                name: "Position Player",
                position: "RF",
                era: 0.50,
            }),
        ];

        expect(
            getEraLeaders(players).map((p) => p.name)
        ).toEqual(["Pitcher"]);
    });

    it("returns an empty array when no valid pitcher ERA exists", () => {
        expect(
            getEraLeaders([
                makePlayer({
                    position: "P",
                    era: null,
                }),
            ])
        ).toEqual([]);
    });
});

