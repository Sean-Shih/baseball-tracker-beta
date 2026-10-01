import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import PlayerGrid from "../components/PlayerGrid";
import type { Player } from "../types/player";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
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
  }, []);

  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <PlayerGrid players={filteredPlayers} />
    </>
  );
}

export default Home;