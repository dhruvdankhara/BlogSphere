import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaSearch } from "react-icons/fa";
import { Container, Logo } from "../index.js";

function Header() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.data);

  const navItems = [
    { name: "Home", link: "/", active: true },
    { name: "Blog", link: "/blogs", active: true },
    { name: "Write Post", link: "/create-post", active: isLoggedIn },
  ];

  return (
    <header className="sticky top-5 z-50">
      <Container>
        <nav className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 px-8 shadow-lg backdrop-blur-lg">
          {/* Logo */}
          <div>
            <Link to="/">
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-4 md:flex">
            <div className="flex items-center justify-center gap-2">
              {navItems.map(
                (item) =>
                  item.active && (
                    <NavLink
                      key={item.name}
                      to={item.link}
                      className={({ isActive }) =>
                        `rounded-xl px-4 py-2 text-lg text-gray-700 transition-all duration-300 hover:bg-gray-100 ${
                          isActive
                            ? "bg-blue-50 font-bold text-blue-600"
                            : "font-semibold hover:text-gray-900"
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  )
              )}
              <NavLink
                to={"/search"}
                className={({ isActive }) =>
                  `rounded-xl p-3 text-lg text-gray-700 transition-all duration-300 hover:bg-gray-100 ${
                    isActive
                      ? "bg-blue-50 font-bold text-blue-600"
                      : "font-semibold hover:text-gray-900"
                  }`
                }
              >
                <FaSearch />
              </NavLink>
            </div>

            {/* User Links */}
            {isLoggedIn ? (
              <Link to={`/u/${user.username}`}>
                <img
                  className="h-12 w-12 cursor-pointer rounded-full object-cover ring-2 ring-gray-300 transition-all duration-300 hover:ring-4 hover:ring-blue-500/50"
                  src={user.avatar}
                  alt="User avatar"
                />
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <NavLink
                  to="login"
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-2 text-base text-gray-700 transition-all duration-300 hover:bg-gray-100 ${
                      isActive
                        ? "bg-blue-50 font-bold text-blue-600"
                        : "font-semibold hover:text-gray-900"
                    }`
                  }
                >
                  Login
                </NavLink>
                <button
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-blue-700 md:text-base"
                  onClick={() => navigate("/register")}
                >
                  Get started
                </button>
              </div>
            )}
          </div>

          {/* Mobile button */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <FaBars className="text-2xl text-gray-700" />
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl backdrop-blur-lg md:hidden">
            <div className="flex flex-col gap-2">
              {navItems.map(
                (item) =>
                  item.active && (
                    <NavLink
                      key={item.name}
                      to={item.link}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `rounded-xl px-4 py-3 text-lg text-gray-700 transition-all duration-300 hover:bg-gray-100 ${
                          isActive
                            ? "bg-blue-50 font-bold text-blue-600"
                            : "font-semibold hover:text-gray-900"
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  )
              )}
              <NavLink
                to={"/search"}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl p-3 text-lg text-gray-700 transition-all duration-300 hover:bg-gray-100 ${
                    isActive
                      ? "bg-blue-50 font-bold text-blue-600"
                      : "font-semibold hover:text-gray-900"
                  }`
                }
              >
                <FaSearch />
              </NavLink>

              {/* Mobile User Links */}
              {isLoggedIn ? (
                <Link
                  to={`/u/${user.username}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 flex items-center gap-3 border-t border-gray-200 pt-3"
                >
                  <img
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-300"
                    src={user.avatar}
                    alt="User avatar"
                  />
                  <span className="font-semibold text-gray-700">
                    {user.username}
                  </span>
                </Link>
              ) : (
                <div className="mt-2 flex flex-col gap-2 border-t border-gray-200 pt-3">
                  <NavLink
                    to="login"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `rounded-xl px-4 py-2 text-base text-gray-700 transition-all duration-300 hover:bg-gray-100 ${
                        isActive
                          ? "bg-blue-50 font-bold text-blue-600"
                          : "font-semibold hover:text-gray-900"
                      }`
                    }
                  >
                    Login
                  </NavLink>
                  <button
                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-700 md:text-base"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/register");
                    }}
                  >
                    Get started
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}

export default Header;
