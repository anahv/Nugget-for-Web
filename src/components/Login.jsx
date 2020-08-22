import React, { useState, useContext } from "react";
import { LinkContainer } from "react-router-bootstrap";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import AppContext from "../libs/contextLib";
import { useHistory } from "react-router-dom";
import { login } from "../api/api";
import googleWhite from "./googleWhite.svg";

function Login() {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAuthenticated, setUserId } = useContext(AppContext);
  const [error, setError] = useState("");

  function validateForm() {
    return username.match(/[\w-]+@([\w-]+\.)+[\w-]+/) && password.length > 0;
  }

  async function handleSubmit(event) {
    setIsLoading(true);
    event.preventDefault();
    const payload = { username, password };
    try {
      await login(payload).then(res => {
        if (res.data.error) {
          setError(res.data.error);
          return;
        }
        setUserId(res.data.id);
        setIsAuthenticated(true);
        history.push("/");
      });
    } catch (e) {
      console.log(e.message);
      setIsLoading(false);
    }
  }

  return (
    <div>
      {isLoading && <LinearProgress />}
      <div className="container mt-5 signup">
        <h1>Welcome back!</h1>

        <div className="row">
          <div className="col-sm-7">
            <div className="card">
              <div className="card-body">
                <form>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      value={username}
                      type="email"
                      className="form-control"
                      name="username"
                      onChange={event => setUsername(event.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      value={password}
                      type="password"
                      onChange={event => setPassword(event.target.value)}
                      className="form-control"
                      name="password"
                    />
                  </div>
                  <Button
                    onClick={handleSubmit}
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!validateForm()}
                  >
                    Log in{" "}
                  </Button>
                  {error !== "" && <p id="error">{error}</p>}
                  <p>
                    New to Nugget?{" "}
                    <LinkContainer to="/register">
                      <button className="link">Sign up here.</button>
                    </LinkContainer>
                  </p>
                </form>
              </div>
            </div>
          </div>

          <div className="col-sm-5">
            <div className="card">
              <div className="card-body">
                <a
                  className="btn btn-block btn-social btn-google"
                  href="http://nuggetapp.herokuapp.com/user/auth/google"
                  role="button">
                  <img
                    className="btn-social-icon"
                    src={googleWhite}
                    alt="Google icon"
                  />
                  Log in with Google
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

//within button tag:
// {isLoading && (
//   <CircularProgress
//     className={classes.root}
//     size={20}
//   />
// )}
