import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { render } from "../utils/test-utils";
import { Login } from "../../pages/Login";
import axios from "axios";

vi.mock("axios");

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Login Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render login form", () => {
    render(<Login />);

    expect(screen.getByTestId("username-input")).toBeInTheDocument();
    expect(screen.getByTestId("login-button")).toBeInTheDocument();
  });

  it("should handle successful login", async () => {
    const mockUser = {
      id: 1,
      name: "Test User",
      username: "testuser",
      email: "test@example.com",
    };

    axios.get.mockResolvedValueOnce({
      data: [mockUser],
    });

    render(<Login />);

    const usernameInput = screen.getByTestId("username-input");
    const loginButton = screen.getByTestId("login-button");

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "https://jsonplaceholder.typicode.com/users"
      );
    });
  });

  it("should show error for empty username", async () => {
    render(<Login />);

    const loginButton = screen.getByTestId("login-button");
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(axios.get).not.toHaveBeenCalled();
    });
  });
});
