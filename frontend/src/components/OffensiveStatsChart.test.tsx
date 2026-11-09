import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Player } from "../types/player";
import OffensiveStatsChart from "./OffensiveStatsChart";

vi.mock("recharts", async () => {
    const React = await import("react");

    return {
        ResponsiveContainer: ({ children }: { children: React.ReactNode }) =>
            React.createElement("div", { "data-testid": "responsive-container" }, children),

        BarChart: ({
            data,
            children,
        }: {
            data: { name: string; value: number }[];
            children: React.ReactNode;
        }) =>
            React.createElement(
                "div",
                {
                    "data-testid": "bar-chart",
                    "data-chart-data": JSON.stringify(data),
                },
                children
            ),

        Bar: () => React.createElement("div", { "data-testid": "bar" }),
        XAxis: () => React.createElement("div"),
        YAxis: () => React.createElement("div"),
        CartesianGrid: () => React.createElement("div"),
        Tooltip: () => React.createElement("div"),
    };
});

function makePlayer(overrides: Partial<Player> = {}): Player {
    return {
        id: 1,
        name: "Player A",
        team: "Team A",
        position: "RF",
        battingAvg: 0.300,
        obp: 0.400,
        slugging: 0.500,
        ops: 0.900,
        era: null,
        ...overrides,
    };
}

describe("OffensiveStatsChart - Rendering", () => {
    it("renders the chart with the default batting average statistic", () => {
        const players = [
            makePlayer({ id: 1, name: "Player A", battingAvg: 0.300 }),
            makePlayer({ id: 2, name: "Player B", battingAvg: 0.400 }),
        ];

        render(<OffensiveStatsChart players={players} />);

        expect(screen.getByRole("heading", { name: "Offensive Statistics Comparison" })).toBeInTheDocument();

        expect(screen.getByText("Comparing Batting Average (AVG)")).toBeInTheDocument();

        expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    });
});

describe("OffensiveStatsChart - Filtering and Sorting", () => {
    it("excludes pitchers and players with invalid batting average values, then sorts valid players", () => {
        const players = [
            makePlayer({
                id: 1,
                name: "Player A",
                battingAvg: 0.300,
            }),
            makePlayer({
                id: 2,
                name: "Player B",
                battingAvg: 0.450,
            }),
            makePlayer({
                id: 3,
                name: "Pitcher A",
                position: "P",
                battingAvg: 0.500,
            }),
            makePlayer({
                id: 4,
                name: "Player C",
                battingAvg: null,
            }),
            makePlayer({
                id: 5,
                name: "Player D",
                battingAvg: Number.NaN,
            }),
            makePlayer({
                id: 6,
                name: "Player E",
                battingAvg: Number.POSITIVE_INFINITY,
            }),
        ];

        render(<OffensiveStatsChart players={players} />);

        const chart = screen.getByTestId("bar-chart");

        const chartData = JSON.parse(
            chart.getAttribute("data-chart-data")!
        );

        expect(chartData).toEqual([
            { name: "Player B", value: 0.450 },
            { name: "Player A", value: 0.300 },
        ]);
    });
});

it("excludes undefined batting average values", () => {
    const players = [
        makePlayer({
            id: 1,
            name: "Player A",
            battingAvg: undefined as unknown as null,
        }),
        makePlayer({
            id: 2,
            name: "Player B",
            battingAvg: 0.350,
        }),
    ];

    render(<OffensiveStatsChart players={players} />);

    const chartData = JSON.parse(
        screen.getByTestId("bar-chart").getAttribute("data-chart-data")!
    );

    expect(chartData).toEqual([
        { name: "Player B", value: 0.350 },
    ]);
});

describe("OffensiveStatsChart - Statistic Selection", () => {
    it("updates the chart when a different statistic is selected", () => {
        const players = [
            makePlayer({
                id: 1,
                name: "Player A",
                battingAvg: 0.300,
                obp: 0.450,
            }),
            makePlayer({
                id: 2,
                name: "Player B",
                battingAvg: 0.400,
                obp: 0.350,
            }),
        ];

        render(<OffensiveStatsChart players={players} />);

        const select = screen.getByRole("combobox", {
            name: "Select offensive statistic",
        });

        fireEvent.change(select, {
            target: { value: "obp" },
        });

        expect(
            screen.getByText("Comparing On-Base Percentage (OBP)")
        ).toBeInTheDocument();

        const chartData = JSON.parse(
            screen.getByTestId("bar-chart").getAttribute("data-chart-data")!
        );

        expect(chartData).toEqual([
            { name: "Player A", value: 0.450 },
            { name: "Player B", value: 0.350 },
        ]);
    });

    it("updates the chart when OPS is selected", () => {
        const players = [
            makePlayer({
                id: 1,
                name: "Player A",
                ops: 0.900,
            }),
            makePlayer({
                id: 2,
                name: "Player B",
                ops: 1.000,
            }),
        ];

        render(<OffensiveStatsChart players={players} />);

        fireEvent.change(
            screen.getByRole("combobox", {
                name: "Select offensive statistic",
            }),
            { target: { value: "ops" } }
        );

        expect(
            screen.getByText("Comparing On-base Plus Slugging (OPS)")
        ).toBeInTheDocument();

        const chartData = JSON.parse(
            screen.getByTestId("bar-chart").getAttribute("data-chart-data")!
        );

        expect(chartData).toEqual([
            { name: "Player B", value: 1.000 },
            { name: "Player A", value: 0.900 },
        ]);
    });
});

describe("OffensiveStatsChart - Empty State", () => {
    it("displays an empty-state message when there are no players", () => {
        render(<OffensiveStatsChart players={[]} />);

        expect(
            screen.getByText("No Batting Average (AVG) data available")
        ).toBeInTheDocument();

        expect(screen.queryByTestId("bar-chart")).not.toBeInTheDocument();
    });

    it("displays an empty-state message when all players are pitchers", () => {
        const players = [
            makePlayer({
                id: 1,
                name: "Pitcher A",
                position: "P",
            }),
            makePlayer({
                id: 2,
                name: "Pitcher B",
                position: "P",
            }),
        ];

        render(<OffensiveStatsChart players={players} />);

        expect(
            screen.getByText("No Batting Average (AVG) data available")
        ).toBeInTheDocument();

        expect(screen.queryByTestId("bar-chart")).not.toBeInTheDocument();
    });

    it("displays an empty-state message when all offensive players have invalid statistics", () => {
        const players = [
            makePlayer({
                id: 1,
                name: "Player A",
                battingAvg: null,
            }),
            makePlayer({
                id: 2,
                name: "Player B",
                battingAvg: Number.NaN,
            }),
        ];

        render(<OffensiveStatsChart players={players} />);

        expect(
            screen.getByText("No Batting Average (AVG) data available")
        ).toBeInTheDocument();
    });

    it("updates the empty-state message when another statistic is selected", () => {
        const players = [
            makePlayer({
                id: 1,
                name: "Player A",
                battingAvg: null,
                obp: null,
            }),
        ];

        render(<OffensiveStatsChart players={players} />);

        fireEvent.change(
            screen.getByRole("combobox", {
                name: "Select offensive statistic",
            }),
            { target: { value: "obp" } }
        );

        expect(
            screen.getByText("No On-Base Percentage (OBP) data available")
        ).toBeInTheDocument();
    });
});