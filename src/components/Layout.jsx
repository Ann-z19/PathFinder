import { Link, NavLink, Outlet } from "react-router";
import "./Layout.css";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/assessment", label: "Assessment" },
  { to: "/results", label: "Explore" },
  { to: "/shortlist", label: "Shortlist" },
];

function Layout() {
  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="site-logo">
          PathFinder
        </Link>
        <nav className="site-nav">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                isActive ? "nav-link is-active" : "nav-link"
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/signin" className="nav-signin">
            Sign In
          </NavLink>
        </nav>
      </header>
      <main className="site-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <p>PathFinder · Career exploration made clearer</p>
        <p>Privacy · Data sources · Help</p>
      </footer>
    </div>
  );
}

export default Layout;
