import type { Player } from "../types/player";
import PlayerCard from "./PlayerCard";

interface PlayerGridProps {
    players: Player[];
    onEdit: (player: Player) => void;
    onDelete: (player: Player) => void;
}

export default function PlayerGrid( {players, onEdit, onDelete }: PlayerGridProps) {

    return (
        <div id='playerCards' 
        className='w-fit grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4 justify-items-center justify-center gap-y-15 gap-x-16.5 mt-10 mb-5 mx-auto'>
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
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}