import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { render } from "../utils/test-utils";
import { Navbar } from "../../components/Navbar";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: "/" }),
  };
});

describe("Navbar Component", () => {
  const mockUser = {
    id: 1,
    name: "Test User",
    email: "test@example.com",
  };

  it("should render navbar with user information", () => {
    render(<Navbar />, {
      preloadedState: {
        auth: { user: mockUser, isAuthenticated: true },
      },
    });

    expect(screen.getByText("Library System")).toBeInTheDocument();
    expect(screen.getByText("Test User")).toBeInTheDocument();
  });

  it("should render all navigation links", () => {
    render(<Navbar />, {
      preloadedState: {
        auth: { user: mockUser, isAuthenticated: true },
      },
    });

    expect(screen.getByTestId("nav-books-link")).toBeInTheDocument();
    expect(screen.getByTestId("nav-rentals-link")).toBeInTheDocument();
    expect(screen.getByTestId("nav-profile-link")).toBeInTheDocument();
  });

  it("should handle logout", () => {
    render(<Navbar />, {
      preloadedState: {
        auth: { user: mockUser, isAuthenticated: true },
      },
    });

    const logoutButton = screen.getByTestId("logout-button");
    fireEvent.click(logoutButton);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("should display user avatar", () => {
    render(<Navbar />, {
      preloadedState: {
        auth: { user: mockUser, isAuthenticated: true },
      },
    });

    const avatar = screen.getByTestId("user-avatar");
    expect(avatar).toBeInTheDocument();
  });
});
