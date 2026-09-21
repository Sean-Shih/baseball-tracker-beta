import { players } from "../data/players";
import { Link, useParams } from "react-router-dom"
// interface PlayerDetailsProps {
//     player: Player;
// }

export default function PlayerDetails() { // { player }: PlayerDetailsProps

    const { id } = useParams();

    const player = players.find((player) => player.id === Number(id))

    if (!player) {
        return (
            <div className="min-h-screen flex items-center justify-items-center">
                <h1>Player not Found</h1>;
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 px-6 py-8">
            <Link
                to={"/"}
                className="inline-block mb-6 text-blue-600 hover:text-blue-800 font-medium"
            >
                Back to Players
            </Link>
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/3">
                        <img 
                            src='src/assets/player_placeholder.jpg' 
                            alt='Player Name (placeholder)' 
                            className='w-full h-80 md:h-full object-cover'
                        />
                    </div>
                    <div className="p-8 md:w-2/3">
                        <span className="text-sm uppercase tracking-wide text-gray-500">
                            {player.position}
                        </span>
                        <h1 className="text-4xl font-bold text-gray-900 mt-2">
                            {player.name}
                        </h1>
                        <p className="text-lg text-gray-600 mt-2">
                            {player.team}
                        </p>
                        <div className="mt-8">
                            <p className="text-sm text-gray-500 uppercase tracking-wide">
                                {player.position === "P" ? "ERA" : "Batting Line"}
                            </p>
                            <p className="text-4xl font-bold text-gray-900 mt-1">
                                {player.position === "P" ? player.era : player.battingAvg}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-5xl mx-auto mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Statistics</h2>
                <div className="grid gird-cols-1 md:grid-cols-3 gap-4">
                    <p className="bg-white rounded-xl shadow-sm p-6">Team</p>
                    <p className="text-lg font-semibold mt-1">{player.team}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <p className="text-sm text-gray-500">Position</p>
                    <p className="text-lg font-semibold mt-1">
                    {player.position}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <p className="text-sm text-gray-500">Player ID</p>
                    <p className="text-lg font-semibold mt-1">
                    {player.id}
                    </p>
                </div>
            </div>
        </div>
    )
}