import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaSearch } from "react-icons/fa";
import { Button, Container, Logo } from "../index.js";

function Header() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.data);

  const navItems = [
    { name: "Home", link: "/", active: true },
    { name: "Blog", link: "/blogs", active: true },
    { name: "Explore", link: "/explore", active: true },
    { name: "Write Post", link: "/create-post", active: isLoggedIn },
  ];

  return (
    <header className="mt-5">
      <Container>
        <nav className="flex items-center justify-between rounded-3xl border-2 border-slate-300 bg-white p-5 px-8">
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
                        `rounded-lg px-4 py-1.5 text-lg transition-all duration-300 hover:bg-slate-700/20 ${
                          isActive ? "font-bold text-blue-600" : "font-semibold"
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
                  `rounded-lg p-3 text-lg transition-all duration-300 hover:bg-slate-700/20 ${
                    isActive ? "font-bold text-blue-600" : "font-semibold"
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
                  className="h-12 w-12 cursor-pointer rounded-full object-cover ring-indigo-700 transition-all duration-300 hover:ring-8 hover:ring-slate-700/30"
                  src={user.avatar}
                  alt="User avatar"
                />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <NavLink
                  to="login"
                  className={({ isActive }) =>
                    `rounded-lg px-4 py-1.5 text-base transition-all duration-300 hover:bg-slate-700/20 ${
                      isActive ? "font-bold text-blue-600" : "font-semibold"
                    }`
                  }
                >
                  Login
                </NavLink>
                <Button
                  className="px-3 py-1.5"
                  onClick={() => navigate("/register")}
                >
                  Get started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <FaBars className="text-2xl" />
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="mt-2 rounded border border-slate-300 bg-white p-4 md:hidden">
            <div className="flex flex-col gap-2">
              {navItems.map(
                (item) =>
                  item.active && (
                    <NavLink
                      key={item.name}
                      to={item.link}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `rounded-lg px-4 py-1.5 text-lg transition-all duration-300 hover:bg-slate-700/20 ${
                          isActive ? "font-bold text-blue-600" : "font-semibold"
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
                  `rounded-lg p-3 text-lg transition-all duration-300 hover:bg-slate-700/20 ${
                    isActive ? "font-bold text-blue-600" : "font-semibold"
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
                  className="mt-2 flex items-center gap-2 border-t border-slate-300 pt-2"
                >
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={user.avatar}
                    alt="User avatar"
                  />
                  <span className="font-semibold">{user.username}</span>
                </Link>
              ) : (
                <div className="mt-2 flex flex-col gap-2 border-t border-slate-300 pt-2">
                  <NavLink
                    to="login"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `rounded-lg px-4 py-1.5 text-base transition-all duration-300 hover:bg-slate-700/20 ${
                        isActive ? "font-bold text-blue-600" : "font-semibold"
                      }`
                    }
                  >
                    Login
                  </NavLink>
                  <Button
                    className="px-3 py-1.5"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/register");
                    }}
                  >
                    Get started
                  </Button>
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
