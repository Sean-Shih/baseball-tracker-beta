import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatCard from './StatCard';

describe('StatCard', () => {
    it("renders the statistic label", () => {
        render(<StatCard label="Batting Average" value=".322" />);
        expect(screen.getByText("Batting Average")).toBeInTheDocument();
    });

    it("renders the statistic value", () => {
        render(<StatCard label="Batting Average" value=".322" />);
        expect(screen.getByText(".322")).toBeInTheDocument();
    });

    it("renders both label and value correctly", () => {
        render(<StatCard label="ERA" value="2.05" />);
        expect(screen.getByText("ERA")).toBeInTheDocument();
        expect(screen.getByText("2.05")).toBeInTheDocument();
    });

    it("renders numerical values correctly", () => {
        render(<StatCard label="OPS" value={1.159} />);

        expect(screen.getByText("1.159")).toBeInTheDocument();
    });

    it("renders zero values correctly", () => {
        render(<StatCard label="OPS" value={0} />);
        expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("renders N/A when value is unavailable", () => {
        render(<StatCard label="OPS" value="N/A" />);
        expect(screen.getByText("N/A")).toBeInTheDocument();
    });
});