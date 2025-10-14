import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { clearRentals } from "../store/slices/rentalsSlice";
import { clearWishlist } from "../store/slices/wishlistSlice";
import { clearProfile } from "../store/slices/profileSlice";
import { Button } from "./ui/button";
import { BookOpen, Library, User, LogOut, Menu, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const profileImage = useSelector((state) => state.profile.profileImage);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // Clear user-specific data from Redux state
    dispatch(clearRentals());
    dispatch(clearWishlist());
    dispatch(clearProfile());

    // Logout
    dispatch(logout());
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="bg-white border-b border-slate-200 sticky top-0 z-50"
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-2 text-slate-800 hover:text-slate-600 transition-colors"
            >
              <Library className="h-6 w-6" />
              <span className="text-xl font-medium hidden sm:block">
                Library System
              </span>
              <span className="text-xl font-medium sm:hidden">Library</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`flex items-center gap-2 transition-colors text-sm ${
                isActive("/")
                  ? "text-slate-900 font-medium"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              data-testid="nav-books-link"
            >
              <BookOpen className="h-4 w-4" />
              Books
            </Link>
            <Link
              to="/my-rentals"
              className={`flex items-center gap-2 transition-colors text-sm ${
                isActive("/my-rentals")
                  ? "text-slate-900 font-medium"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              data-testid="nav-rentals-link"
            >
              <Library className="h-4 w-4" />
              My Rentals
            </Link>
            <Link
              to="/profile"
              className={`flex items-center gap-2 transition-colors text-sm ${
                isActive("/profile")
                  ? "text-slate-900 font-medium"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              data-testid="nav-profile-link"
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
          </div>

          {/* Right side - Avatar and Logout (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9" data-testid="user-avatar">
                <AvatarImage src={profileImage} alt={user?.name} />
                <AvatarFallback className="bg-slate-200 text-slate-700">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span
                className="hidden lg:block text-sm text-slate-700 font-medium"
                data-testid="user-name"
              >
                {user?.name}
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              data-testid="logout-button"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden lg:inline">Logout</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Avatar className="h-8 w-8" data-testid="user-avatar-mobile">
              <AvatarImage src={profileImage} alt={user?.name} />
              <AvatarFallback className="bg-slate-200 text-slate-700 text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600"
              data-testid="mobile-menu-button"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden border-t border-slate-200 py-4"
            data-testid="mobile-menu"
          >
            <div className="flex flex-col space-y-3">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-sm font-medium text-slate-800">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>

              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive("/")
                    ? "bg-slate-100 text-slate-900 font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
                data-testid="mobile-nav-books-link"
              >
                <BookOpen className="h-5 w-5" />
                <span>Books</span>
              </Link>

              <Link
                to="/my-rentals"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive("/my-rentals")
                    ? "bg-slate-100 text-slate-900 font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
                data-testid="mobile-nav-rentals-link"
              >
                <Library className="h-5 w-5" />
                <span>My Rentals</span>
              </Link>

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive("/profile")
                    ? "bg-slate-100 text-slate-900 font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
                data-testid="mobile-nav-profile-link"
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>

              <div className="border-t border-slate-200 pt-3">
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  data-testid="mobile-logout-button"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
