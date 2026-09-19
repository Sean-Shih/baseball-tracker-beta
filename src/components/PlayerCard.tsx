import type { Player } from "../types/player";

interface PLayerCardProops {
    player: Player;
}

 export default function PlayerCard({ player }: PLayerCardProops) {

    if (player.position == "P") {
        return (
            <div className='w-full max-w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl border'>
                <a href='#'>
                    <img src='src/assets/player_placeholder.jpg' alt='Player Name (placeholder)' className='h-80 w-72 object-cover rounded-t-xl'></img>
                    <div className='px-4 py-3 w-72'>
                        <span className='text-gray-500 mr-3 uppercase text-xs'>{player.team}</span>
                        <p className='text-lg font-bold text-black truncate block capitalize'>{player.name}</p>
                        <div className='flex items-center'>
                            <p className='text-base text-gray-400 justify-end-safe'>{player.era}</p>
                        </div>
                    </div>
                </a>
            </div>
        );
    } else {
        return (
            <div className='w-full max-w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl border'>
                <a href='#'>
                    <img src='src/assets/player_placeholder.jpg' alt='Player Name (placeholder)' className='h-80 w-72 object-cover rounded-t-xl'></img>
                    <div className='px-4 py-3 w-72'>
                        <span className='text-gray-500 mr-3 uppercase text-xs'>{player.team}</span>
                        <p className='text-lg font-bold text-black truncate block capitalize'>{player.name}</p>
                        <div className='flex items-center'>
                            <p className='text-base text-gray-400'>{player.battingAvg}</p>
                        </div>
                    </div>
                </a>
            </div>
        );
    }
    
}