import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PlayerCard from "./PlayerCard";
import type { Player } from "../types/player";

const testPlayer: Player = {
  id: 1,
  name: "Aaron Judge",
  team: "New York Yankees",
  position: "RF",
  battingAvg: 0.322,
  obp: 0.458,
  slugging: 0.701,
  era: 0,
  ops: 1.159,
};

const testPitcher: Player = {
  id: 2,
  name: "Paul Skenes",
  team: "Pittsburgh Pirates",
  position: "P",
  battingAvg: 0.250,
  obp: 0.300,
  slugging: 0.400,
  era: 2.05,
  ops: null,
};

function renderPlayerCard(player: Player = testPlayer) {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
        <MemoryRouter initialEntries={["/"]}>
            <PlayerCard 
                player={player}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        </MemoryRouter>
    );

    return { onEdit, onDelete };
}

describe("PlayerCard", () => {
    it("renders player's name", () => {
        renderPlayerCard();
        expect(screen.getByText(testPlayer.name)).toBeInTheDocument();
    });

    it("renders player's team", () => {
        renderPlayerCard();
        expect(screen.getByText(testPlayer.team)).toBeInTheDocument();
    });

    it("renders player's position", () => {
        renderPlayerCard();
        expect(screen.getByText(testPlayer.position)).toBeInTheDocument();
    });

    it("renders the placeholder image", () => {
        renderPlayerCard();

        const image = screen.getByAltText("Player Name (placeholder)");

        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute(
        "src",
        "src/assets/player_placeholder.jpg"
        );
    });

    it("displays ERA for pitchers", () => {
        renderPlayerCard(testPitcher);
        expect(screen.getByText("2.05")).toBeInTheDocument();
    });

    it("displays batting statistics for non-pitchers", () => {
        renderPlayerCard(testPlayer);
        expect(screen.getByText(".322/.458/.701")).toBeInTheDocument();
    });

    it("links to the correct player detail page", () => {
        renderPlayerCard();
        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("href", `/player/${testPlayer.id}`);
    });

    it("navigates to the player detail page when clicked", () => {
        const onEdit = vi.fn();
        const onDelete = vi.fn();

        render(
            <MemoryRouter initialEntries={["/"]}>
                <Routes>
                    <Route 
                        path="/" 
                        element={
                            <PlayerCard 
                                player={testPlayer} 
                                onEdit={onEdit} 
                                onDelete={onDelete} 
                            />
                        } 
                    />
                    <Route 
                        path="/player/:id" 
                        element={<div>Player details Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole("link"));

        expect(screen.getByText(/Player details page/i)).toBeInTheDocument();
    });

    it("does not display options menu by default", () => {
        renderPlayerCard();
        expect(screen.queryByText("menu")).not.toBeInTheDocument();
    });

    it("opens options menu when clicked", () => {
        renderPlayerCard();
        
        fireEvent.click(screen.getByRole("button", {
            name: "Player options",
        }));

        expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    it("closes options menu when clicked again", () => {
        renderPlayerCard();

        const optionsButton = screen.getByRole("button", {
            name: "Player options",
        });

        fireEvent.click(optionsButton);
        fireEvent.click(optionsButton);

        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("closes the options menu when Escape is pressed", () => {
        renderPlayerCard();

        fireEvent.click(screen.getByRole("button", {
        name: "Player options",
        }));

        fireEvent.keyDown(document, { key: "Escape" });

        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("closes the options menu when clicking outside", () => {
        renderPlayerCard();

        fireEvent.click(screen.getByRole("button", {
        name: "Player options",
        }));

        fireEvent.mouseDown(document.body);

        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("calls onEdit with the correct player when Edit is clicked", () => {
        const { onEdit } = renderPlayerCard();

        fireEvent.click(screen.getByRole("button", {
        name: "Player options",
        }));

        fireEvent.click(screen.getByRole("menuitem", {
        name: "Edit",
        }));

        expect(onEdit).toHaveBeenCalledTimes(1);
        expect(onEdit).toHaveBeenCalledWith(testPlayer);
    });

    it("closes the menu after clicking Edit", () => {
        renderPlayerCard();

        fireEvent.click(screen.getByRole("button", {
        name: "Player options",
        }));

        fireEvent.click(screen.getByRole("menuitem", {
        name: "Edit",
        }));

        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("calls onDelete with the correct player when Delete is clicked", () => {
        const { onDelete } = renderPlayerCard();

        fireEvent.click(screen.getByRole("button", {
        name: "Player options",
        }));

        fireEvent.click(screen.getByRole("menuitem", {
        name: "Delete",
        }));

        expect(onDelete).toHaveBeenCalledTimes(1);
        expect(onDelete).toHaveBeenCalledWith(testPlayer);
    });

    it("closes the menu after clicking Delete", () => {
        renderPlayerCard();

        fireEvent.click(screen.getByRole("button", {
        name: "Player options",
        }));

        fireEvent.click(screen.getByRole("menuitem", {
        name: "Delete",
        }));

        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
});
