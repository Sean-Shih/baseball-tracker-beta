
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "./Home";
import type { Player } from "../types/player";

// Mock child components
vi.mock("../components/SearchBar", () => ({
  default: ({ searchTerm, onSearch }: { searchTerm: string; onSearch: (value: string) => void }) => (
    <input
      aria-label="Search players"
      value={searchTerm}
      onChange={(e) => onSearch(e.target.value)}
    />
  ),
}));

vi.mock("../components/PlayerGrid", () => ({
  default: ({
    players,
    onEdit,
    onDelete,
  }: {
    players: Player[];
    onEdit: (player: Player) => void;
    onDelete: (player: Player) => void;
  }) => (
    <div data-testid="player-grid">
      {players.map((player) => (
        <div key={player.id}>
          <span>{player.name}</span>
          <button onClick={() => onEdit(player)}>
            Edit {player.name}
          </button>
          <button onClick={() => onDelete(player)}>
            Delete {player.name}
          </button>
        </div>
      ))}
    </div>
  ),
}));

vi.mock("../components/PlayerTable", () => ({
  default: ({
    players,
    onEdit,
    onDelete,
  }: {
    players: Player[];
    onEdit: (player: Player) => void;
    onDelete: (player: Player) => void;
  }) => (
    <div data-testid="player-table">
      {players.map((player) => (
        <div key={player.id}>
          <span>{player.name}</span>
          <button onClick={() => onEdit(player)}>
            Edit {player.name}
          </button>
          <button onClick={() => onDelete(player)}>
            Delete {player.name}
          </button>
        </div>
      ))}
    </div>
  ),
}));

vi.mock("../components/AddPlayerForm", () => ({
  default: ({ onPlayerAdded }: { onPlayerAdded: () => void }) => (
    <button onClick={onPlayerAdded}>Simulate Player Added</button>
  ),
}));

vi.mock("../components/EditPlayerForm", () => ({
  default: ({
    player,
    onPlayerUpdated,
    onCancel,
  }: {
    player: Player;
    onPlayerUpdated: () => void;
    onCancel: () => void;
  }) => (
    <div data-testid="edit-player-form">
      <p>Editing {player.name}</p>
      <button onClick={onPlayerUpdated}>Save Edit</button>
      <button onClick={onCancel}>Cancel Edit</button>
    </div>
  ),
}));

vi.mock("../components/PlayerFilters", () => ({
  default: ({
    teams,
    positions,
    selectedTeam,
    selectedPosition,
    onTeamChange,
    onPositionChange,
    onReset,
  }: {
    teams: string[];
    positions: string[];
    selectedTeam: string;
    selectedPosition: string;
    onTeamChange: (value: string) => void;
    onPositionChange: (value: string) => void;
    onReset: () => void;
  }) => (
    <div>
      <select
        aria-label="Filter by team"
        value={selectedTeam}
        onChange={(e) => onTeamChange(e.target.value)}
      >
        {teams.map((team) => (
          <option key={team} value={team}>{team}</option>
        ))}
      </select>

      <select
        aria-label="Filter by position"
        value={selectedPosition}
        onChange={(e) => onPositionChange(e.target.value)}
      >
        {positions.map((position) => (
          <option key={position} value={position}>{position}</option>
        ))}
      </select>

      <button onClick={onReset}>Reset Filters</button>
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
    battingAvg: 0,
    obp: 0,
    slugging: 0,
    era: 2.05,
    ops: null,
  },
  {
    id: 3,
    name: "Shohei Ohtani",
    team: "Los Angeles Dodgers",
    position: "DH",
    battingAvg: 0.310,
    obp: 0.390,
    slugging: 0.620,
    era: 0,
    ops: 1.010,
  },
];

// Helper for successful API responses
function mockFetchSuccess(data: Player[] = testPlayers) {
  vi.mocked(fetch).mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(data),
  } as Response);
}

