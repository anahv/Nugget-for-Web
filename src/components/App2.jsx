import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
// import CircularProgress from "./CircularProgress";
import { checkAuthentication } from "../api/api";

import AppContext from "../libs/contextLib";
import Routes from "../routes";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await checkAuthentication().then(res => {
        setIsAuthenticated(res.data.authenticated);
        setUserId(res.data.id);
        // checkNotifications()
      });
    } catch (e) {
      if (e !== "No current user") {
        alert(e);
      }
    }
    setIsAuthenticating(false);
  }

  return (
    !isAuthenticating && (
      <AppContext.Provider
        value={{ isAuthenticated, setIsAuthenticated, userId, setUserId }}
      >
        <Header />
        <Routes />
        <Footer />
      </AppContext.Provider>
    )
  );
}

export default App;
