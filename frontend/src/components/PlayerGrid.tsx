import type { Player } from "../types/player";
import PlayerCard from "./PlayerCard";

interface PlayerGridProps {
    players: Player[];
    onEdit: (player: Player) => void;
    onDelete: (player: Player) => void;
    isDeleting: boolean;
}

export default function PlayerGrid( {players, onEdit, onDelete, isDeleting }: PlayerGridProps) {

    return (
        <div id='playerCards' 
        className='w-fit grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4 justify-items-center justify-center gap-y-17 gap-x-18.5 mt-10 mb-5 mx-auto'>
            {players.map((player =>
                <PlayerCard 
                    key={player.id}
                    player={player}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isDeleting={isDeleting}
                />
            ))}
        </div>
    );
}