import React, { useState } from "react";

export default function AddPlayerForm() {

    const [name, setName] = useState("")
    const [team, setTeam] = useState("")
    const [position, setPosition] = useState("")
    const [battingAvg, setBattingAvg] = useState("")
    const [era, setEra] = useState("")

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const playerData = {
            name, 
            team,
            position,
            battingAvg,
            era
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

            setName("");
            setTeam("");
            setPosition("");
            setBattingAvg("");
            setEra("");

        }).catch((error) => {
            console.log("Error adding player:", error)
        });

    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Add Player</label>
                <input
                    id="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter Player Name"
                />
            </div>
            <div>
                <label htmlFor="team">Add Team</label>
                <input 
                    id="team"
                    value={team}
                    onChange={(event) => setTeam(event.target.value)}
                    placeholder="Enter Team"
                />
            </div>
            <div>
                <label htmlFor="position">Add Position</label>
                <select
                    id="position"
                    value={position}
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
            <div>
                <label htmlFor="battingAvg">Add Batting Average</label>
                <input
                    id="battingAvg"
                    value={battingAvg}
                    onChange={(event) => setBattingAvg(event.target.value)}
                    placeholder="Enter Batting Average"
                />
            </div>
            <div>
                <label htmlFor="era">Add ERA</label>
                <input
                    id="era"
                    value={era}
                    onChange={(event) => setEra(event.target.value)}
                    placeholder="Enter ERA"
                />
            </div>
            <button type="submit">
                Add Player
            </button>
        </form>
    );
}

