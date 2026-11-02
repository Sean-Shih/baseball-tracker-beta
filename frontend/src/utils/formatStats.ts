export function formatBattingStat(value: number | null): string {
  if (value === null) return "N/A";

  return value.toFixed(3).replace(/^0/, "");
}

export function formatEra(value: number | null): string {
  if (value === null) return "N/A";

  return value.toFixed(2);
}

export function formatOps(value?: number | null): string {
    if (value == null) return "N/A";

    return value.toFixed(3);
}