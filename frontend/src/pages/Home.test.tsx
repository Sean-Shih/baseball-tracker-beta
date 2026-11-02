import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";
import { testPlayers } from "../test/testPlayers";


describe("Home Page", () => {
    beforeEach(() => {

        // replaces real network request with fake test response
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(testPlayers),
            })
        );
    });

    afterEach(() => {
        vi.unstubAllGlobals()
        vi.restoreAllMocks();
    });

    it("loads and displays players", async () => {
        render(

            // MemoryRouter supplues react router context without changing browser URL
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        // findByText awaits async rendering
        expect(await screen.findByText("Paul Skenes")).toBeInTheDocument();

        expect(screen.getByText("Shohei Ohtani")).toBeInTheDocument();  
    });

    it("filters players by name", async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        await screen.findByText("Paul Skenes");

        const searchInput = screen.getByRole("textbox", { name: /search/i });

        await user.type(searchInput, "Shohei");

        expect(screen.getByText("Shohei Ohtani")).toBeInTheDocument();

        // queryByText checks if a player is absent without throwing error
        expect(screen.queryByText("Paul Skenes")).not.toBeInTheDocument();
    });

    it("filters players by team", async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        await screen.findByText("Paul Skenes");

        const searchInput = screen.getByRole("textbox", { name: /search/i });

        await user.type(searchInput, "Yankees");

        expect(screen.getByText("Aaron Judge")).toBeInTheDocument();

        expect(screen.queryByText("Paul Skenes")).not.toBeInTheDocument();
    });


    it("switches from card view to table view", async () => {
    const user = userEvent.setup();

    render(
        <MemoryRouter>
        <Home />
        </MemoryRouter>
    );

    await screen.findByText("Paul Skenes");

    await user.click(
        screen.getByRole("button", { name: /table view/i })
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it("shows a loading message while fetching players", () => {
        vi.stubGlobal(
            "fetch",
            vi.fn(() => new Promise(() => {}))
        );

        render(
            <MemoryRouter>
            <Home />
            </MemoryRouter>
        );

        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it("shows an error message when fetching players fails", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockRejectedValue(new Error("Network error"))
        );

        render(
            <MemoryRouter>
            <Home />
            </MemoryRouter>
        );

        expect(
            await screen.findByText(/unable to load players/i)
        ).toBeInTheDocument();
    });

    it("shows an empty state when the API returns no players", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve([]),
            })
        );

        render(
            <MemoryRouter>
            <Home />
            </MemoryRouter>
        );

        expect(
            await screen.findByText(/no players/i)
        ).toBeInTheDocument();
    });

});