
import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import PlayerTable from "./PlayerTable";
import { testPlayers } from "../test/testPlayers";

describe("PlayersTable", () => {

    it("sorts players by name when the Name header is clicked", async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <PlayerTable 
                    players={testPlayers}
                    onEdit={vi.fn()}
                    onDelete={vi.fn()}
                />
            </MemoryRouter>
        );

        const nameHeader = screen.getByRole("button", {
            name: /player/i,
        });

        await user.click(nameHeader);

        const rows = screen.getAllByRole("row").slice(1);

        const playerNames = rows.map(
            (row) => within(row).getAllByRole("cell")[0].textContent?.trim()
        );

        expect(playerNames).toEqual([
            "Shohei Ohtani",
            "Paul Skenes",
            "Aaron Judge",
        ]);
    });
});