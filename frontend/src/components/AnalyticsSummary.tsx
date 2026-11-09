import type { Player } from "../types/player";

import {
    calculateAverageBattingAverage,
    calculateAverageObp,
    calculateAverageSlugging,
    calculateAverageOps,
    calculateAverageEra,
    getBattingAverageLeaders,
    getObpLeaders,
    getSluggingLeaders,
    getOpsLeaders,
    getEraLeaders,
} from "../utils/playerAnalytics"

interface AnalyticsSummaryProps {
    players: Player[];
}

export default function AnalyticsSummary({
    players
}: AnalyticsSummaryProps) {

    const totalPlayers = players.length;

    const totalPitchers = players.filter((player) => player.position === "P").length;

    const totalPositionPlayers = totalPlayers - totalPitchers;

    const averageAVG = calculateAverageBattingAverage(players);
    const averageOBP = calculateAverageObp(players);
    const averageSLG = calculateAverageSlugging(players);
    const averageOPS = calculateAverageOps(players);
    const averageERA = calculateAverageEra(players);


    const avgLeaders = getBattingAverageLeaders(players);
    const obpLeaders = getObpLeaders(players);
    const slgLeaders = getSluggingLeaders(players);
    const opsLeaders = getOpsLeaders(players);
    const eraLeaders = getEraLeaders(players);

    const formatBattingStat = (value: number | null) => value === null ? "N/A" : value.toFixed(3);
    const formatEra = (value: number | null) => value === null ? "N/A" : value.toFixed(2);

    return (

        <section className="my-8 mx-6 space-y-6">
            <h2 className="text-2xl font-bold">
                Roster Analytics
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <SummaryCard 
                    label="Total Players"
                    value={totalPlayers.toString()}
                />

                <SummaryCard 
                    label="Pitchers"
                    value={totalPitchers.toString()}
                />

                <SummaryCard 
                    label="Position Players"
                    value={totalPositionPlayers.toString()}
                />
            </div>

            <div>
                <h3 className="mb-3 text-xl font-semibold">
                    Offensive Statistic Averages
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <SummaryCard 
                        label="Average Batting Average"
                        value={formatBattingStat(averageAVG)}
                    />

                    <SummaryCard 
                        label="Average On-Base Percentage"
                        value={formatBattingStat(averageOBP)}
                    />

                    <SummaryCard 
                        label="Average Slugging Percentage"
                        value={formatBattingStat(averageSLG)}
                    />

                    <SummaryCard 
                        label="Average On-Base + Slugging Percentage"
                        value={formatBattingStat(averageOPS)}
                    />
                </div>
            </div>

            <div>
                <h3 className="mb-3 text-xl font-semibold">
                    Pitching Statistics
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <SummaryCard 
                        label="Average ERA"
                        value={formatEra(averageERA)}
                    />
                </div>
            </div>


            <div>
                <h3 className="mb-3 text-xl font-semibold">
                    Statistical Leaders
                </h3>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <LeaderCard 
                        title="Highest AVG"
                        players={avgLeaders}
                        getValue={(player) => player.battingAvg}
                        formatValue={formatBattingStat}
                        emptyMessage="No valid Batting Averages available"
                    />

                    <LeaderCard 
                        title="Highest OBP"
                        players={obpLeaders}
                        getValue={(player) => player.obp}
                        formatValue={formatBattingStat}
                        emptyMessage="No valid OBP available"
                    />

                    <LeaderCard 
                        title="Highest SLG"
                        players={slgLeaders}
                        getValue={(player) => player.slugging}
                        formatValue={formatBattingStat}
                        emptyMessage="No valid SLG available"
                    />

                    <LeaderCard 
                        title="Highest OPS"
                        players={opsLeaders}
                        getValue={(player) => player.ops ?? (player.obp != null && player.slugging != null ? player.obp + player.slugging : null)}
                        formatValue={formatBattingStat}
                        emptyMessage="No valid OPS available"
                    />

                    <LeaderCard 
                        title="Lowest ERA"
                        players={eraLeaders}
                        getValue={(player) => player.era}
                        formatValue={formatEra}
                        emptyMessage="No valid ERA available"
                    />
                </div>
            </div>
        </section>
    );
}

interface SummaryCardProps {
    label: string;
    value: string;
}

function SummaryCard({ label, value }: SummaryCardProps) {
    return (
        <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>
    );
}

interface LeaderCardProps {
    title: string;
    players: Player[];
    getValue: (player: Player) => number | null;
    formatValue: (value: number | null) => string;
    emptyMessage: string;
}

function LeaderCard({ title, players, getValue, formatValue, emptyMessage }: LeaderCardProps) {
    return (
        <div className="rounded-xl bg-white p-5 shadow-sm">
            <h4 className="mb-3 text-lg font-semibold">
                {title}
            </h4>

            {players.length === 0 ? (
                <p className="text-gray-500">{emptyMessage}</p>
            ) : (
                players.map((player) => (
                    <p key={player.id}>
                        {player.name} - {formatValue(getValue(player))}
                    </p>
                ))
            )}
        </div>
    );
}