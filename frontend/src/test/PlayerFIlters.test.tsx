import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlayerFilters from "../components/PlayerFilters";

describe("PlayerFilters", () => {
    it("displays team and position options", () => {
        render(
            <PlayerFilters 
                teams={["All", "New York Yankees", "Boston Red Sox"]}
                positions={["All", "P", "DH"]}
                selectedTeam="All"
                selectedPosition="All"
                onTeamChange={vi.fn()}
                onPositionChange={vi.fn()}
                onReset={vi.fn()}
            />
        );

        expect(
            screen.getByRole("option", { name: "New York Yankees" })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("option", { name: "P" })
        ).toBeInTheDocument();
    });

    it("calls onTeamChange when a team is selected", async () => {
        const user = userEvent.setup();
        const onTeamChange = vi.fn();

        render(
            <PlayerFilters
                teams={["All", "New York Yankees"]}
                positions={["All", "P"]}
                selectedTeam="All"
                selectedPosition="All"
                onTeamChange={onTeamChange}
                onPositionChange={vi.fn()}
                onReset={vi.fn()}
            />
        );

        const teamSelect = screen.getByRole("combobox", { name: /team/i, });

        await user.selectOptions(teamSelect, "New York Yankees");

        expect(onTeamChange).toHaveBeenCalledWith("New York Yankees");
    });


    it("calls onPositionChange when a position is selected", async () => {
        const user = userEvent.setup();
        const onPositionChange = vi.fn();

        render(
            <PlayerFilters
                teams={["All", "New York Yankees"]}
                positions={["All", "P", "DH"]}
                selectedTeam="All"
                selectedPosition="All"
                onTeamChange={vi.fn()}
                onPositionChange={onPositionChange}
                onReset={vi.fn()}
            />
        );

        const positionSelect = screen.getByRole("combobox", { name: /position/i, });

        await user.selectOptions(positionSelect, "P");

        expect(onPositionChange).toHaveBeenCalledWith("P");
    });

    it("calls onReset when clear filters button is pressed", async () => {
        const user = userEvent.setup();
        const onReset = vi.fn();

        render(
            <PlayerFilters
                teams={["All", "New York Yankees"]}
                positions={["All", "P"]}
                selectedTeam="New York Yankees"
                selectedPosition="P"
                onTeamChange={vi.fn()}
                onPositionChange={vi.fn()}
                onReset={onReset}
            />
        );

        await user.click(screen.getByRole("button", { name: /clear filters/i }));

        expect(onReset).toHaveBeenCalledTimes(1);
    });
});