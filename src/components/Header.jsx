import React, {useContext} from "react";
import nuggetTransparent from "./nuggetTransparent2.png";
import { LinkContainer } from "react-router-bootstrap";
import AppContext from "../libs/contextLib"
import {useHistory} from "react-router-dom"

import { logout } from "../api/api";

// import SearchBar from "./SearchBar"
// <SearchBar filterNuggets={props.filterNuggets} fetchNuggets={props.fetchNuggets}/>

function Header(props) {

  const history = useHistory()
  const {isAuthenticated, setIsAuthenticated, setUserId} = useContext(AppContext)

  function handleLogout() {
    logout()
    setIsAuthenticated(false);
    setUserId("")
    history.push("/login")
  }

  return (
    <header>
      <LinkContainer to="/">
        <button className="no-format-button">
          <img id="headerLogo" src={nuggetTransparent} alt="Logo" />
          <h1>Nugget</h1>
        </button>
      </LinkContainer>

      {isAuthenticated && <button className="nav-link" onClick={handleLogout}>Log out</button>

      // {isAuthenticated
      //   ? <button className="nav-link" onClick={handleLogout}>Log out</button>
      //   : <>
      // <LinkContainer to="/login">
      //   <button className="nav-link">Login</button>
      // </LinkContainer>
      // <LinkContainer to="/register">
      //   <button className="nav-link">Register</button>
      // </LinkContainer>
      // </>
    }

    </header>
  );
}

export default Header;
