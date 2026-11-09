
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddPlayerForm from "./AddPlayerForm";

describe("AddPlayerForm", () => {
    const mockOnPlayerAdded = vi.fn();

    beforeEach(() => {
        vi.resetAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    // Helper function to fill out the form
    const fillForm = () => {
        fireEvent.change(screen.getByLabelText(/add player/i), {
            target: { value: "Aaron Judge" },
        });

        fireEvent.change(screen.getByLabelText(/add team/i), {
            target: { value: "New York Yankees" },
        });

        fireEvent.change(screen.getByLabelText(/add position/i), {
            target: { value: "RF" },
        });

        fireEvent.change(screen.getByLabelText(/add batting average/i), {
            target: { value: "0.322" },
        });

        fireEvent.change(screen.getByLabelText(/add on-base percentage/i), {
            target: { value: "0.458" },
        });

        fireEvent.change(screen.getByLabelText(/add slugging percentage/i), {
            target: { value: "0.701" },
        });

        fireEvent.change(screen.getByLabelText(/add era/i), {
            target: { value: "0" },
        });
    };

    // Mock successful API response
    const successfulResponse = {
        id: 1,
        name: "Aaron Judge",
        team: "New York Yankees",
        position: "RF",
        battingAvg: 0.322,
        obp: 0.458,
        slugging: 0.701,
        era: 0,
    };

    // 1. Rendering tests
    it("renders the form heading", () => {
        render(<AddPlayerForm onPlayerAdded={mockOnPlayerAdded} />);

        expect(screen.getByText("Add Player", { selector: "label" })).toBeInTheDocument();
    });

    it("renders all input fields", () => {
        render(<AddPlayerForm onPlayerAdded={mockOnPlayerAdded} />);

        expect(screen.getByLabelText(/add player/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/add team/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/add position/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/add batting average/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/add on-base percentage/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/add slugging percentage/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/add era/i)).toBeInTheDocument();
    });

    it("renders all available player positions", () => {
        render(<AddPlayerForm onPlayerAdded={mockOnPlayerAdded} />);

        const positionSelect = screen.getByLabelText(/add position/i);

        expect(positionSelect).toHaveDisplayValue("Pitcher");
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

    // 2. Input tests
    it("allows the user to enter player information", () => {
        render(<AddPlayerForm onPlayerAdded={mockOnPlayerAdded} />);

        fillForm();

        expect(screen.getByLabelText(/add player/i)).toHaveValue("Aaron Judge");
        expect(screen.getByLabelText(/add team/i)).toHaveValue("New York Yankees");
        expect(screen.getByLabelText(/add position/i)).toHaveValue("RF");
        expect(screen.getByLabelText(/add batting average/i)).toHaveValue(0.322);
        expect(screen.getByLabelText(/add on-base percentage/i)).toHaveValue(0.458);
        expect(screen.getByLabelText(/add slugging percentage/i)).toHaveValue(0.701);
        expect(screen.getByLabelText(/add era/i)).toHaveValue(0);
    });

    // 3. Successful submission tests
    it("sends a POST request with the correct player information", async () => {
        const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(successfulResponse),
        } as Response);

        render(<AddPlayerForm onPlayerAdded={mockOnPlayerAdded} />);

        fillForm();

        fireEvent.click(screen.getByRole("button", { name: /add player/i }));

        await waitFor(() => {
            expect(fetchSpy).toHaveBeenCalledTimes(1);
        });
                
        const [url, options] = fetchSpy.mock.calls[0];

        expect(url).toBe("http://localhost:8080/api/players");
        expect(options?.method).toBe("POST")

        expect(JSON.parse(options?.body as string)).toEqual({
          name: "Aaron Judge",
          team: "New York Yankees",
          position: "RF",
          battingAvg: 0.322,
          obp: 0.458,
          slugging: 0.701,
          era: 0,
        });
    });

    it("calls onPlayerAdded after successfully adding a player", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(successfulResponse),
        } as Response);

        render(<AddPlayerForm onPlayerAdded={mockOnPlayerAdded} />);

        fillForm();

        fireEvent.click(screen.getByRole("button", { name: /add player/i }));

        await waitFor(() => {
            expect(mockOnPlayerAdded).toHaveBeenCalledTimes(1);
        });
    });

    it("displays a success message after adding a player", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(successfulResponse),
        } as Response);

        render(<AddPlayerForm onPlayerAdded={mockOnPlayerAdded} />);

        fillForm();

        fireEvent.click(screen.getByRole("button", { name: /add player/i }));

        expect(await screen.findByRole("status")).toHaveTextContent(
            "Player added successfully!"
        );
    });

    it("clears all input fields after successful submission", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(successfulResponse),
        } as Response);

        render(<AddPlayerForm onPlayerAdded={mockOnPlayerAdded} />);

        fillForm();

        fireEvent.click(screen.getByRole("button", { name: /add player/i }));

        await waitFor(() => {
            expect(screen.getByLabelText(/add player/i)).toHaveValue("");
            expect(screen.getByLabelText(/add team/i)).toHaveValue("");
            expect(screen.getByLabelText(/add batting average/i)).toHaveValue(null);
            expect(screen.getByLabelText(/add on-base percentage/i)).toHaveValue(null);
            expect(screen.getByLabelText(/add slugging percentage/i)).toHaveValue(null);
            expect(screen.getByLabelText(/add era/i)).toHaveValue(null);
        });
    });

    // 4. Blank numeric fields
    it("sends null for blank numeric fields", async () => {
        const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(successfulResponse),
        } as Response);

        render(<AddPlayerForm onPlayerAdded={mockOnPlayerAdded} />);

        fireEvent.change(screen.getByLabelText(/add player/i), {
            target: { value: "Aaron Judge" },
        });

        fireEvent.change(screen.getByLabelText(/add team/i), {
            target: { value: "New York Yankees" },
        });

        fireEvent.change(screen.getByLabelText(/add position/i), {
            target: { value: "P" },
        });

        fireEvent.click(screen.getByRole("button", { name: /add player/i }));

        await waitFor(() => {
          expect(fetchSpy).toHaveBeenCalledTimes(1);
        });

        const [, options] = fetchSpy.mock.calls[0];

        expect(JSON.parse(options?.body as string)).toEqual({
          name: "Aaron Judge",
          team: "New York Yankees",
          position: "P",
          battingAvg: null,
          obp: null,
          slugging: null,
          era: null,
        });
    });

        // await waitFor(() => {
        //     expect(fetchSpy).toHaveBeenCalledWith(
        //         expect.any(String),
        //         expect.objectContaining({
        //             body: JSON.stringify({
        //                 name: "Aaron Judge",
        //                 team: "New York Yankees",
        //                 position: "P",
        //                 battingAvg: null,
        //                 obp: null,
        //                 slugging: null,
        //                 era: null,
        //             }),
        //         })
        //     );
        // });
    // });

    // 5. API error handling
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

        render(<AddPlayerForm onPlayerAdded={mockOnPlayerAdded} />);

        fillForm();

        fireEvent.click(screen.getByRole("button", { name: /add player/i }));

        expect(await screen.findByRole("alert")).toHaveTextContent(
            "Name is required. Team is required."
        );

        expect(mockOnPlayerAdded).not.toHaveBeenCalled();
    });

    it("displays the API message when no validation errors are provided", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            json: () =>
                Promise.resolve({
                    message: "Player already exists.",
                }),
        } as Response);

        render(<AddPlayerForm onPlayerAdded={mockOnPlayerAdded} />);

        fillForm();

        fireEvent.click(screen.getByRole("button", { name: /add player/i }));

        expect(await screen.findByRole("alert")).toHaveTextContent(
            "Player already exists."
        );
    });

    it("displays an error when the network request fails", async () => {
        vi.spyOn(globalThis, "fetch").mockRejectedValue(
            new Error("Network error")
        );

        render(<AddPlayerForm onPlayerAdded={mockOnPlayerAdded} />);

        fillForm();

        fireEvent.click(screen.getByRole("button", { name: /add player/i }));

        expect(await screen.findByRole("alert")).toHaveTextContent(
            "Network error"
        );

        expect(mockOnPlayerAdded).not.toHaveBeenCalled();
    });

    // 6. Submission state tests
    it("disables the submit button while the request is pending", async () => {
        let resolveFetch!: (value: Response) => void;

        vi.spyOn(globalThis, "fetch").mockReturnValue(
            new Promise((resolve) => {
                resolveFetch = resolve;
            })
        );

        render(<AddPlayerForm onPlayerAdded={mockOnPlayerAdded} />);

        fillForm();

        fireEvent.click(screen.getByRole("button", { name: /add player/i }));

        const submitButton = screen.getByRole("button", { name: /adding player/i });

        // expect(screen.getByRole("button", { name: /adding player/i })).toBeDisabled();
        expect(submitButton).toBeDisabled();

        resolveFetch({
            ok: true,
            json: () => Promise.resolve(successfulResponse),
        } as Response);

        await waitFor(() => {
            // expect(screen.getByRole("button", { name: /add player/i })).toBeEnabled();
            expect(submitButton).toBeEnabled();
        });
    });

    it("re-enables the submit button after a failed request", async () => {
        vi.spyOn(globalThis, "fetch").mockRejectedValue(
            new Error("Network error")
        );

        render(<AddPlayerForm onPlayerAdded={mockOnPlayerAdded} />);

        fillForm();

        fireEvent.click(screen.getByRole("button", { name: /add player/i }));

        await waitFor(() => {
            expect(screen.getByRole("button", { name: /add player/i })).toBeEnabled();
        });
    });
});
