import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/slices/authSlice";
import { loadUserRentals, clearRentals } from "../store/slices/rentalsSlice";
import { loadUserWishlist, clearWishlist } from "../store/slices/wishlistSlice";
import { loadUserProfile, clearProfile } from "../store/slices/profileSlice";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Library, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }

    setLoading(true);

    try {
      // Fetch users from JSONPlaceholder
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      const users = response.data;

      // Find user by username (case-insensitive)
      const user = users.find(
        (u) => u.username.toLowerCase() === username.toLowerCase()
      );

      if (user) {
        // Clear any existing data from previous user
        dispatch(clearRentals());
        dispatch(clearWishlist());
        dispatch(clearProfile());

        // Login the user
        dispatch(login(user));

        // Load user-specific data
        dispatch(loadUserRentals(user.id));
        dispatch(loadUserWishlist(user.id));
        dispatch(loadUserProfile(user.id));

        toast.success(`Welcome, ${user.name}!`);
        navigate("/");
      } else {
        toast.error("User not found. Try: Bret, Antonette, Samantha, etc.");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.message === "Network Error" || !error.response) {
        toast.error(
          "Network error. Please check your connection and try again."
        );
      } else if (error.response?.status >= 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 px-4"
      data-testid="login-page"
    >
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
            <Library className="h-8 w-8 text-slate-700" />
          </div>
          <div>
            <CardTitle className="text-3xl font-semibold text-slate-800">
              Library System
            </CardTitle>
            <CardDescription className="text-slate-500 mt-2">
              Sign in to access the library management system
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-700">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username (e.g., Bret)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="border-slate-300 focus:border-slate-400"
                data-testid="username-input"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-700 text-white"
              disabled={loading}
              data-testid="login-button"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-600 text-center">
              💡 Try usernames:{" "}
              <span className="font-medium">
                Bret, Antonette, Samantha, Karianne, Kamren
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
