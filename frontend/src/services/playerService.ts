import type { Player } from "../types/player";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getPlayers = (): Promise<Player[]> => {
    return fetch(`${API_BASE_URL}/api/players`)
        .then((response) => {
            if(!response.ok) throw new Error("Failed to fetch players");

            return response.json();
        })
};

export const getPlayerById = (id: Number): Promise<Player | null> => {
    return fetch(`${API_BASE_URL}/api/players/${id}`)
        .then((response) => {
            if (response.status === 404) return null;
            
            if (!response.ok) throw new Error("Failed to fetch player");

            return response.json();
        })
};

export function createPlayer (player: Omit<Player, "id">): Promise<Player> {
    return fetch(`${API_BASE_URL}/api/players`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(player)
    })
    .then((response) => {
        if (!response.ok) throw new Error("Failed to create player")

            return response.json();
    });
}

export function updatePlayer (id: number, player: Omit<Player, "id">): Promise<Player> {
    return fetch(`${API_BASE_URL}/api/players/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(player)
    })
    .then((response) => {
        if (!response.ok) throw new Error("Failed to create player")

            return response.json();
    });
}

export const deletePlayer = (id: Number): Promise<void> => {
    return fetch(`${API_BASE_URL}/api/players/${id}`, {
        method: "DELETE"
    })
        .then((response) => {
            if (!response.ok) throw new Error("Failed to delete player");
        });
};