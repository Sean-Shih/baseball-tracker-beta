import { use, useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import PlayerGrid from "../components/PlayerGrid";
import type { Player } from "../types/player";
import AddPlayerForm from "../components/AddPlayerForm";
import EditPlayerForm from "../components/EditPlayerForm";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  const fetchPlayers = () => {
    fetch("http://localhost:8080/api/players")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch players");
        }

        return response.json();
      })
      .then((data) => {
        setPlayers(data);
      })
      .catch((error) => {
        console.error("Error fetching players:", error);
      });
  };

  const handlePlayerAdded = () => {
    fetchPlayers();
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditPlayer = (player : Player) => {
    setEditingPlayer(player);
  };

  return (
    <>
      <SearchBar onSearch={setSearchTerm} />

      <div className="text-center p-10 pt-6">
        <h1 className="font-bold text-4xl mb-4">
          MLB Player Tracker
        </h1>

        <h2 className="text-2xl">
          Track your favourite players
        </h2>
      </div>

      
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
    
    

      <PlayerGrid 
        players={filteredPlayers} 
        onEdit={handleEditPlayer}
      />
      <AddPlayerForm onPlayerAdded={handlePlayerAdded}/>
    </>
  );
}

export default Home;