import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { Player } from "../types/player";
import { useState } from "react";


interface OffensiveStatsProps {
    players: Player[];
}

type OffensiveStat = "battingAvg" | "obp" | "slugging" | "ops";

const statOptions: { value: OffensiveStat; label: string }[] = [
    { value: "battingAvg", label: "Batting Average (AVG)" },
    { value: "obp", label: "On-Base Percentage (OBP)" },
    { value: "slugging", label: "Slugging Percentage (SLG)" },
    { value: "ops", label: "On-base Plus Slugging (OPS)" },
];

export default function OffensiveStatsChart({
    players
}: OffensiveStatsProps) {

    const [selectedStat, setSelectedStat] = useState<OffensiveStat>("battingAvg");

    const selectedLabel = statOptions.find((option) => option.value === selectedStat)?.label ?? "";

    const chartData = players.filter((player) => player.position !== "P").filter((player) => {
        const value = player[selectedStat];
        return value != null && Number.isFinite(value);
    }).map((player) => ({
        name: player.name,
        value: player[selectedStat] as number,
    })).sort(
        (a, b) => b.value - a.value);

    if (chartData.length === 0) {
        return(
            <section className="rounded-xl bg-white p-4 shadow-sm mx-6">

                <h2 className="mb-4 text-xl font-semibold">
                    Offensive Stats Comparison
                </h2>

                <select
                    aria-label="Select offensive statistic"
                    value={selectedStat}
                    onChange={(event) => setSelectedStat(event.target.value as OffensiveStat)}
                >
                    {statOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                
                <p className="mb-2 text-sm text-gray-500">
                    No {selectedLabel} data available
                </p>
            </section>
        );
    }

    return (
        <section className="rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">
                    Offensive Statistics Comparison
                </h2>

                <select
                    aria-label="Select offensive statistic"
                    value={selectedStat}
                    onChange={(event) => setSelectedStat(event.target.value as OffensiveStat)}
                    className="rounded-lg border border-gray-300 p-2"
                > 
                    {statOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <p className="mb-2 text-sm text-gray-500">
                Comparing {selectedLabel}
            </p>

            <div className="h-80 w-full">
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3"/>

                        <XAxis 
                            dataKey="name"
                            interval={0}
                            angle={-20}
                            textAnchor="end"
                            height={80}
                        />

                        <YAxis domain={[0, "auto"]} />

                        <Tooltip 
                            formatter={(value) => Number(value).toFixed(3)}
                        />

                        <Bar dataKey="value" name={selectedStat.toUpperCase()}/>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}