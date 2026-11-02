import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { Player } from "../types/player";


interface BattingAvgChartProps {
    players: Player[];
}

export default function BattingAvgChart({
    players
}: BattingAvgChartProps) {

    const chartData = players.filter((player) => 
        player.position !== "P" && player.battingAvg != null && 
        player.battingAvg.trim() !== "" && Number.isFinite(Number(player.battingAvg))
    ).map((player) => ({
        name: player.name,
        battingAverage: Number(player.battingAvg),
    })).sort(
        (a, b) => b.battingAverage - a.battingAverage
    );

    if (chartData.length == 0) {
        return (
            <p className="text-gray-500">
                No batting average data available
            </p>
        );  
    }

    return (
        <section className="rounded-xl bg-white p-4 shadow-sm mx-6">
            <h2 className="mb-4 text-xl font-semibold">
                Batting Average Comparison
            </h2>

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

                        <YAxis domain={[0, 0.4]} />

                        <Tooltip 
                            formatter={(value) => Number(value).toFixed(3)}
                        />

                        <Bar dataKey="battingAverage" name="Batting Average"/>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}