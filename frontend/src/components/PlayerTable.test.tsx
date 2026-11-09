import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PlayerTable from "./PlayerTable";
import type { Player } from "../types/player";

const testPlayers: Player[] = [
  {
    id: 1,
    name: "Aaron Judge",
    team: "New York Yankees",
    position: "RF",
    battingAvg: 0.322,
    obp: 0.458,
    slugging: 0.701,
    ops: 1.159,
    era: null,
  },
  {
    id: 2,
    name: "Paul Skenes",
    team: "Pittsburgh Pirates",
    position: "P",
    battingAvg: 0.250,
    obp: 0.300,
    slugging: 0.400,
    ops: null,
    era: 2.05,
  },
  {
    id: 3,
    name: "Shohei Ohtani",
    team: "Los Angeles Dodgers",
    position: "DH",
    battingAvg: 0.280,
    obp: 0.390,
    slugging: 0.620,
    ops: 1.010,
    era: null,
  },
  {
    id: 4,
    name: "Mookie Betts",
    team: "Los Angeles Dodgers",
    position: "SS",
    battingAvg: 0.290,
    obp: 0.370,
    slugging: 0.500,
    ops: 0.870,
    era: null,
  },
];

function renderPlayerTable(players: Player[] = testPlayers) {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
        <MemoryRouter>
            <PlayerTable 
                players={players}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        </MemoryRouter>
    );

    return { onEdit, onDelete };
}

function getDisplayedPlayerNames() {
    const rows = screen.getAllByRole("row").slice(1);

    return rows.map(row =>
        within(row).getByRole("link").textContent
    );
}

