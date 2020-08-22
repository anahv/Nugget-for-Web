import React, { useContext, useState, useEffect } from "react";
import nuggetTransparent from "./nuggetTransparent2.png";
import { LinkContainer } from "react-router-bootstrap";
import AppContext from "../libs/contextLib";
import { useHistory } from "react-router-dom";
import AddAlertIcon from "@material-ui/icons/AddAlert";

import { logout } from "../api/api";

// import SearchBar from "./SearchBar"
// <SearchBar filterNuggets={props.filterNuggets} fetchNuggets={props.fetchNuggets}/>

function Header(props) {
  const history = useHistory();
  const { isAuthenticated, setIsAuthenticated, setUserId } = useContext(
    AppContext
  );

  function handleLogout() {
    logout();
    setIsAuthenticated(false);
    setUserId("");
    history.push("/login");
  }

  const [
    browserSupportsNotifications,
    setBrowserSupportsNotifications
  ] = useState(false);

  const [userAllowsNotifications, setUserAllowsNotifications] = useState(false);

  function isPushNotificationSupported() {
    setBrowserSupportsNotifications(
      // "serviceWorker" in navigator && "PushManager" in window
      "Notification" in window
    );
  }

  useEffect(
    () => {
      isPushNotificationSupported();
      askUserPermission();
      console.log(
        "Browser supports notifications: " + browserSupportsNotifications
      );
      console.log("user accepted notifications: " + userAllowsNotifications);
    },
    [browserSupportsNotifications]
  );

  async function askUserPermission() {
    const permission = await Notification.requestPermission();
    setUserAllowsNotifications(permission);
    console.log(permission);
    return permission;
  }

  function showNotification() {
    new Notification("Hello!")
  }

  return (
    <header>
      <LinkContainer to="/">
        <button className="no-format-button">
          <img id="headerLogo" src={nuggetTransparent} alt="Logo" />
          <h1>Nugget</h1>
        </button>
      </LinkContainer>

      {isAuthenticated && (
        <button className="nav-link" onClick={handleLogout}>
          Log out
        </button>
      )}

      {isAuthenticated &&
        browserSupportsNotifications &&
        userAllowsNotifications !== "granted" && (
          <button
            className="nav-link"
            onClick={askUserPermission}
            id="enableNotifications"
          >
            <AddAlertIcon />
          </button>
        )}

        {isAuthenticated &&
          browserSupportsNotifications &&
          userAllowsNotifications === "granted" && (
            <button
              className="nav-link"
              onClick={showNotification}
            >
              <AddAlertIcon />Test
            </button>
          )}

    </header>
  );
}

export default Header;
