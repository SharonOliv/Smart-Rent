import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import PinMark from "../ui/PinMark";

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 text-sm font-medium transition-colors hover:text-brass ${
    isActive ? "text-ink" : "text-ink-soft"
  }`;

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setAccountOpen(false);
    setMenuOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <PinMark className="h-8 w-8" strokeColor="#16232B" fillColor="#C2873E" />
          <span className="font-display text-xl font-semibold tracking-tight text-ink">Smart Rent</span>
        </Link>

        <nav className="hidden items-center md:flex">
          <NavLink to="/" end className={navLinkClass}>Home</NavLink>
          <NavLink to="/rent" className={navLinkClass}>Browse</NavLink>
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
          <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setAccountOpen((o) => !o)}
                className="flex items-center gap-1.5 rounded-full border border-ink/15 py-1.5 pl-1.5 pr-3 text-sm font-medium text-ink hover:border-ink/30"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-semibold text-paper">
                  {(user?.name || user?.username || "?").charAt(0).toUpperCase()}
                </span>
                {user?.name || user?.username}
                <ChevronDown size={15} className={`transition-transform ${accountOpen ? "rotate-180" : ""}`} />
              </button>
              {accountOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-ink/10 bg-paper shadow-lg shadow-ink/10"
                  onMouseLeave={() => setAccountOpen(false)}
                >
                  {[
                    ["Profile", "/profile"],
                    ["My Bookings", "/my-bookings"],
                    ["My Listings", "/my-listings"],
                    ["Roommate Matches", "/matches"],
                    ["Post a Property", "/post"],
                  ].map(([label, to]) => (
                    <Link
                      key={to}
                      to={to}
                      className="block px-4 py-2.5 text-sm text-ink hover:bg-ink/5"
                      onClick={() => setAccountOpen(false)}
                    >
                      {label}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="block w-full border-t border-ink/10 px-4 py-2.5 text-left text-sm text-clay hover:bg-clay/5"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2 text-sm font-medium text-ink-soft hover:text-ink">
                Log in
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper hover:bg-blueprint"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-ink/10 bg-paper px-5 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            <Link to="/" className="py-2 text-ink" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/rent" className="py-2 text-ink" onClick={() => setMenuOpen(false)}>Browse</Link>
            <Link to="/about" className="py-2 text-ink" onClick={() => setMenuOpen(false)}>About</Link>
            <Link to="/contact" className="py-2 text-ink" onClick={() => setMenuOpen(false)}>Contact</Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="py-2 text-ink" onClick={() => setMenuOpen(false)}>Profile</Link>
                <Link to="/my-bookings" className="py-2 text-ink" onClick={() => setMenuOpen(false)}>My Bookings</Link>
                <Link to="/my-listings" className="py-2 text-ink" onClick={() => setMenuOpen(false)}>My Listings</Link>
                <Link to="/matches" className="py-2 text-ink" onClick={() => setMenuOpen(false)}>Roommate Matches</Link>
                <Link to="/post" className="py-2 text-ink" onClick={() => setMenuOpen(false)}>Post a Property</Link>
                <button onClick={handleLogout} className="py-2 text-left text-clay">Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="py-2 text-ink" onClick={() => setMenuOpen(false)}>Log in</Link>
                <Link to="/signup" className="py-2 text-ink" onClick={() => setMenuOpen(false)}>Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
