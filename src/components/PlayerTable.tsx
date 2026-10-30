import { useState } from "react";
import { Link } from "react-router-dom";
import type { Player } from "../types/player";

interface PlayerTableProps {
    players: Player[];
    onEdit: (player: Player) => void;
    onDelete: (player: Player) => void;
}

type SortKey = 
    | "name"
    | "team"
    | "position"
    | "battingAvg"
    | "era";

type SortDirection = "asc" | "desc";

function getSortValue(
    player: Player,
    key: SortKey
): string | number | null {
    switch (key) {
        case "name":
            return player.name;

        case "team":
            return player.team;

        case "position":
            return player.position;

        case "battingAvg": {
            if (player.position === "P") {
                return null;
            }

            const value = player.battingAvg;

            if (value == null || value.trim() === "") {
                return null;
            }

            const number = Number(value);

            return Number.isFinite(number) ? number : null;
        }

        case "era": {
            if (player.position !== "P") {
                return null;
            }

            const value = player.era;

            if (value == null || value.trim() === "") {
                return null;
            }

            const number = Number(value);

            return Number.isFinite(number) ? number : null;
        }
    }
}

export default function ( { players, onEdit, onDelete }: PlayerTableProps ) {


    const [sortKey, setSortKey] = useState<SortKey>("name");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection((current) => current === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDirection("asc");
        }
    };

    const sortedPlayers = [...players].sort((a, b) => {
        const aValue = getSortValue(a, sortKey);
        const bValue = getSortValue(b, sortKey);

        if (aValue === null && bValue === null) return 0;

        if (aValue === null) return 1;
        if (bValue === null) return -1;

        let comparison: number;

        if (typeof aValue === "number" && typeof bValue === "number") {
            comparison = aValue - bValue;
        } else {
            comparison = String(aValue).localeCompare(String(bValue));
        }

        return sortDirection === "asc" ? comparison : -comparison;
    });

    // sortedArray = players.sort();

    return (
        <div className="w-full overflow-x-auto rounded-xl border-gray-200 px-8 py-3">
            <table className="w-full min-w-[640px] text-left text-sm "> 
                {/* min-w-212.5 min */}
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="px-4 py-3">
                            <button
                                onClick={() => handleSort("name")}
                                className="font-semibold hover:text-blue-700"
                                aria-sort={
                                    sortKey === "name" ? sortDirection === "asc" ? "ascending" : "descending" : "none"
                                }
                            >
                                Player
                                {sortKey === "name" ? sortDirection === "asc" ? "ꜛ" : "ꜜ" : " ↕"}
                            </button>
                        </th>
                        <th className="px-4 py-3">
                            <button
                                onClick={() => handleSort("team")}
                                className="font-semibold hover:text-blue-700"
                                aria-sort={
                                    sortKey === "team" ? sortDirection === "asc" ? "ascending" : "descending" : "none"
                                }
                            >
                                Team
                                {sortKey === "team" ? sortDirection === "asc" ? "ꜛ" : "ꜜ" : " ↕"}
                            </button>
                        </th>
                        <th className="px-4 py-3">
                            <button
                                onClick={() => handleSort("position")}
                                className="font-semibold hover:text-blue-700"
                                aria-sort={
                                    sortKey === "position" ? sortDirection === "asc" ? "ascending" : "descending" : "none"
                                }
                            >
                                Position
                                {sortKey === "position" ? sortDirection === "asc" ? "ꜛ" : "ꜜ" : " ↕"}
                            </button>
                        </th>
                        <th className="px-4 py-3">
                            <button
                                onClick={() => handleSort("battingAvg")}
                                className="font-semibold hover:text-blue-700"
                                aria-sort={
                                    sortKey === "battingAvg" ? sortDirection === "asc" ? "ascending" : "descending" : "none"
                                }
                            >
                                Batting Average
                                {sortKey === "battingAvg" ? sortDirection === "asc" ? "ꜛ" : "ꜜ" : " ↕"}
                            </button>
                        </th>
                        <th className="px-4 py-3">
                            <button
                                onClick={() => handleSort("era")}
                                className="font-semibold hover:text-blue-700"
                                aria-sort={
                                    sortKey === "era" ? sortDirection === "asc" ? "ascending" : "descending" : "none"
                                }
                            >
                                ERA
                                {sortKey === "era" ? sortDirection === "asc" ? "ꜛ" : "ꜜ" : " ↕"}
                            </button>
                        </th>
                        <th className="px-7 py-3 text-left justify-left">Actions</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                    {sortedPlayers.map((player) => (
                        <tr
                            key={player.id}
                            className="hover:bg-gray-50"
                        >
                            <td className="px-4 py-3 font-medium">
                                <Link
                                    to={`/player/${player.id}`}
                                    className="text-blue-700 hover:underline"
                                >
                                    {player.name}
                                </Link>
                            </td>

                            <td className="px-4 py-3">
                                {player.team}
                            </td>

                            <td className="px-4 py-3">
                                {player.position}
                            </td>

                            <td className="px-4 py-3">
                                {player.position === "P" ? "-" : player.battingAvg || "-"}
                            </td>

                            <td className="px-4 py-3">
                                {player.position === "P" ? "-" : player.era || "-"}
                            </td>

                            <td className="px-4 py-3">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onEdit(player)}
                                        className="block w-fit px-3 py-1 text-base font-medium text-gray-500 hover:text-gray-950"
                                    >   
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(player)}
                                        className="block w-fit px-3 py-1 text-base font-medium text-red-500 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>                
            </table>
        </div>
    );
}