describe("PlayersTable", () => {

    it("renders all players", () => {
        renderPlayerTable();

        expect(screen.getAllByRole("row")).toHaveLength(5);
    });

    it("renders the correct player names", () => {
        renderPlayerTable();

        expect(screen.getByText("Aaron Judge")).toBeInTheDocument();
        expect(screen.getByText("Paul Skenes")).toBeInTheDocument();
        expect(screen.getByText("Shohei Ohtani")).toBeInTheDocument();
        expect(screen.getByText("Mookie Betts")).toBeInTheDocument();
    });

    it("displays player teams and positions", () => {
        renderPlayerTable();

        expect(screen.getAllByText("New York Yankees").length).toBe(1);
        expect(screen.getAllByText("Pittsburgh Pirates").length).toBe(1);
        expect(screen.getAllByText("RF").length).toBe(1);
        expect(screen.getAllByText("P").length).toBe(1);
    });

    it("renders all table column headers", () => {
        renderPlayerTable();

        screen.getAllByRole("button").forEach((button) => {
            console.log({
                text: button.textContent,
                accessibleName: button.getAttribute("aria-label"),
            });
        });

        expect(screen.getByRole("button", { name: /Player/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Team/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Position/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Batting Average/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /On-Base Percentage/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Slugging/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /^OPS$/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /^ERA$/i })).toBeInTheDocument();

        expect(screen.getByText("Actions")).toBeInTheDocument();
    });

    it("renders empty table when there are no players", () => {
        renderPlayerTable([]);

        expect(screen.getAllByRole("row")).toHaveLength(1);

    });


    // --------------------------------
    // Statistics formatting tests
    // --------------------------------

    it("formats batting average correctly", () => {
        renderPlayerTable();

        expect(screen.getByText(".322")).toBeInTheDocument();
    });

    it("formats on-base percentage correctly", () => {
        renderPlayerTable();

        expect(screen.getByText(".458")).toBeInTheDocument();
    });

    it("formats slugging percentage correctly", () => {
        renderPlayerTable();

        expect(screen.getByText(".701")).toBeInTheDocument();
    });
    
    it("formats OPS correctly", () => {
        renderPlayerTable(); 

        expect(screen.getByText("1.159")).toBeInTheDocument();
    });

    it("formats ERA correctly", () => {
        renderPlayerTable();

        expect(screen.getByText("2.05")).toBeInTheDocument();
    });

    it("displays N/A for missing OPS", () => {
        renderPlayerTable();

        // expect(screen.getByText("N/A")).toBeInTheDocument();
        const opsCell = screen.getByRole("row", { name: /Paul Skenes/ });

        expect(opsCell).toHaveTextContent("N/A");
    });


    // --------------------------------
    // Default sorting tests
    // --------------------------------

    it("sorts players by name in ascending order by default", () => {
        renderPlayerTable();

        expect(getDisplayedPlayerNames()).toEqual([
            "Aaron Judge",
            "Mookie Betts",
            "Paul Skenes",
            "Shohei Ohtani"
        ]);
    });

    it("sets the default sort direction to ascending", () => {
        renderPlayerTable();

        expect(
            screen.getByRole("button", { name: /Player/i })
        ).toHaveAttribute("aria-sort", "ascending");
    });
    
    // --------------------------------
    // Column sorting tests
    // --------------------------------

    it("sorts players by name descending when the Player header is clicked", () => {
        renderPlayerTable();

        fireEvent.click(screen.getByRole("button", { name: /Player/i }));

        expect(getDisplayedPlayerNames()).toEqual([
            "Shohei Ohtani",
            "Paul Skenes",
            "Mookie Betts",
            "Aaron Judge"
        ]);
    });

    it("sorts players by team ascending", () => {
        renderPlayerTable();

        fireEvent.click(screen.getByRole("button", { name: /Team/i }));

        expect(getDisplayedPlayerNames()).toEqual([
            "Shohei Ohtani",
            "Mookie Betts",
            "Aaron Judge",
            "Paul Skenes"
        ]);
    });

    it("sorts players by position ascending", () => {
        renderPlayerTable();

        fireEvent.click(screen.getByRole("button", { name: /Position/i }));

        expect(getDisplayedPlayerNames()).toEqual([
            "Shohei Ohtani",
            "Paul Skenes",
            "Aaron Judge",
            "Mookie Betts"
        ]);
    });

    it("sorts players by batting average in ascending order", () => {
        renderPlayerTable();

        fireEvent.click(screen.getByRole("button", { name: /Batting Average/i }));

        expect(getDisplayedPlayerNames()).toEqual([
            "Paul Skenes",
            "Shohei Ohtani",
            "Mookie Betts",
            "Aaron Judge"
        ]);
    });

    it("sorts players by OBP ascending", () => {
        renderPlayerTable();

        fireEvent.click(screen.getByRole("button", { name: /On-Base Percentage/ }));

        expect(getDisplayedPlayerNames()).toEqual([
            "Paul Skenes",
            "Mookie Betts",
            "Shohei Ohtani",
            "Aaron Judge",
        ]);
    });

    it("sorts players by slugging ascending", () => {
        renderPlayerTable();

        fireEvent.click(screen.getByRole("button", { name: /Slugging/ }));

        expect(getDisplayedPlayerNames()).toEqual([
            "Paul Skenes",
            "Mookie Betts",
            "Shohei Ohtani",
            "Aaron Judge",
        ]);
    });

    it("sorts players by OPS ascending", () => {
        renderPlayerTable();

        fireEvent.click(screen.getByRole("button", { name: /^OPS/ }));

        expect(getDisplayedPlayerNames()).toEqual([
            "Mookie Betts",
            "Shohei Ohtani",
            "Aaron Judge",
            "Paul Skenes",
        ]);
    });

    it("sorts players by ERA ascending", () => {
        renderPlayerTable();

        fireEvent.click(screen.getByRole("button", { name: /ERA/ }));

        expect(getDisplayedPlayerNames()).toEqual([
            "Paul Skenes",
            "Aaron Judge",
            "Shohei Ohtani",
            "Mookie Betts"
        ]);
    });

    // --------------------------------
    // Sort direction tests
    // --------------------------------

    it("changes sorting from ascending to descending when the same header is clicked twice", () => {
        renderPlayerTable();

        const teamButton = screen.getByRole("button", { name: /Team/ });

        fireEvent.click(teamButton);
        fireEvent.click(teamButton);

        expect(getDisplayedPlayerNames()).toEqual([
            "Paul Skenes",
            "Aaron Judge",
            "Shohei Ohtani",
            "Mookie Betts",
        ]);

        expect(teamButton).toHaveAttribute("aria-sort", "descending");
    });

    it("resets sorting to ascending when a different column is selected", () => {
        renderPlayerTable();

        const playerButton = screen.getByRole("button", { name: /Player/ });
        const teamButton = screen.getByRole("button", { name: /Team/ });

        fireEvent.click(playerButton);
        expect(playerButton).toHaveAttribute("aria-sort", "descending");

        fireEvent.click(teamButton);

        expect(teamButton).toHaveAttribute("aria-sort", "ascending");
    });

    // --------------------------------
    // Null sorting tests
    // --------------------------------

    it("keeps null OPS values at the bottom when sorting ascending", () => {
        renderPlayerTable();

        fireEvent.click(screen.getByRole("button", { name: /^OPS/ }));

        expect(getDisplayedPlayerNames()).toEqual([
            "Mookie Betts",
            "Shohei Ohtani",
            "Aaron Judge",
            "Paul Skenes",
        ]);
    });

    it("keeps null OPS values at the bottom when sorting descending", () => {
        renderPlayerTable();

        const opsButton = screen.getByRole("button", { name: /^OPS/ });

        fireEvent.click(opsButton);
        fireEvent.click(opsButton);

        expect(getDisplayedPlayerNames()).toEqual([
            "Aaron Judge",
            "Shohei Ohtani",
            "Mookie Betts",
            "Paul Skenes",
        ]);
    });

    // --------------------------------
    // Navigation tests
    // --------------------------------

    it("links each player to the correct details page", () => {
        renderPlayerTable();

        expect(screen.getByRole("link", { name: "Aaron Judge" }))
        .toHaveAttribute("href", "/player/1");

        expect(screen.getByRole("link", { name: "Paul Skenes" }))
        .toHaveAttribute("href", "/player/2");
    });

    // --------------------------------
    // Edit and delete callback tests
    // --------------------------------

    it("calls onEdit with the correct player", () => {
        const { onEdit } = renderPlayerTable();

        const row = screen.getByRole("link", { name: "Aaron Judge" })
        .closest("tr");

        if (!row) throw new Error("Player row not found");

        fireEvent.click(
        within(row).getByRole("button", { name: "Edit" })
        );

        expect(onEdit).toHaveBeenCalledTimes(1);
        expect(onEdit).toHaveBeenCalledWith(testPlayers[0]);
    });

    it("calls onDelete with the correct player", () => {
        const { onDelete } = renderPlayerTable();

        const row = screen.getByRole("link", { name: "Paul Skenes" })
        .closest("tr");

        if (!row) throw new Error("Player row not found");

        fireEvent.click(
        within(row).getByRole("button", { name: "Delete" })
        );

        expect(onDelete).toHaveBeenCalledTimes(1);
        expect(onDelete).toHaveBeenCalledWith(testPlayers[1]);
    });

    // --------------------------------
    // Original data integrity
    // --------------------------------

    it("does not mutate the original players array when sorting", () => {
        const originalOrder = testPlayers.map((player) => player.name);

        renderPlayerTable();

        fireEvent.click(screen.getByRole("button", { name: /Team/ }));

        expect(testPlayers.map((player) => player.name)).toEqual(originalOrder);
    });
});