describe("Home", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  // 1. Initial loading and fetching

  it("displays a loading message while players are being fetched", () => {
    vi.mocked(fetch).mockReturnValue(new Promise(() => {}));

    render(<Home />);

    expect(screen.getByRole("status")).toHaveTextContent("Loading players...");
  });

  it("fetches players when the page first loads", async () => {
    mockFetchSuccess();

    render(<Home />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8080/api/players"
      );
    });
  });

  it("displays players after a successful fetch", async () => {
    mockFetchSuccess();

    render(<Home />);

    expect(await screen.findByText("Aaron Judge")).toBeInTheDocument();
    expect(screen.getByText("Paul Skenes")).toBeInTheDocument();
    expect(screen.getByText("Shohei Ohtani")).toBeInTheDocument();
  });

  it("displays the correct player count", async () => {
    mockFetchSuccess();

    render(<Home />);

    expect(await screen.findByText("Showing 3 of 3 players")).toBeInTheDocument();
  });

  it("displays an empty state when the API returns no players", async () => {
    mockFetchSuccess([]);

    render(<Home />);

    expect(await screen.findByText("No players found")).toBeInTheDocument();
  });

  // 2. Fetch errors

  it("displays an error message when fetching players fails", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("Network error"));

    render(<Home />);

    expect(
      await screen.findByText("Unable to load players, please try again.")
    ).toBeInTheDocument();
  });

  it("allows the user to retry fetching players", async () => {
    vi.mocked(fetch)
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(testPlayers),
      } as Response);

    render(<Home />);

    fireEvent.click(await screen.findByRole("button", { name: "Try again" }));

    expect(await screen.findByText("Aaron Judge")).toBeInTheDocument();

    expect(fetch).toHaveBeenCalledTimes(2);
  });

  // 3. Search functionality

  it("filters players by name", async () => {
    mockFetchSuccess();

    render(<Home />);

    await screen.findByText("Aaron Judge");

    fireEvent.change(screen.getByRole("textbox", { name: "Search players" }), {
      target: { value: "Aaron" },
    });

    expect(screen.getByText("Aaron Judge")).toBeInTheDocument();
    expect(screen.queryByText("Paul Skenes")).not.toBeInTheDocument();
    expect(screen.getByText("Showing 1 of 3 players")).toBeInTheDocument();
  });

  it("filters players by team", async () => {
    mockFetchSuccess();

    render(<Home />);

    await screen.findByText("Aaron Judge");

    fireEvent.change(screen.getByRole("textbox", { name: "Search players" }), {
      target: { value: "Pittsburgh" },
    });

    expect(screen.getByText("Paul Skenes")).toBeInTheDocument();
    expect(screen.queryByText("Aaron Judge")).not.toBeInTheDocument();
  });

  it("searches without being case-sensitive", async () => {
    mockFetchSuccess();

    render(<Home />);

    await screen.findByText("Aaron Judge");

    fireEvent.change(screen.getByRole("textbox", { name: "Search players" }), {
      target: { value: "aArOn jUdGe" },
    });

    expect(screen.getByText("Aaron Judge")).toBeInTheDocument();
    expect(screen.queryByText("Paul Skenes")).not.toBeInTheDocument();
  });

  it("trims whitespace from the search term", async () => {
    mockFetchSuccess();

    render(<Home />);

    await screen.findByText("Aaron Judge");

    fireEvent.change(screen.getByRole("textbox", { name: "Search players" }), {
      target: { value: "  Aaron Judge  " },
    });

    expect(screen.getByText("Aaron Judge")).toBeInTheDocument();
    expect(screen.queryByText("Paul Skenes")).not.toBeInTheDocument();
  });

  // 4. Team and position filters

  it("filters players by team", async () => {
    mockFetchSuccess();

    render(<Home />);

    await screen.findByText("Aaron Judge");

    fireEvent.change(screen.getByRole("combobox", { name: "Filter by team" }), {
      target: { value: "Pittsburgh Pirates" },
    });

    expect(screen.getByText("Paul Skenes")).toBeInTheDocument();
    expect(screen.queryByText("Aaron Judge")).not.toBeInTheDocument();
  });

  it("filters players by position", async () => {
    mockFetchSuccess();

    render(<Home />);

    await screen.findByText("Aaron Judge");

    fireEvent.change(
      screen.getByRole("combobox", { name: "Filter by position" }),
      { target: { value: "P" } }
    );

    expect(screen.getByText("Paul Skenes")).toBeInTheDocument();
    expect(screen.queryByText("Aaron Judge")).not.toBeInTheDocument();
  });

  it("combines search, team, and position filters", async () => {
    mockFetchSuccess();

    render(<Home />);

    await screen.findByText("Aaron Judge");

    fireEvent.change(screen.getByRole("textbox", { name: "Search players" }), {
      target: { value: "Los Angeles" },
    });

    fireEvent.change(screen.getByRole("combobox", { name: "Filter by team" }), {
      target: { value: "Los Angeles Dodgers" },
    });

    fireEvent.change(
      screen.getByRole("combobox", { name: "Filter by position" }),
      { target: { value: "DH" } }
    );

    expect(screen.getByText("Shohei Ohtani")).toBeInTheDocument();
    expect(screen.queryByText("Aaron Judge")).not.toBeInTheDocument();
    expect(screen.queryByText("Paul Skenes")).not.toBeInTheDocument();
  });

  it("resets search and filters", async () => {
    mockFetchSuccess();

    render(<Home />);

    await screen.findByText("Aaron Judge");

    fireEvent.change(screen.getByRole("textbox", { name: "Search players" }), {
      target: { value: "Aaron" },
    });

    fireEvent.change(screen.getByRole("combobox", { name: "Filter by team" }), {
      target: { value: "New York Yankees" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Reset Filters" }));

    expect(await screen.findByText("Aaron Judge")).toBeInTheDocument();
    expect(screen.getByText("Paul Skenes")).toBeInTheDocument();
    expect(screen.getByText("Shohei Ohtani")).toBeInTheDocument();

    expect(screen.getByRole("textbox", { name: "Search players" }))
      .toHaveValue("");
  });

  // 5. View switching

  it("displays Card View by default", async () => {
    mockFetchSuccess();

    render(<Home />);

    expect(await screen.findByTestId("player-grid")).toBeInTheDocument();
    expect(screen.queryByTestId("player-table")).not.toBeInTheDocument();
  });

  it("switches to Table View when the button is clicked", async () => {
    mockFetchSuccess();

    render(<Home />);

    await screen.findByTestId("player-grid");

    fireEvent.click(screen.getByRole("button", { name: "Table View" }));

    expect(screen.getByTestId("player-table")).toBeInTheDocument();
    expect(screen.queryByTestId("player-grid")).not.toBeInTheDocument();
  });

  it("switches back to Card View", async () => {
    mockFetchSuccess();

    render(<Home />);

    await screen.findByTestId("player-grid");

    fireEvent.click(screen.getByRole("button", { name: "Table View" }));
    fireEvent.click(screen.getByRole("button", { name: "Card View" }));

    expect(screen.getByTestId("player-grid")).toBeInTheDocument();
    expect(screen.queryByTestId("player-table")).not.toBeInTheDocument();
  });

  // 6. Adding players

  it("refreshes the player list after a player is added", async () => {
    mockFetchSuccess();

    render(<Home />);

    await screen.findByText("Aaron Judge");

    fireEvent.click(
      screen.getByRole("button", { name: "Simulate Player Added" })
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  // 7. Editing players

  it("opens the edit form when a player's Edit button is clicked", async () => {
    mockFetchSuccess();

    render(<Home />);

    await screen.findByText("Aaron Judge");

    fireEvent.click(screen.getByRole("button", { name: "Edit Aaron Judge" }));

    expect(screen.getByTestId("edit-player-form")).toBeInTheDocument();
    expect(screen.getByText("Editing Aaron Judge")).toBeInTheDocument();
  });

  it("closes the edit form when Cancel is clicked", async () => {
    mockFetchSuccess();

    render(<Home />);

    await screen.findByText("Aaron Judge");

    fireEvent.click(screen.getByRole("button", { name: "Edit Aaron Judge" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel Edit" }));

    expect(screen.queryByTestId("edit-player-form")).not.toBeInTheDocument();
  });

  it("closes the edit form and refreshes players after an update", async () => {
    mockFetchSuccess();

    render(<Home />);

    await screen.findByText("Aaron Judge");

    fireEvent.click(screen.getByRole("button", { name: "Edit Aaron Judge" }));
    fireEvent.click(screen.getByRole("button", { name: "Save Edit" }));

    expect(screen.queryByTestId("edit-player-form")).not.toBeInTheDocument();

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  // 8. Deleting players

  it("deletes a player when deletion is confirmed", async () => {
    mockFetchSuccess();

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(testPlayers),
      } as Response)
      .mockResolvedValueOnce({ ok: true } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(testPlayers.slice(1)),
      } as Response);

    render(<Home />);

    await screen.findByText("Aaron Judge");

    fireEvent.click(screen.getByRole("button", { name: "Delete Aaron Judge" }));

    await waitFor(() => {
      expect(fetch).toHaveBeenNthCalledWith(
        2,
        "http://localhost:8080/api/players/1",
        { method: "DELETE" }
      );
    });

    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to delete Aaron Judge?"
    );
  });

  it("does not delete a player when deletion is cancelled", async () => {
    mockFetchSuccess();

    vi.mocked(window.confirm).mockReturnValue(false);

    render(<Home />);

    await screen.findByText("Aaron Judge");

    fireEvent.click(screen.getByRole("button", { name: "Delete Aaron Judge" }));

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("displays an error when deleting a player fails", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(testPlayers),
      } as Response)
      .mockResolvedValueOnce({ ok: false } as Response);

    render(<Home />);

    await screen.findByText("Aaron Judge");

    fireEvent.click(screen.getByRole("button", { name: "Delete Aaron Judge" }));

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent("Failed to delete player. Please try again.");
  });
});
