import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AnalyticsSummary from "./AnalyticsSummary";
import type { Player } from "../types/player";

function makePlayer(overrides: Partial<Player> = {}): Player {
    return {
        id: 1,
        name: "Aaron Judge",
        team: "New York Yankees",
        position: "RF",
        battingAvg: 0.300,
        obp: 0.400,
        slugging: 0.600,
        ops: 1.000,
        era: null,
        ...overrides,
    };
}

describe("AnalyticsSummary - Roster Summary", () => {
    it("displays the correct roster counts", () => {
        const players = [
            makePlayer({ id: 1, name: "Aaron Judge", position: "RF" }),
            makePlayer({ id: 2, name: "Shohei Ohtani", position: "DH" }),
            makePlayer({ id: 3, name: "Paul Skenes", position: "P" }),
        ];

        render(<AnalyticsSummary players={players} />);

        expect(screen.getByText("Total Players")).toBeInTheDocument();
        expect(screen.getByText("Pitchers")).toBeInTheDocument();
        expect(screen.getByText("Position Players")).toBeInTheDocument();

        expect(screen.getByText("3")).toBeInTheDocument();
        expect(screen.getByText("1")).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("displays zero count for empty roster", () => {
        render(<AnalyticsSummary players={[]} />);

        expect(screen.getByText("Total Players")).toBeInTheDocument();
        expect(screen.getByText("Pitchers")).toBeInTheDocument();
        expect(screen.getByText("Position Players")).toBeInTheDocument();

        expect(screen.getAllByText("0")).toHaveLength(3);

        // Average statistics
        expect(screen.getAllByText("N/A")).toHaveLength(5);

        // Statistical leader empty states
        expect(screen.getByText("No valid Batting Averages available")).toBeInTheDocument();
        expect(screen.getByText("No valid OBP available")).toBeInTheDocument();
        expect(screen.getByText("No valid SLG available")).toBeInTheDocument();
        expect(screen.getByText("No valid OPS available")).toBeInTheDocument();
        expect(screen.getByText("No valid ERA available")).toBeInTheDocument();
    });

    it("counts all players as pitchers when all players are pitchers", () => {
        const players = [
            makePlayer({ position: "P"}),
            makePlayer({ id: 2, position: "P", name: "Paul Skenes" }),
        ];

        render(<AnalyticsSummary players={players} />);

        expect(screen.getByText("Total Players").parentElement)
        .toHaveTextContent("2");

        expect(screen.getByText("Pitchers").parentElement)
        .toHaveTextContent("2");

        expect(screen.getByText("Position Players").parentElement)
        .toHaveTextContent("0");
    });
});

describe("AnalyticsSummary - Offensive Stats", () => {

    it("displays the offensive statistic averages", () => {
        const players = [
            makePlayer({
                battingAvg: 0.300,
                obp: 0.400,
                slugging: 0.600,
                ops: 1.000,
            }),
            makePlayer({
                id: 2,
                name: "Shohei Ohtani",
                battingAvg: 0.400,
                obp: 0.500,
                slugging: 0.700,
                ops: 1.200,
            }),
        ];

        render(<AnalyticsSummary players={players} />);

        expect(screen.getByText("Average Batting Average")).toBeInTheDocument();
        expect(screen.getByText("Average On-Base Percentage")).toBeInTheDocument();
        expect(screen.getByText("Average Slugging Percentage")).toBeInTheDocument();
        expect(screen.getByText("Average On-Base + Slugging Percentage")).toBeInTheDocument();

        expect(screen.getByText("0.350")).toBeInTheDocument(); // AVG
        expect(screen.getByText("0.450")).toBeInTheDocument(); // OBP
        expect(screen.getByText("0.650")).toBeInTheDocument(); // SLG
        expect(screen.getByText("1.100")).toBeInTheDocument(); // OPS
    });

    it("displays N/A when offensive stats are unavailable", () => {
        const players = [
            makePlayer({
                battingAvg: null,
                obp: null,
                slugging: null,
                ops: null,
            }),
        ];

        render(<AnalyticsSummary players={players} />);
        
        expect(screen.getByText("Average Batting Average")).toBeInTheDocument();
        expect(screen.getByText("Average On-Base Percentage")).toBeInTheDocument();
        expect(screen.getByText("Average Slugging Percentage")).toBeInTheDocument();
        expect(screen.getByText("Average On-Base + Slugging Percentage")).toBeInTheDocument();

        expect(screen.getAllByText("N/A").length).toBeGreaterThanOrEqual(4); // AVG
    });

});

describe("AnalyticsSummary - Pitching Averages", () => {

    it("displays average ERA for pitchers", () => {
        const players = [
            makePlayer({
                name: "Paul Skenes",
                position: "P",
                era: 2.00,
            }),
            makePlayer({
                id: 2,
                name: "Pitcher B",
                position: "P",
                era: 4.00,
            }),
        ];

        render(<AnalyticsSummary players={players} />);
        
        expect(screen.getByText("Average ERA")).toBeInTheDocument();
        expect(screen.getByText("3.00")).toBeInTheDocument();
    });

    it("diplays N/A when no valid ERA is available", () => {
        const players = [
            makePlayer({
                position: "P",
                era: null,
            }),
        ];

        render(<AnalyticsSummary players={players} />);
        
        expect(screen.getByText("Average ERA")).toBeInTheDocument();
        expect(screen.getAllByText("N/A").length).toBeGreaterThanOrEqual(1);
    });

    it("displays N/A when the roster has no pitchers", () => {
        const players = [
            makePlayer({ position: "RF" }),
            makePlayer({ id: 2, position: "DH" }),
        ];

        render(<AnalyticsSummary players={players} />);

        const eraCard = screen.getByText("Average ERA").parentElement;

        expect(eraCard).toHaveTextContent("N/A");
        expect(screen.getByText("No valid ERA available")).toBeInTheDocument();
    });
});

describe("AnalyticsSummary - Statistical Leaders", () => {

    it("displays leaders for all statistical categories", () => {
        const players = [
            makePlayer({
                id: 1,
                name: "Aaron Judge",
                battingAvg: 0.300,
                obp: 0.400,
                slugging: 0.600,
                ops: 1.000,
            }),
            makePlayer({
                id: 2,
                name: "Shohei Ohtani",
                position: "DH",
                battingAvg: 0.400,
                obp: 0.500,
                slugging: 0.700,
                ops: 1.200,
            }),
            makePlayer({
                id: 3,
                name: "Paul Skenes",
                position: "P",
                battingAvg: null,
                obp: null,
                slugging: null,
                ops: null,
                era: 2.00,
            }),
        ];

        render(<AnalyticsSummary players={players} />);

        expect(screen.getByText("Highest AVG")).toBeInTheDocument();
        expect(screen.getByText("Highest OBP")).toBeInTheDocument();
        expect(screen.getByText("Highest SLG")).toBeInTheDocument();
        expect(screen.getByText("Highest OPS")).toBeInTheDocument();
        expect(screen.getByText("Lowest ERA")).toBeInTheDocument();

        expect(screen.getAllByText(/Shohei Ohtani/).length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText("Paul Skenes - 2.00")).toBeInTheDocument();
    });

    it("displays all players tied for a statistical lead", () => {
        const players = [
            makePlayer({
                id: 1,
                name: "Player A",
                battingAvg: 0.400,
            }),
            makePlayer({
                id: 2,
                name: "Player B",
                battingAvg: 0.400,
            }),
        ];

        render(<AnalyticsSummary players={players} />);

        const avgSection = screen.getByText("Highest AVG").parentElement;

        expect(avgSection).toHaveTextContent("Player A - 0.400");
        expect(avgSection).toHaveTextContent("Player B - 0.400");
    });

    it("displays empty messages when no valid leaders exists", () => {

        const players = [
            makePlayer({
                position: "RF",
                battingAvg: null,
                obp: null,
                slugging: null,
                ops: null,
            }),
            makePlayer({
                id: 2,
                name: "Paul Skenes",
                position: "P",
                era: null,
                battingAvg: null,
                obp: null,
                slugging: null,
                ops: null,
            }),
        ];

        render(<AnalyticsSummary players={players} />);

        expect(screen.getByText("No valid Batting Averages available")).toBeInTheDocument();
        expect(screen.getByText("No valid OBP available")).toBeInTheDocument();
        expect(screen.getByText("No valid SLG available")).toBeInTheDocument();
        expect(screen.getByText("No valid OPS available")).toBeInTheDocument();
        expect(screen.getByText("No valid ERA available")).toBeInTheDocument();
    });

    it("calculates OPS for a leader when the stored OPS value is null", () => {
        const players = [
            makePlayer({
                id: 1,
                name: "Player A",
                obp: 0.500,
                slugging: 0.700,
                ops: null,
            }),
            makePlayer({
                id: 2,
                name: "Player B",
                obp: 0.400,
                slugging: 0.600,
                ops: 1.000,
            }),
        ];

        render(<AnalyticsSummary players={players} />);

        const opsSection = screen.getByText("Highest OPS").parentElement;

        expect(opsSection).toHaveTextContent("Player A - 1.200");
    });

});