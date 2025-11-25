import { useEffect } from "react";
import toast from "react-hot-toast";
import { HiXMark } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { setLoginStatus } from "../features/auth/authSlice";
import { store } from "../store";

interface SidebarMenuProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const SidebarMenu = ({ isSidebarOpen, setIsSidebarOpen }: SidebarMenuProps) => {
  const { loginStatus } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const logout = () => {
    toast.success("Logged out successfully");
    localStorage.removeItem("user");
    store.dispatch(setLoginStatus(false));
    setIsSidebarOpen(false);
    navigate("/login");
  };

  const handleLinkClick = () => setIsSidebarOpen(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSidebarOpen) setIsSidebarOpen(false);
    };

    document.body.style.overflow = isSidebarOpen ? "hidden" : "unset";
    if (isSidebarOpen) document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isSidebarOpen, setIsSidebarOpen]);

  if (!isSidebarOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-80 max-w-full z-50 transform transition-transform duration-500 ease-out translate-x-0">
        <div className="relative h-full bg-gradient-to-b from-white via-gray-50 to-gray-100 shadow-2xl border-r border-gray-200 flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-bold text-gray-900">
                ELEGANCE
              </span>
              <span className="text-xs text-gray-500 tracking-widest font-light">
                MAIN MENU
              </span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-transform duration-200 transform hover:scale-110"
              aria-label="Close menu"
            >
              <HiXMark className="text-2xl text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
            {[
              { name: "Home", path: "/" },
              { name: "Shop Collection", path: "/shop" },
              { name: "Search", path: "/search" },
              { name: "Shopping Cart", path: "/cart" },
            ].map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={handleLinkClick}
                className="flex items-center p-4 rounded-xl hover:bg-white hover:shadow-lg border border-transparent hover:border-gray-200 transition-all duration-300 group"
              >
                <span className="text-lg font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                  {link.name}
                </span>
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="p-6 border-t border-gray-200 bg-white space-y-3">
            {loginStatus ? (
              <button
                onClick={logout}
                className="w-full p-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={handleLinkClick}
                  className="block w-full p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={handleLinkClick}
                  className="block w-full p-4 border-2 border-indigo-600 text-indigo-600 text-center rounded-xl font-medium hover:bg-indigo-50 transform hover:scale-105 transition-all duration-300"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-900 text-white text-center">
            <p className="text-sm text-gray-300">© 2024 Elegance. Luxury Fashion</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarMenu;
