
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PlayerDetails from "./PlayerDetails";
import type { Player } from "../types/player";
import {
    formatBattingStat,
    formatEra,
    formatOps,
} from "../utils/formatStats";

const mockPlayer: Player = {
    id: 1,
    name: "Aaron Judge",
    team: "New York Yankees",
    position: "RF",
    battingAvg: 0.275,
    obp: 0.400,
    slugging: 0.600,
    ops: 1.000,
    era: null,
};

const mockPitcher: Player = {
    id: 2,
    name: "Paul Skenes",
    team: "Pittsburgh Pirates",
    position: "P",
    battingAvg: null,
    obp: null,
    slugging: null,
    ops: null,
    era: 2.05,
};

function createResponse(
    body: unknown,
    status = 200
): Response {
    return {
        ok: status >= 200 && status < 300,
        status,
        json: () => Promise.resolve(body),
    } as Response;
}

function renderPlayerDetails(id = "1") {
    return render(
        <MemoryRouter initialEntries={[`/player/${id}`]}>
            <Routes>
                <Route path="/player/:id" element={<PlayerDetails />} />
                <Route path="/" element={<h1>Players Home</h1>} />
            </Routes>
        </MemoryRouter>
    );
}

describe("PlayerDetails", () => {
    beforeEach(() => {
        vi.stubGlobal("fetch", vi.fn());
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it("displays a loading message while fetching player details", () => {
        vi.mocked(fetch).mockReturnValue(new Promise(() => {}));

        renderPlayerDetails();

        expect(screen.getByText("Loading Player...")).toBeInTheDocument();
    });

    it("fetches and displays a player's details successfully", async () => {
        vi.mocked(fetch).mockResolvedValue(createResponse(mockPlayer));

        renderPlayerDetails("1");

        expect(await screen.findByRole("heading", {
            name: "Aaron Judge",
        })).toBeInTheDocument();

        expect(screen.getAllByText("New York Yankees")).toHaveLength(2);
        expect(screen.getAllByText("RF")).toHaveLength(2);

        expect(fetch).toHaveBeenCalledWith(
            "http://localhost:8080/api/players/1"
        );
    });

    it("displays the batting line for a non-pitcher", async () => {
        vi.mocked(fetch).mockResolvedValue(createResponse(mockPlayer));

        renderPlayerDetails();

        expect(await screen.findByText("Batting Line")).toBeInTheDocument();
        expect(screen.getByText(String(mockPlayer.battingAvg))).toBeInTheDocument();
    });

    it("displays ERA as the main statistic for a pitcher", async () => {
        vi.mocked(fetch).mockResolvedValue(createResponse(mockPitcher));

        renderPlayerDetails("2");

        expect(await screen.findByRole("heading", {
            name: "Paul Skenes",
        })).toBeInTheDocument();

        expect(screen.getAllByText("ERA")).toHaveLength(2);
        expect(screen.getAllByText("2.05")).toHaveLength(2);
    });

    it("displays all formatted statistics for a player", async () => {
        vi.mocked(fetch).mockResolvedValue(createResponse(mockPlayer));

        renderPlayerDetails();

        expect(await screen.findByRole("heading", {
            name: "Aaron Judge",
        })).toBeInTheDocument();

        expect(screen.getByText("Team")).toBeInTheDocument();
        expect(screen.getByText("Position")).toBeInTheDocument();
        expect(screen.getByText("Batting Average")).toBeInTheDocument();
        expect(screen.getByText("On-Base Percentage")).toBeInTheDocument();
        expect(screen.getByText("Slugging Percentage")).toBeInTheDocument();
        expect(screen.getByText("OPS")).toBeInTheDocument();
        expect(screen.getByText("ERA")).toBeInTheDocument();

        expect(screen.getByText(formatBattingStat(mockPlayer.battingAvg)))
            .toBeInTheDocument();
        expect(screen.getByText(formatBattingStat(mockPlayer.obp)))
            .toBeInTheDocument();
        expect(screen.getByText(formatBattingStat(mockPlayer.slugging)))
            .toBeInTheDocument();
        expect(screen.getByText(formatOps(mockPlayer.ops)))
            .toBeInTheDocument();
        expect(screen.getByText(formatEra(mockPlayer.era)))
            .toBeInTheDocument();
    });

    it("displays Player not found when the API returns 404", async () => {
        vi.mocked(fetch).mockResolvedValue(createResponse(null, 404));

        renderPlayerDetails("999");

        expect(await screen.findByText("Player not Found"))
            .toBeInTheDocument();
    });

    it("displays an error message when the request fails", async () => {
        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

        vi.mocked(fetch).mockRejectedValue(new Error("Network error"));

        renderPlayerDetails();

        expect(await screen.findByText(
            "Error: Unable to fetch player details. Please try again."
        )).toBeInTheDocument();

        expect(consoleSpy).toHaveBeenCalled();
    });

    it("displays an error message when the API returns a server error", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {});

        vi.mocked(fetch).mockResolvedValue(createResponse(
            { message: "Internal server error" },
            500
        ));

        renderPlayerDetails();

        expect(await screen.findByText(
            "Error: Unable to fetch player details. Please try again."
        )).toBeInTheDocument();
    });

    it("provides a link back to the players page", async () => {
        vi.mocked(fetch).mockResolvedValue(createResponse(mockPlayer));

        renderPlayerDetails();

        expect(await screen.findByRole("heading", {
            name: "Aaron Judge",
        })).toBeInTheDocument();

        expect(screen.getByRole("link", {
            name: "Back to Players",
        })).toHaveAttribute("href", "/");
    });

    it("uses the player ID from the URL when fetching details", async () => {
        vi.mocked(fetch).mockResolvedValue(createResponse(mockPitcher));

        renderPlayerDetails("2");

        expect(await screen.findByRole("heading", {
            name: "Paul Skenes",
        })).toBeInTheDocument();

        expect(fetch).toHaveBeenCalledWith(
            "http://localhost:8080/api/players/2"
        );
    });
});
