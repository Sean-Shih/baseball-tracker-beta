import type { Player } from "../types/player";

import {
    calculateAverageBattingAverage,
    calculateAverageEra,
    getBattingAverageLeaders,
    getEraLeaders,
} from "../utils/playerAnalytics"

interface AnalyticsSummaryProps {
    players: Player[];
}

export default function AnalyticsSummary({
    players
}: AnalyticsSummaryProps) {

    const averageAVG = calculateAverageBattingAverage(players);

    const averageEra = calculateAverageEra(players);

    const battingLeaders = getBattingAverageLeaders(players);
    const eraLeaders = getEraLeaders(players);

    return (
        <section className="my-8 space-y-6 mx-6">
            <h2 className="text-2xl font-bold">
                Roster Analytics
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Average Batting Average
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                        {averageAVG === null ? "N/A" : averageAVG.toFixed(3)}
                    </p>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Average Pitcher ERA
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                        {averageEra === null ? "N/A" : averageEra.toFixed(2)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <h3 className="mb-3 text-lg font-semibold">
                        Batting Average Leader
                    </h3>

                    {battingLeaders.length === 0 ? (
                        <p className="text-gray-500">
                            No valid batting averages available.
                        </p>
                    ) : (
                        battingLeaders.map((player) => (
                            <p key={player.id}>
                                {player.name} -{" "}
                                {Number(player.battingAvg).toFixed(3)}
                            </p>
                        ))
                    )}
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <h3 className="mb-3 text-lg font-semibold">
                        Lowest ERA Leader
                    </h3>

                    {eraLeaders.length === 0 ? (
                        <p className="text-gray-500">
                            No valid pitcher ERAs available.
                        </p>
                    ) : (
                        eraLeaders.map((player) => (
                            <p key={player.id}>
                                {player.name} -{" "}
                                {Number(player.era).toFixed(2)}
                            </p>
                        ))
                    )}
                </div>
            </div>  
        </section>
    );
}