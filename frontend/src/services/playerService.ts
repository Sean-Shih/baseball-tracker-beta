import type { Player } from "../types/player";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ApiErrorResponse {
    message?: string;
    errors?: Record<string, string>;
}

const getErrorMessage = (
    response: Response,
    fallbackMessage: string
): Promise<string> => {
    return response.json()
        .then((data: ApiErrorResponse) => {
            if (data.errors) {
                return Object.values(data.errors).join(" ");
            }

            return data.message || fallbackMessage;
        })
        .catch(() => fallbackMessage);
};

export const getPlayers = (): Promise<Player[]> => {
    return fetch(`${API_BASE_URL}/api/players`)
        .then((response) => {
            if (!response.ok) {
                return getErrorMessage(
                    response,
                    "Failed to fetch players."
                ).then((message) => {
                    throw new Error(message);
                });
            }

            return response.json();
        });
};

export const getPlayerById = (id: number): Promise<Player | null> => {
    return fetch(`${API_BASE_URL}/api/players/${id}`)
        .then((response) => {
            if (response.status === 404) return null;

            if (!response.ok) {
                return getErrorMessage(
                    response,
                    "Failed to fetch player."
                ).then((message) => {
                    throw new Error(message);
                });
            }

            return response.json();
        });
};

export function createPlayer(
    player: Omit<Player, "id">
): Promise<Player> {
    return fetch(`${API_BASE_URL}/api/players`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(player)
    })
        .then((response) => {
            if (!response.ok) {
                return getErrorMessage(
                    response,
                    "Failed to create player."
                ).then((message) => {
                    throw new Error(message);
                });
            }

            return response.json();
        });
}

export function updatePlayer(
    id: number,
    player: Omit<Player, "id">
): Promise<Player> {
    return fetch(`${API_BASE_URL}/api/players/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(player)
    })
        .then((response) => {
            if (!response.ok) {
                return getErrorMessage(
                    response,
                    "Failed to update player."
                ).then((message) => {
                    throw new Error(message);
                });
            }

            return response.json();
        });
}

export const deletePlayer = (id: number): Promise<void> => {
    return fetch(`${API_BASE_URL}/api/players/${id}`, {
        method: "DELETE"
    })
        .then((response) => {
            if (!response.ok) {
                return getErrorMessage(
                    response,
                    "Failed to delete player."
                ).then((message) => {
                    throw new Error(message);
                });
            }
        });
};
