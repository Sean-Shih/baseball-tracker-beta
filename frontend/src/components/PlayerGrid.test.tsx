import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PlayerGrid from "./PlayerGrid";
import type { Player } from "../types/player";

// Mock PlayerCard so we can test PlayerGrid independently.
vi.mock("./PlayerCard", () => ({
  default: ({
    player,
    onEdit,
    onDelete,
  }: {
    player: Player;
    onEdit: (player: Player) => void;
    onDelete: (player: Player) => void;
  }) => (
    <div data-testid="player-card">
      <span>{player.name}</span>

      <button onClick={() => onEdit(player)}>
        Edit {player.name}
      </button>

      <button onClick={() => onDelete(player)}>
        Delete {player.name}
      </button>
    </div>
  ),
}));

const testPlayers: Player[] = [
  {
    id: 1,
    name: "Aaron Judge",
    team: "New York Yankees",
    position: "RF",
    battingAvg: 0.322,
    obp: 0.458,
    slugging: 0.701,
    era: 0,
    ops: 1.159,
  },
  {
    id: 2,
    name: "Paul Skenes",
    team: "Pittsburgh Pirates",
    position: "P",
    battingAvg: 0.250,
    obp: 0.300,
    slugging: 0.400,
    era: 2.05,
    ops: 0.700,
  },
  {
    id: 3,
    name: "Shohei Ohtani",
    team: "Los Angeles Dodgers",
    position: "DH",
    battingAvg: 0.280,
    obp: 0.390,
    slugging: 0.620,
    era: 0,
    ops: 1.010,
  },
];

function renderPlayerGrid(players: Player[] = testPlayers) {
  const onEdit = vi.fn();
  const onDelete = vi.fn();

  render(
    <PlayerGrid
      players={players}
      onEdit={onEdit}
      onDelete={onDelete}
      isDeleting={false}
    />
  );

  return { onEdit, onDelete };
}

describe("PlayerGrid", () => {
  it("renders all player cards", () => {
    renderPlayerGrid();

    expect(screen.getAllByTestId("player-card")).toHaveLength(3);
  });

  it("renders the correct player names", () => {
    renderPlayerGrid();

    expect(screen.getByText("Aaron Judge")).toBeInTheDocument();
    expect(screen.getByText("Paul Skenes")).toBeInTheDocument();
    expect(screen.getByText("Shohei Ohtani")).toBeInTheDocument();
  });

  it("renders no player cards when the players array is empty", () => {
    renderPlayerGrid([]);

    expect(screen.queryAllByTestId("player-card")).toHaveLength(0);
  });

  it("renders the correct number of cards for a single player", () => {
    renderPlayerGrid([testPlayers[0]]);

    expect(screen.getAllByTestId("player-card")).toHaveLength(1);
    expect(screen.getByText("Aaron Judge")).toBeInTheDocument();
  });

  it("passes the correct player to the onEdit callback", () => {
    const { onEdit } = renderPlayerGrid();

    fireEvent.click(
      screen.getByRole("button", { name: "Edit Aaron Judge" })
    );

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(testPlayers[0]);
  });

  it("passes the correct player to the onDelete callback", () => {
    const { onDelete } = renderPlayerGrid();

    fireEvent.click(
      screen.getByRole("button", { name: "Delete Paul Skenes" })
    );

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(testPlayers[1]);
  });

  it("does not call edit or delete callbacks when no action is performed", () => {
    const { onEdit, onDelete } = renderPlayerGrid();

    expect(onEdit).not.toHaveBeenCalled();
    expect(onDelete).not.toHaveBeenCalled();
  });
});
