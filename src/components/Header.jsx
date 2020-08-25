import React, { useContext, useState, useEffect } from "react";
import nuggetTransparent from "./nuggetTransparent2.png";
import { LinkContainer } from "react-router-bootstrap";
import AppContext from "../libs/contextLib";
import { useHistory } from "react-router-dom";
import AddAlertIcon from "@material-ui/icons/AddAlert";
// import Notification from "react-web-notification"

import { logout, checkReminders } from "../api/api";

// import SearchBar from "./SearchBar"
// <SearchBar filterNuggets={props.filterNuggets} fetchNuggets={props.fetchNuggets}/>

function Header(props) {
  const history = useHistory();
  const { isAuthenticated, setIsAuthenticated, setUserId, userId } = useContext(
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
    },
    [browserSupportsNotifications, userAllowsNotifications]
  );

  async function askUserPermission() {
    const permission = await Notification.requestPermission();
    setUserAllowsNotifications(permission);
    return permission;
  }

  function showNotification() {
    const options = {
      body: "Hello test body",
      icon: nuggetTransparent
    };
    new Notification("Hello!", options);
  }

  // chrome://flags/ Enable native notifications > Disabled

  function checkNotifications() {
    const now = new Date();
    const minuteCheck = now.getMinutes();
    const hourCheck = now.getHours();
    const dayCheck = now.getDate();
    const monthCheck = now.getMonth();
    const yearCheck = now.getFullYear();

    const payload = { minuteCheck, hourCheck, dayCheck, monthCheck, yearCheck };

    checkReminders(userId, payload).then(res => {
      console.log(res.data);
      console.log("checked reminders");
    });
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

      {
        // {isAuthenticated &&
        //   browserSupportsNotifications &&
        //   userAllowsNotifications !== "granted" && (
        //     <button
        //       className="nav-link"
        //       onClick={askUserPermission}
        //       id="enableNotifications"
        //     >
        //       <AddAlertIcon />
        //     </button>
        //   )}
        //
        // {isAuthenticated &&
        //   browserSupportsNotifications &&
        //   userAllowsNotifications === "granted" && (
        //     <button
        //       className="nav-link"
        //       onClick={showNotification}
        //     >
        //       Test
        //     </button>
        //   )}
        //
        //   {isAuthenticated &&
        //     browserSupportsNotifications &&
        //     userAllowsNotifications === "granted" && (
        //       <button
        //         className="nav-link"
        //         onClick={checkNotifications}
        //       >
        //         Retrieve reminders
        //       </button>
        //     )}
      }
    </header>
  );
}

export default Header;
