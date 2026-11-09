import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Player } from "../types/player";
import EraChart from "./EraChart";

vi.mock("recharts", async () => {
    const React = await import("react");

    return {
        ResponsiveContainer: ({ children }: { children: React.ReactNode }) =>
            React.createElement(
                "div",
                { "data-testid": "responsive-container" },
                children
            ),

        BarChart: ({
            data,
            children,
        }: {
            data: { name: string; era: number }[];
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
        name: "Pitcher A",
        team: "Team A",
        position: "P",
        battingAvg: null,
        obp: null,
        slugging: null,
        ops: null,
        era: 3.50,
        ...overrides,
    };
}

describe("EraChart - Rendering", () => {
    it("renders the chart when valid pitcher ERA data is available", () => {
        const players = [
            makePlayer({
                id: 1,
                name: "Pitcher A",
                era: 3.50,
            }),
            makePlayer({
                id: 2,
                name: "Pitcher B",
                era: 2.80,
            }),
        ];

        render(<EraChart players={players} />);

        expect(
            screen.getByRole("heading", {
                name: "Pitcher ERA Comparison",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Lower ERA indicates fewer earned runs allowed per nine innings."
            )
        ).toBeInTheDocument();

        expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    });
});

describe("EraChart - Filtering and Sorting", () => {
    it("filters invalid ERA values and non-pitchers, then sorts by lowest ERA", () => {
        const players = [
            makePlayer({
                id: 1,
                name: "Pitcher A",
                era: 3.50,
            }),
            makePlayer({
                id: 2,
                name: "Pitcher B",
                era: 2.80,
            }),
            makePlayer({
                id: 3,
                name: "Pitcher C",
                era: null,
            }),
            makePlayer({
                id: 4,
                name: "Pitcher D",
                era: Number.NaN,
            }),
            makePlayer({
                id: 5,
                name: "Pitcher E",
                era: Number.POSITIVE_INFINITY,
            }),
            makePlayer({
                id: 6,
                name: "Position Player",
                position: "RF",
                era: 1.50,
            }),
        ];

        render(<EraChart players={players} />);

        const chartData = JSON.parse(
            screen.getByTestId("bar-chart").getAttribute("data-chart-data")!
        );

        expect(chartData).toEqual([
            { name: "Pitcher B", era: 2.80 },
            { name: "Pitcher A", era: 3.50 },
        ]);
    });
});

describe("EraChart - Empty State", () => {
    it("displays an empty-state message when there are no players", () => {
        render(<EraChart players={[]} />);

        expect(
            screen.getByText("No ERA data available")
        ).toBeInTheDocument();

        expect(screen.queryByTestId("bar-chart")).not.toBeInTheDocument();
    });

    it("displays an empty-state message when there are no pitchers", () => {
        const players = [
            makePlayer({
                id: 1,
                name: "Player A",
                position: "RF",
                era: 3.50,
            }),
            makePlayer({
                id: 2,
                name: "Player B",
                position: "DH",
                era: 4.00,
            }),
        ];

        render(<EraChart players={players} />);

        expect(
            screen.getByText("No ERA data available")
        ).toBeInTheDocument();

        expect(screen.queryByTestId("bar-chart")).not.toBeInTheDocument();
    });

    it("displays an empty-state message when all pitchers have invalid ERA values", () => {
        const players = [
            makePlayer({
                id: 1,
                name: "Pitcher A",
                era: null,
            }),
            makePlayer({
                id: 2,
                name: "Pitcher B",
                era: Number.NaN,
            }),
            makePlayer({
                id: 3,
                name: "Pitcher C",
                era: Number.POSITIVE_INFINITY,
            }),
        ];

        render(<EraChart players={players} />);

        expect(
            screen.getByText("No ERA data available")
        ).toBeInTheDocument();

        expect(screen.queryByTestId("bar-chart")).not.toBeInTheDocument();
    });
});