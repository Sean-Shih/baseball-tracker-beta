
import { describe, it, expect, vi } from "vitest";
import { fireEvent, getAllByAltText, getAllByText, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import PlayerTable from "./PlayerTable";
import { testPlayers } from "../test/testPlayers";
import type { Player } from "../types/player";

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

describe("PlayersTable", () => {

    it("renders all players", () => {
        renderPlayerTable();

        expect(screen.getByText("Paul Skenes")).toBeInTheDocument();
        expect(screen.getByText("Shohei Ohtani")).toBeInTheDocument();
        expect(screen.getByText("Aaron Judge")).toBeInTheDocument();

        // expect(screen.getByText("Team")).toBeInTheDocument();
        // expect(screen.getByText("Position")).toBeInTheDocument();
        // expect(screen.getByText("Batting Average")).toBeInTheDocument();
    });

    it("displays player statistics correctly", () => {
        renderPlayerTable();

        expect(screen.getByText(".322")).toBeInTheDocument();
        expect(screen.getByText("2.05")).toBeInTheDocument();
        expect(screen.getByText(".458")).toBeInTheDocument();
        expect(screen.getByText(".701")).toBeInTheDocument();
        expect(screen.getByText("1.159")).toBeInTheDocument();
    })

    it("displays N/A for missing statistics", () => {
        renderPlayerTable();

        const pkRow = screen.getByText("Paul Skenes").closest("tr");

        expect(pkRow).not.toBeNull()

        expect(within(pkRow!).getAllByText("N/A").length).toBeGreaterThan(0);
    });

    it("sorts players by name when the Player header is clicked", () => {
        renderPlayerTable();

        const playerHeader = screen.getByRole("button", {
            name: /player/i
        });

        fireEvent.click(playerHeader);

        const rows = screen.getAllByRole("row").slice(1);

        const names = rows.map(row =>
            within(row).getAllByRole("cell")[0].textContent
        );

        expect(names).toEqual([
            "Aaron Judge",
            "Paul Skenes",
            "Shohei Ohtani"
        ]);
    });

    it("sorts players by batting average in ascending order", () => {
        renderPlayerTable();

        const avgHeader = screen.getByRole("button", {
            name: /batting average/i
        });

        fireEvent.click(avgHeader);

        const rows = screen.getAllByRole("row").slice(1);

        const names = rows.map(row =>
            within(row).getAllByRole("cell")[0].textContent
        );

        expect(names).toEqual([
            "Aaron Judge",
            "Shohei Ohtani",
            "Paul Skenes"
        ]);
    });

    it("sorts players by ERA and keeps missing values at the bottom", () => {
        renderPlayerTable();

        const eraHeader = screen.getByRole("button", {
            name: /^era$/i
        });

        fireEvent.click(eraHeader);

        const rows = screen.getAllByRole("row").slice(1);

        const names = rows.map(row =>
            within(row).getAllByRole("cell")[0].textContent
        );

        expect(names[0]).toBe("Paul Skenes");
        expect(names.slice(1)).toEqual([
            "Shohei Ohtani",
            "Aaron Judge"
        ]);
    });

    it("sorts players by OBP in ascending order", () => {
        renderPlayerTable();

        const obpHeader = screen.getByRole("button", {
            name: /obp/i
        });

        fireEvent.click(obpHeader);

        const rows = screen.getAllByRole("row").slice(1);

        const names = rows.map(row =>
            within(row).getAllByRole("cell")[0].textContent
        );

        expect(names).toEqual([
            "Shohei Ohtani",
            "Aaron Judge",
            "Paul Skenes"
        ]);
    });

    it("calls onEdit when the edit button is clicked", () => {
        const { onEdit } = renderPlayerTable();

        const paulRow = screen.getByText("Paul Skenes").closest("tr")!;

        const editButton = within(paulRow).getByRole("button", {
            name: /edit/i
        });

        fireEvent.click(editButton);

        expect(onEdit).toHaveBeenCalledWith(testPlayers[0]);
    });

    it("calls onDelete when the delete button is clicked", () => {
        const { onDelete } = renderPlayerTable();

        const paulRow = screen.getByText("Paul Skenes").closest("tr")!;

        const deleteButton = within(paulRow).getByRole("button", {
            name: /delete/i
        });

        fireEvent.click(deleteButton);

        expect(onDelete).toHaveBeenCalledWith(testPlayers[0]);
    });

    // it("sorts players by name when the Name header is clicked", async () => {
    //     const user = userEvent.setup();

    //     render(
    //         <MemoryRouter>
    //             <PlayerTable 
    //                 players={testPlayers}
    //                 onEdit={vi.fn()}
    //                 onDelete={vi.fn()}
    //             />
    //         </MemoryRouter>
    //     );

    //     const nameHeader = screen.getByRole("button", {
    //         name: /player/i,
    //     });

    //     await user.click(nameHeader);

    //     const rows = screen.getAllByRole("row").slice(1);

    //     const playerNames = rows.map(
    //         (row) => within(row).getAllByRole("cell")[0].textContent?.trim()
    //     );

    //     expect(playerNames).toEqual([
    //         "Shohei Ohtani",
    //         "Paul Skenes",
    //         "Aaron Judge",
    //     ]);
    // });
});