import { use, useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import PlayerGrid from "../components/PlayerGrid";
import type { Player } from "../types/player";
import AddPlayerForm from "../components/AddPlayerForm";
import EditPlayerForm from "../components/EditPlayerForm";
import PlayerTable from "../components/PlayerTable";
import PlayerFilters from "../components/PlayerFilters";

import BattingAverageChart from "../components/BattingAverageChart";
import EraChart from "../components/EraChart";

import AnalyticsSummary from "../components/AnalyticsSummary";

function Home() {

  const [searchTerm, setSearchTerm] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const [selectedTeam, setSelectedTeam] = useState("All");

  const [selectedPosition, setSelectedPosition] = useState("All");

  const teams = [
    "All",
    ...new Set(players.map((player) => player.team)),
  ];

  const positions = [
      "All",
      ...new Set(players.map((player) => player.position)),
  ];

  const totalPlayers = players.length;

  const totalPitchers = players.filter(
    (player) => player.position === "P"
  ).length;

  const totalPositionPlayers = totalPlayers - totalPitchers;

  // const fetchPlayers = async () => {

  //   setIsLoading(true);
  //   setFetchError("");

  //   try {
  //     const response = await fetch(
  //       "http://localhost:8080/api/players"
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch players.")
  //     }

  //     const data: Player[] = await response.json();
  //     setPlayers(data)
  //   } catch (error) {
  //     console.error("Error fetching players:", error)

  //     setFetchError(
  //       "Unable to load players. Please try again."
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchPlayers = () => {
    setIsLoading(true);
    setFetchError("");

    fetch("http://localhost:8080/api/players")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch players");

        return response.json();
      })
      .then((data: Player[]) => {
        setPlayers(data);
      })
      .catch((error) =>  {
        console.error("Error fetching players:", error);
        setFetchError("Unable to load players, please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handlePlayerAdded = () => {
    fetchPlayers();
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  // const filteredPlayers = players.filter(
  //   (player) =>
  //     player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     player.team.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const filteredPlayers = players.filter((player) => {
    const query = searchTerm.trim().toLowerCase();

    const matchesSearch =
      player.name.toLowerCase().includes(query) ||
      player.team.toLowerCase().includes(query);

    const matchesTeam =
      selectedTeam === "All" ||
      player.team === selectedTeam;

    const matchesPosition =
      selectedPosition === "All" ||
      player.position === selectedPosition;

    return matchesSearch && matchesTeam && matchesPosition;
  });

  const handleEditPlayer = (player : Player) => {
    setEditingPlayer(player);
  };

  const handleDeletePlayer = (player: Player) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${player.name}?`);

    if (!confirmed) return;
    
    setIsDeleting(true);
    setDeleteError("");

    fetch(`http://localhost:8080/api/players/${player.id}`, {
      method: "DELETE"
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete player");
      }

      fetchPlayers();
    }).catch((error) => {
      console.error("Error deleting player:", error);
      setDeleteError("Failed to delete player. Please try again.")
    }).finally(() => {
      setIsDeleting(false);
    });
  };

  return (
    <div className="bg-gray-100">
      

      <div className="text-center p-10 pt-6">
        <h1 className="font-bold text-4xl mb-4">
          MLB Player Tracker
        </h1>

        <h2 className="text-2xl">
          Track your favourite players
        </h2>
      </div>


      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SearchBar onSearch={setSearchTerm} />
        
        {editingPlayer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blend-darken backdrop-contrast-50">
            <EditPlayerForm
              key={editingPlayer.id}
              player={editingPlayer}
              onPlayerUpdated={() => {
                setEditingPlayer(null);
                fetchPlayers();
              }}  
              onCancel={() => setEditingPlayer(null)}
            />
          </div>
        )}
      
        {deleteError && (
          <p role="alert" className="mb-4 text-red-600">
            {deleteError}
          </p>
        )}

        
        {!isLoading && !fetchError && (
          <div className="mx-auto mb-6 flex max-w-7xl flex-wrap items-end gap-4 px-6">
            <div className="inline-flex rounded-lg bg-gray-200 p-1">
              {(["cards", "table"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
                    viewMode === mode ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {mode === "cards" ? "Card View" : "Table View"}
                </button>
              ))}
            </div>
            <PlayerFilters 
              teams={teams}
              positions={positions}
              selectedTeam={selectedTeam}
              selectedPosition={selectedPosition}
              onTeamChange={setSelectedTeam}
              onPositionChange={setSelectedPosition}
              onReset={() => {
                setSearchTerm("");
                setSelectedTeam("All");
                setSelectedPosition("All");
              }}
            />

            <p className="ml-auto pb-2 text-sm text-gray-500">
              Showing {filteredPlayers.length} of {players.length} players
            </p>
          </div>
        )}
      </div>

      {isLoading ? (
        <p className="text-center py-8" role="status">
          Loading players...
        </p>
      ): fetchError ? (
        <div className="text-center py-8">
          <p className="text-red-600 mb-3" role="alert">
            {fetchError}
          </p>

          <button
            type="button"
            onClick={fetchPlayers}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
        ) : filteredPlayers.length === 0  ? (
          <div className="py-12 text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              No players found
            </h2>
            <p className="mt-2 text-gray-500">
              Try a different player or team
            </p>
          </div>
          
        ) : (
          <div>

            {viewMode === "cards" ? (
              <PlayerGrid 
                players={filteredPlayers}
                onEdit={handleEditPlayer}
                onDelete={handleDeletePlayer}
              />
            ) : (
              <PlayerTable 
                players={filteredPlayers}
                onEdit={handleEditPlayer}
                onDelete={handleDeletePlayer}
              />
            )}

            <AnalyticsSummary players={players}/>

            <div className="my-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
              <BattingAverageChart players={players} />

              <EraChart players={players} />
            </div>
          </div>
        )}
      <AddPlayerForm onPlayerAdded={handlePlayerAdded}/>
    </div>
  );
}

export default Home;