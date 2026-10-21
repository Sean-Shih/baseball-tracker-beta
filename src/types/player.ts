export interface Player {
    id: number;
    name: string;
    team: string;
    position: string;
    battingAvg?: string;
    era?: string;
}

export interface ApiErrorResponse {
    message: string;
    errors?: Record<string, string>;
}