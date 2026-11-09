
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditPlayerForm from "./EditPlayerForm";
import type { Player } from "../types/player";

describe("EditPlayerForm", () => {
    const mockOnPlayerUpdated = vi.fn();
    const mockOnCancel = vi.fn();

    const testPlayer: Player = {
        id: 1,
        name: "Aaron Judge",
        team: "New York Yankees",
        position: "RF",
        battingAvg: 0.322,
        obp: 0.458,
        slugging: 0.701,
        era: 0,
        ops: 1.159,
    };

    const successfulResponse = {
        ...testPlayer,
        name: "Aaron Judge Updated",
    };

    beforeEach(() => {
        vi.resetAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    // Helper function to render the form
    const renderEditForm = (player: Player = testPlayer) => {
        return render(
            <EditPlayerForm
                player={player}
                onPlayerUpdated={mockOnPlayerUpdated}
                onCancel={mockOnCancel}
            />
        );
    };

    // 1. Rendering tests
    it("renders the edit form heading", () => {
        renderEditForm();

        expect(
            screen.getByRole("heading", { name: "Edit Player" })
        ).toBeInTheDocument();
    });

    it("renders all input fields", () => {
        renderEditForm();

        expect(screen.getByLabelText("Name")).toBeInTheDocument();
        expect(screen.getByLabelText("Team")).toBeInTheDocument();
        expect(screen.getByLabelText("Add Position")).toBeInTheDocument();
        expect(screen.getByLabelText("Batting Average")).toBeInTheDocument();
        expect(screen.getByLabelText("On-Base Percentage")).toBeInTheDocument();
        expect(screen.getByLabelText("Slugging Percentage")).toBeInTheDocument();
        expect(screen.getByLabelText("ERA")).toBeInTheDocument();
    });

    it("renders all available player positions", () => {
        renderEditForm();

        expect(screen.getByRole("option", { name: "Pitcher" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Catcher" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "First Baseman" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Second Baseman" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Third Baseman" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Shortstop" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Left Fielder" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Center Fielder" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Right Fielder" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Designated Hitter" })).toBeInTheDocument();
    });

    // 2. Pre-population tests
    it("pre-populates all fields with the player's existing information", () => {
        renderEditForm();

        expect(screen.getByLabelText("Name")).toHaveValue("Aaron Judge");
        expect(screen.getByLabelText("Team")).toHaveValue("New York Yankees");
        expect(screen.getByLabelText("Add Position")).toHaveValue("RF");
        expect(screen.getByLabelText("Batting Average")).toHaveValue(0.322);
        expect(screen.getByLabelText("On-Base Percentage")).toHaveValue(0.458);
        expect(screen.getByLabelText("Slugging Percentage")).toHaveValue(0.701);
        expect(screen.getByLabelText("ERA")).toHaveValue(0);
    });

    it("handles null OPS without affecting the form fields", () => {
        const pitcher: Player = {
            ...testPlayer,
            position: "P",
            ops: null,
            era: 2.05,
        };

        renderEditForm(pitcher);

        expect(screen.getByLabelText("Name")).toHaveValue("Aaron Judge");
        expect(screen.getByLabelText("Add Position")).toHaveValue("P");
        expect(screen.getByLabelText("ERA")).toHaveValue(2.05);
    });

    it("initializes empty fields when the player's statistics are null", () => {
        const playerWithNullStats: Player = {
            ...testPlayer,
            battingAvg: null,
            obp: null,
            slugging: null,
            era: null,
        };

        renderEditForm(playerWithNullStats);

        expect(screen.getByLabelText("Batting Average")).toHaveValue(null);
        expect(screen.getByLabelText("On-Base Percentage")).toHaveValue(null);
        expect(screen.getByLabelText("Slugging Percentage")).toHaveValue(null);
        expect(screen.getByLabelText("ERA")).toHaveValue(null);
    });

    // 3. Input tests
    it("allows the user to modify player information", () => {
        renderEditForm();

        fireEvent.change(screen.getByLabelText("Name"), {
            target: { value: "Aaron Judge Updated" },
        });

        fireEvent.change(screen.getByLabelText("Team"), {
            target: { value: "New York Yankees Updated" },
        });

        fireEvent.change(screen.getByLabelText("Add Position"), {
            target: { value: "DH" },
        });

        fireEvent.change(screen.getByLabelText("Batting Average"), {
            target: { value: "0.350" },
        });

        expect(screen.getByLabelText("Name")).toHaveValue("Aaron Judge Updated");
        expect(screen.getByLabelText("Team")).toHaveValue("New York Yankees Updated");
        expect(screen.getByLabelText("Add Position")).toHaveValue("DH");
        expect(screen.getByLabelText("Batting Average")).toHaveValue(0.35);
    });

    // 4. Successful update tests
    it("sends a PUT request to the correct player endpoint", async () => {
        const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(successfulResponse),
        } as Response);

        renderEditForm();

        fireEvent.change(screen.getByLabelText("Name"), {
            target: { value: "Aaron Judge Updated" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

        await waitFor(() => {
            expect(fetchSpy).toHaveBeenCalledTimes(1);
        });

        const [url, options] = fetchSpy.mock.calls[0];

        expect(url).toBe("http://localhost:8080/api/players/1");
        expect(options?.method).toBe("PUT");

        expect(JSON.parse(options?.body as string)).toEqual({
            name: "Aaron Judge Updated",
            team: "New York Yankees",
            position: "RF",
            battingAvg: 0.322,
            obp: 0.458,
            slugging: 0.701,
            era: 0,
        });
    });

    it("calls onPlayerUpdated after a successful update", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(successfulResponse),
        } as Response);

        renderEditForm();

        fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

        await waitFor(() => {
            expect(mockOnPlayerUpdated).toHaveBeenCalledTimes(1);
        });
    });

    it("displays a success message after updating a player", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(successfulResponse),
        } as Response);

        renderEditForm();

        fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

        expect(
            await screen.findByText("Player updated successfully!")
        ).toBeInTheDocument();
    });

    it("does not call onPlayerUpdated when the request fails", async () => {
        vi.spyOn(globalThis, "fetch").mockRejectedValue(
            new Error("Network error")
        );

        renderEditForm();

        fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

        await screen.findByText("Network error");

        expect(mockOnPlayerUpdated).not.toHaveBeenCalled();
    });

    it("sends null for empty statistical fields", async () => {
        const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(successfulResponse),
        } as Response);

        const playerWithNullStats: Player = {
            ...testPlayer,
            battingAvg: null,
            obp: null,
            slugging: null,
            era: null,
        };

        renderEditForm(playerWithNullStats);

        fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

        await waitFor(() => {
            expect(fetchSpy).toHaveBeenCalledTimes(1);
        });

        const options = fetchSpy.mock.calls[0][1];
        const submittedData = JSON.parse(options?.body as string);

        expect(submittedData).toEqual({
            name: "Aaron Judge",
            team: "New York Yankees",
            position: "RF",
            battingAvg: null,
            obp: null,
            slugging: null,
            era: null,
        });
    });

    // 5. Error handling tests
    it("displays validation errors returned by the API", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            json: () =>
                Promise.resolve({
                    errors: {
                        name: "Name is required.",
                        team: "Team is required.",
                    },
                }),
        } as Response);

        renderEditForm();

        fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

        expect(
            await screen.findByText("Name is required. Team is required.")
        ).toBeInTheDocument();
    });

    it("displays the API message when no validation errors are provided", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            json: () =>
                Promise.resolve({
                    message: "Player not found.",
                }),
        } as Response);

        renderEditForm();

        fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

        expect(
            await screen.findByText("Player not found.")
        ).toBeInTheDocument();
    });

    it("displays an error when the network request fails", async () => {
        vi.spyOn(globalThis, "fetch").mockRejectedValue(
            new Error("Network error")
        );

        renderEditForm();

        fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

        expect(
            await screen.findByText("Network error")
        ).toBeInTheDocument();
    });

    it("displays a fallback error when the API provides no error details", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            json: () => Promise.resolve({}),
        } as Response);

        renderEditForm();

        fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

        expect(
            await screen.findByText("Failed to edit player")
        ).toBeInTheDocument();
    });

    it("displays a generic error when the rejected value is not an Error object", async () => {
        vi.spyOn(globalThis, "fetch").mockRejectedValue("Unexpected failure");

        renderEditForm();

        fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

        expect(
            await screen.findByText("An unexpected error occured")
        ).toBeInTheDocument();
    });

    it("clears the previous error message after a successful update", async () => {
        vi.spyOn(globalThis, "fetch")
            .mockRejectedValueOnce(new Error("Network error"))
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(successfulResponse),
            } as Response);

        renderEditForm();

        // First submission fails.
        fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

        expect(await screen.findByText("Network error")).toBeInTheDocument();

        // Second submission succeeds.
        fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

        expect(
            await screen.findByText("Player updated successfully!")
        ).toBeInTheDocument();

        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("clears the previous success message after a failed update", async () => {
        vi.spyOn(globalThis, "fetch")
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(successfulResponse),
            } as Response)
            .mockRejectedValueOnce(new Error("Network error"));

        renderEditForm();

        // First submission succeeds.
        fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

        expect(
            await screen.findByText("Player updated successfully!")
        ).toBeInTheDocument();

        // Second submission fails.
        fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

        expect(await screen.findByText("Network error")).toBeInTheDocument();

        expect(
            screen.queryByText("Player updated successfully!")
        ).not.toBeInTheDocument();
    });

    // 6. Cancel tests
    it("calls onCancel when the Cancel button is clicked", () => {
        renderEditForm();

        fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

        expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it("does not submit the form when Cancel is clicked", () => {
        const fetchSpy = vi.spyOn(globalThis, "fetch");

        renderEditForm();

        fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

        expect(fetchSpy).not.toHaveBeenCalled();
    });

    // 7. Submission state tests
    it("disables the Save Changes button while the request is pending", async () => {
        let resolveFetch!: (value: Response) => void;

        vi.spyOn(globalThis, "fetch").mockReturnValue(
            new Promise((resolve) => {
                resolveFetch = resolve;
            })
        );

        renderEditForm();

        fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

        const saveButton = screen.getByRole("button", { name: "Saving..." });

        expect(saveButton).toBeDisabled();

        resolveFetch({
            ok: true,
            json: () => Promise.resolve(successfulResponse),
        } as Response);

        await waitFor(() => {
            expect(saveButton).toBeEnabled();
        });
    });

    it("re-enables the Save Changes button after a failed request", async () => {
        vi.spyOn(globalThis, "fetch").mockRejectedValue(
            new Error("Network error")
        );

        renderEditForm();

        fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: "Save Changes" })
            ).toBeEnabled();
        });
    });
});
