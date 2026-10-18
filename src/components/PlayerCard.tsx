import type { Player } from "../types/player";
import { Link } from "react-router-dom";

interface PlayerCardProps {
    player: Player;
    onEdit: (player: Player) => void;
}

 export default function PlayerCard({ player, onEdit }: PlayerCardProps) {

    return (
        <div className="w-full max-w-72">
            <Link to={`player/${player.id}`}>
                <div className='w-full max-w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl border'>
                    <img src='src/assets/player_placeholder.jpg' alt='Player Name (placeholder)' className='h-80 w-72 object-cover rounded-t-xl'></img>
                    <div className='px-4 py-3 w-72'>
                        <span className='text-gray-500 mr-3 uppercase text-xs'>{player.team}</span>
                        <p className='text-lg font-bold text-black truncate block capitalize'>{player.name}</p>
                        <div className='flex items-center'>
                            {/* <p className='text-base text-gray-400 justify-end-safe'>{player.era}</p> */}
                            <p className='text-base text-gray-400 justify-end-safe'>{player.position === "P" ? player.era ?? "N/A" : player.battingAvg ?? "N/A"}</p>
                        </div>
                    </div>
                </div>
            </Link>
            <button
                type="button"
                onClick={() => onEdit(player)}
                className="mt-2 w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                Edit
            </button>
        </div>

        
        
    );    
}