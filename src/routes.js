import React, {useContext} from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Dashboard from "./components/Dashboard"
import NotFound from "./components/NotFound";
import Login from "./components/Login"
import Register from "./components/Register"
import AppContext from "./libs/contextLib"

export default function Routes() {
  const { isAuthenticated } = useContext(AppContext);
  return (
    <Switch>
      <Route exact path="/">
        {isAuthenticated ? <Dashboard /> : (
          <Redirect to={"/login"}/>
        )}
      </Route>
      <Route exact path="/login">
      {!isAuthenticated ? <Login /> : (
        <Redirect to={"/"}/>
      )}
      </Route>
      <Route exact path="/register">
      {!isAuthenticated ? <Register /> : (
        <Redirect to={"/"}/>
      )}
      </Route>
      {/* Finally, catch all unmatched routes */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
