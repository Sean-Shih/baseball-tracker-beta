
import { afterEach, describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddPlayerForm from "./AddPlayerForm";

describe("AddPlayerForm", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("submits valid data and calls onPlayerAdded", async () => {
    const user = userEvent.setup();
    const onPlayerAdded = vi.fn();

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 10,
          name: "Test Player",
          team: "Test Team",
          position: "P",
          battingAvg: ".250",
          era: "3.50",
        }),
    });

    vi.stubGlobal("fetch", fetchMock);

    render(<AddPlayerForm onPlayerAdded={onPlayerAdded} />);

    await user.type(
      screen.getByRole("textbox", { name: /name/i }),
      "Test Player"
    );

    await user.type(
      screen.getByRole("textbox", { name: /team/i }),
      "Test Team"
    );

    await user.selectOptions(
      screen.getByRole("combobox", { name: /position/i }),
      "P"
    );

    await user.type(
      screen.getByRole("textbox", { name: /batting average/i }),
      ".250"
    );

    await user.type(
      screen.getByRole("textbox", { name: /era/i }),
      "3.50"
    );

    await user.click(
      screen.getByRole("button", { name: /add player/i })
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "http://localhost:8080/api/players",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      );
    });

    await waitFor(() => {
      expect(onPlayerAdded).toHaveBeenCalledTimes(1);
    });

    expect(
      await screen.findByText(/player added successfully/i)
    ).toBeInTheDocument();
  });
});

const fetchMock = vi.fn().mockResolvedValue({
  ok: false,
  status: 400,
  json: () =>
    Promise.resolve({
      message: "Validation failed",
      errors: {
        name: "Player name is required",
      },
    }),
});

let resolveRequest!: (value: unknown) => void;

const pendingRequest = new Promise((resolve) => {
  resolveRequest = resolve;
});

vi.stubGlobal(
  "fetch",
  vi.fn().mockReturnValue(pendingRequest)
);

await waitFor(() => {
  expect(
    screen.getByRole("textbox", { name: /name/i })
  ).toHaveValue("");
});