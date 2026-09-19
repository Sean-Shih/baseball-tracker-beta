import { players } from "../data/players";
import type { Player } from "../types/player";
import PlayerCard from "./PlayerCard";

interface PlayerGridProps {
    players: Player[];
}

export default function PlayerGrid( {players }: PlayerGridProps) {

    return (
        <div id='playerCards' 
        className='w-fit mx-auto grid grid-cols-2 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5'>
            {/* {players.map((player) => (
                <PlayerCard 
                    key={player.id}
                    player={player}
                />
            ))} */}
            {players.map((player =>
                <PlayerCard 
                    key={player.id}
                    player={player}
                />
            ))}
        </div>
    );
}