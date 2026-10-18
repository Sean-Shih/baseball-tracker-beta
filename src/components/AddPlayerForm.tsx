import React, { useState } from "react";

type AddPlayerFormProps = {
    onPlayerAdded: () => void;
};

export default function AddPlayerForm({ onPlayerAdded }: AddPlayerFormProps) {

    const [name, setName] = useState("")
    const [team, setTeam] = useState("")
    const [position, setPosition] = useState("")
    const [battingAvg, setBattingAvg] = useState("")
    const [era, setEra] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);
        setSuccessMessage("");
        setErrorMessage("");

        const playerData = {
            name, 
            team,
            position,
            battingAvg,
            era: era ? era : null
        };

        fetch("http://localhost:8080/api/players", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(playerData)
        }).then((response) =>  {
            if (!response.ok) throw new Error("Failed to add new player");

            return response.json();
        }).then((data) => {
            console.log("Player added successfully:", data);

            onPlayerAdded();

            // setIsSubmitting(false)
            setSuccessMessage("Player added successfully!");
            setErrorMessage("")

            setName("");
            setTeam("");
            setPosition("");
            setBattingAvg("");
            setEra("");

        }).catch((error) => {
            console.log("Error adding player:", error)

            // setIsSubmitting(false);
            setErrorMessage("Failed to add player. Please try again.");
            setSuccessMessage("");
        }).finally(() => {
            setIsSubmitting(false);
        })

    };

    return (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
            {successMessage && (
                <p className="text-green-600">
                    {successMessage}
                </p>
            )}
            {errorMessage && (
                <p className="text-red-600">
                    {errorMessage}
                </p>
            )}
            <div className="mb-5">
                <label htmlFor="name" className="block mb-2.5 text-sm font-medium text-heading">Add Player</label>
                <input
                    id="name"
                    value={name}
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body rounded-xl"
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter Player Name"
                    required
                />
            </div>
            <div className="mb-5">
                <label htmlFor="team" className="block mb-2.5 text-sm font-medium text-heading">Add Team</label>
                <input 
                    id="team"
                    value={team}
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body rounded-xl"
                    onChange={(event) => setTeam(event.target.value)}
                    placeholder="Enter Team"
                    required
                />
            </div>
            <div className="mb-5">
                <label htmlFor="position" className="block mb-2.5 text-sm font-medium text-heading">Add Position</label>
                <select
                    id="position"
                    value={position}
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body rounded-xl"
                    onChange={(event) => setPosition(event.target.value)}
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
            <div className="mb-5">
                <label htmlFor="battingAvg" className="block mb-2.5 text-sm font-medium text-heading">Add Batting Average</label>
                <input
                    id="battingAvg"
                    value={battingAvg}
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body rounded-xl"
                    onChange={(event) => setBattingAvg(event.target.value)}
                    placeholder="Enter Batting Average"
                    type="number"
                    min={0}
                    max={1}
                    step={0.001}
                />
            </div>
            <div className="mb-5">
                <label htmlFor="era" className="block mb-2.5 text-sm font-medium text-heading">Add ERA</label>
                <input
                    id="era"
                    value={era}
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body rounded-xl"
                    onChange={(event) => setEra(event.target.value)}
                    placeholder="Enter ERA"
                    type="number"
                    min={0}
                    step={0.01}
                />
            </div>
            <button type="submit" className="w-full rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:bg-indigo-700 transition duration-150 ease-in-out">
                {isSubmitting ? "Adding Player..." : "Add Player"}
            </button>
        </form>
    );
}

