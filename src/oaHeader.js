import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { FaSearch } from "react-icons/fa";
import logoMarkWhite from "./media/orbital-atlas-logo-08.svg";
import "./custom-bootstrap.scss";
import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";

function Header({ profilePhoto }) {
  const { user, isAuthenticated } = useAuth0();

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  return (
    <header className="navbar p-2 px-3 navbar-expand-lg d-flex w-100">
      <div className="d-flex flex-grow-1 gap-2 justify-content-start align-items-center">
        <Link to="/" className="navbar-brand">
          <img src={logoMarkWhite} alt="Logo" height="40" />
        </Link>

        <form className="d-flex search-bar flex-grow-1">
          <div className="position-relative w-100">
            <input
              type="search"
              className="form-control ps-4 pe-5"
              placeholder="Search..."
              aria-label="Search"
            />
            <FaSearch className="position-absolute" />
          </div>
        </form>

        <nav>
          <ul className="nav">
            <li className="nav-item">
              <Link to="/discover" className="nav-link text-white">Discover</Link>
            </li>
            <li className="nav-item">
              <Link to="/launches" className="nav-link text-white">Launches</Link>
            </li>
            <li className="nav-item">
              <Link to="/news" className="nav-link text-white">News</Link>
            </li>
            <li className="nav-item">
              <Link to="/atlas" className="nav-link text-white">Atlas</Link>
            </li>
         
         
          </ul>
        </nav>
      </div>

      <div className="d-flex justify-content-end align-items-center">
  
      {isAuthenticated ? (
    <Dropdown>
      <Dropdown.Toggle
        variant="outline"
        id="dropdown-basic"
        className="d-flex align-items-center text-white"
      >
        {/* Profielfoto weergeven als die beschikbaar is, anders initialen */}
        {user?.picture ? (
          <img
            src={user.picture}
            alt="Profile"
            className="rounded-circle me-2"
            style={{ width: "40px", height: "40px", objectFit: "cover" }}
          />
        ) : (
          <div
            className="rounded-circle d-flex align-items-center justify-content-center me-2"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#6610F2",
              color: "#FFF",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            {getInitial(user?.name)}
          </div>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu align="end">
        <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
        <Dropdown.Item as={Link} to="/settings">Settings</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item>
          <LogoutButton />
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  ) : (
    <LoginButton />
  )}

</div>

    </header>
  );
}

export default Header;
