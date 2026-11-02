export interface Player {
    id: number;
    name: string;
    team: string;
    position: string;
    battingAvg: number | null;
    obp: number | null;
    slugging: number | null;
    era: number | null;
    ops?: number | null;
}

export interface ApiErrorResponse {
    message: string;
    errors?: Record<string, string>;
}