interface PlayerFiltersProps {
    teams: string[];
    positions: string[];
    selectedTeam: string;
    selectedPosition: string;
    onTeamChange: (team: string) => void;
    onPositionChange: (position: string) => void;
    onReset: () => void;
}

export default function PlayerFilters({
    teams,
    positions,
    selectedTeam,
    selectedPosition,
    onTeamChange,
    onPositionChange,
    onReset,
}: PlayerFiltersProps) {
    return (
        <div className=" flex flex-wrap items-end gap-4 mx-8 ">
            <div className="flex flex-col gap-1">
                <label htmlFor="team-filter">
                    Team
                </label>

                <select
                    id="team-filter"
                    value={selectedTeam}
                    onChange={(event) =>
                        onTeamChange(event.target.value)
                    }
                    className="rounded-lg border px-3 py-2"
                >
                    {teams.map((team) => (
                        <option key={team} value={team}>
                            {team}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="position-filter">
                    Position
                </label>

                <select
                    id="position-filter"
                    value={selectedPosition}
                    onChange={(event) =>
                        onPositionChange(event.target.value)
                    }
                    className="rounded-lg border px-3 py-2"
                >
                    {positions.map((position) => (
                        <option
                            key={position}
                            value={position}
                        >
                            {position === "All"
                                ? "All positions"
                                : position}
                        </option>
                    ))}
                </select>
            </div>

            <button
                type="button"
                onClick={onReset}
                className="rounded-lg border px-4 py-2 hover:bg-gray-100"
            >
                Clear filters
            </button>
        </div>
    );
}