import { describe, expect, it } from 'vitest';
import { formatBattingStat, formatEra, formatOps } from './formatStats';

describe('formatBattingStat', () => {
    it("formats batting average to 3 decimal places", () => {
        expect(formatBattingStat(0.322)).toBe(".322");
    });

    it("rounds batting average to 3 decimal places", () => {
        expect(formatBattingStat(0.3216)).toBe(".322");
    });

    it("removes leading zero for batting statistics", () => {
        expect(formatBattingStat(0.5)).toBe(".500");
    });

    it("formats 0 correctly", () => {
        expect(formatBattingStat(0)).toBe(".000");
    });

    it("returns 'N/A' for null values", () => {
        expect(formatBattingStat(null)).toBe("N/A");
    });
});

describe('formatEra', () => {
    it("formats ERA to 2 decimal places", () => {
        expect(formatEra(2.05)).toBe("2.05");
    });

    it("rounds ERA to 2 decimal places", () => {
        expect(formatEra(2.054)).toBe("2.05");
    });

    it("preserves trailing zeroes", () => {
        expect(formatEra(2.5)).toBe("2.50");
    });

    it("formats 0 correctly", () => {
        expect(formatEra(0)).toBe("0.00");
    });

    it("returns 'N/A' for null values", () => {
        expect(formatEra(null)).toBe("N/A");
    });     
});

describe('formatOps', () => {
    it("formats OPS to 3 decimal places", () => {
        expect(formatOps(1.159)).toBe("1.159");
    });

    it("rounds OPS to 3 decimal places", () => {
        expect(formatOps(1.1586)).toBe("1.159");
    });

    it("preserves trailing zeroes", () => {
        expect(formatOps(1.5)).toBe("1.500");
    });

    it("formats 0 correctly", () => {
        expect(formatOps(0)).toBe("0.000");
    });

    it("returns 'N/A' for null values", () => {
        expect(formatOps(null)).toBe("N/A");
    });

    it("returns 'N/A' for undefined values", () => {
        expect(formatOps(undefined)).toBe("N/A");
    });
});