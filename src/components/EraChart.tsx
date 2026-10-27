import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { Player } from "../types/player";


interface EraChartProps {
    players: Player[];
}

export default function EraChart({
    players
}: EraChartProps) {

    const chartData = players.filter((player) => 
        player.position === "P" && player.era != null && 
        player.era.trim() !== "" && Number.isFinite(Number(player.era))
    ).map((player) => ({
        name: player.name,
        era: Number(player.era),
    })).sort(
        (a, b) => b.era - a.era
    );

    if (chartData.length == 0) {
        return (
            <p className="text-gray-500">
                No ERA data available
            </p>
        );  
    }

    return (
        <section className="rounded-xl bg-white p-4 shadow-sm mx-6">
            <h2 className="mb-4 text-xl font-semibold">
                Pitcher ERA Comparison
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

                        <YAxis domain={[0, "auto"]} />

                        <Tooltip 
                            formatter={(value) => Number(value).toFixed(2)}
                        />

                        <Bar dataKey="era" name="ERA"/>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}