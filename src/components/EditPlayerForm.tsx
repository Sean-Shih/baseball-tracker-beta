import { useState } from "react";
import type { FormEvent } from "react";
import type { Player } from "../types/player";
// import { eventLoopUtilization } from "perf_hooks";
// import { PrefetchPageLinks } from "react-router-dom";

interface EditPlayerFormProps {
    player: Player;
    onPlayerUpdated: () => void;
    onCancel: () => void;
}

export default function EditPlayerForm({
    player,
    onPlayerUpdated,
    onCancel
}: EditPlayerFormProps) {
    
    const [name, setName] = useState(player.name);
    const [team, setTeam] = useState(player.team);
    const [position, setPosition] = useState(player.position);
    const [battingAvg, setBattingAvg] = useState(player.battingAvg ?? "");
    const [era, setEra] = useState(player.era ?? "");

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setIsSubmitting(true);
        setSuccessMessage("");
        setErrorMessage("");

        const playerData = {
            name,
            team,
            position,
            battingAvg,
            era: era || null
        };

        fetch(`http://localhost:8080/api/players/${player.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(playerData)
        }).then((response) =>  {
            if (!response.ok) throw new Error("Failed to update player");

            return response.json();
        }).then((data) => {
            console.log("Player updated successfully:", data);
            setSuccessMessage("Player updated successfully!");
            onPlayerUpdated();
        }).catch((error) => {
            console.log("Error updating player:", error)

            // setIsSubmitting(false);
            setErrorMessage("Failed to update player. Please try again.");
        }).finally(()=> {
            setIsSubmitting(false);
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mb-6 rounded-xl border bg-white p-6 shadow-md"
        >
            <h2 className="mb-4 text-xl font-bold">Edit Player</h2>

            {successMessage && (
                <p className="mb-3 text-green-600">{successMessage}</p>
            )}

            {errorMessage && (
                <p className="mb-3 text-red-600">{errorMessage}</p>
            )}

            <div className="mb-3">
                <label htmlFor="edit-name">Name</label>
                <input 
                    id="edit-name"
                    className="block w-full rounded border p-2"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                />
            </div>

            <div className="mb-3">
                <label htmlFor="edit-team">Team</label>
                <input 
                    id="edit-team"
                    className="block w-full rounded border p-2"
                    value={team}
                    onChange={(event) => setTeam(event.target.value)}
                    required
                />
            </div>

            <div className="mb-3">
                <label htmlFor="position">Add Position</label>
                <select
                    id="edit-position"
                    value={position}
                    className="block w-full rounded border p-2"
                    onChange={(event) => setPosition(event.target.value)}
                    required
                >
                    <option value="P">Pitcher</option>
                    <option value="C">Catcher</option>
                    <option value="1B">First Baseman</option>
                    <option value="2B">Second Baseman</option>
                    <option value="3B">Third Baseman</option>
                    <option value="SS">Shortstop</option>
                    <option value="LF">Left Fielder</option>
                    <option value="CF">Center Fielder</option>
                    <option value="RF">Right Fielder</option>
                    <option value="DH">Designated Hitter</option>
                </select>
            </div>

            <div className="mb-3">
                <label htmlFor="edit-battingAvg">Add Batting Average</label>
                <input
                    id="edit-battingAvg"
                    value={battingAvg}
                    className="block w-full rounded border p-2"
                    onChange={(event) => setBattingAvg(event.target.value)}
                    placeholder="Enter Batting Average"
                    type="number"
                    min={0}
                    max={1}
                    step={0.001}
                />
            </div>

            <div className="mb-4">
                <label htmlFor="edit-era">ERA</label>
                <input
                    id="edit-era"
                    type="number"
                    min="0"
                    step="0.01"
                    className="block w-full rounded border p-2"
                    value={era}
                    onChange={(event) => setEra(event.target.value)}
                />
            </div>

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded border px-4 py-2"
                >
                    Cancel
                </button>
            </div>
        </form>
    );

}