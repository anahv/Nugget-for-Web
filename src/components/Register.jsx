import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import Button from "@material-ui/core/Button";
// import CircularProgress from "@material-ui/core/CircularProgress";
import LinearProgress from "@material-ui/core/LinearProgress";
import { register } from "../api/api";
import AppContext from "../libs/contextLib";
import googleWhite from "./googleWhite.svg";

function Register() {
  const history = useHistory();

  const { setIsAuthenticated, setUserId } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [fields, setFields] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });

  function validateForm() {
    return (
      fields.username.match(/[\w-]+@([\w-]+\.)+[\w-]+/) &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFields(prevValues => {
      return {
        ...prevValues,
        [name]: value
      };
    });
  }

  async function handleSubmit(event) {
    setIsLoading(true);
    event.preventDefault();
    try {
      await register(fields).then(res => {
        if (res.data.error) {
          setError(res.data.error.message);
          return;
        }
        setUserId(res.data.id);
        setIsAuthenticated(true);
        history.push("/");
      });
    } catch (error) {
      console.log(error.message);
      setIsLoading(false);
    }
  }

  return (
    <div>
      {isLoading && <LinearProgress />}
      <div className="container mt-5 signup">
        <h1>Welcome!</h1>
        <div className="row">
          <div className="col-sm-7">
            <div className="card">
              <div className="card-body">
                <form>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      value={fields.username}
                      type="email"
                      className="form-control"
                      name="username"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      value={fields.password}
                      type="password"
                      onChange={handleChange}
                      className="form-control"
                      name="password"
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm password</label>
                    <input
                      value={fields.confirmPassword}
                      type="password"
                      onChange={handleChange}
                      className="form-control"
                      name="confirmPassword"
                    />
                  </div>

                  <Button
                    onClick={handleSubmit}
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!validateForm()}
                  >
                    Sign up{" "}
                  </Button>
                  {error !== "" && <p id="error">{error}</p>}
                  <p>
                    Already have an account?{" "}
                    <LinkContainer to="/login">
                      <button className="link">Log in here.</button>
                    </LinkContainer>
                  </p>
                </form>
              </div>
            </div>
          </div>

          <div className="col-sm-5">
            <div className="card social-block">
              <div className="card-body">
                <a
                  className="btn btn-block btn-social btn-google"
                  role="button"
                  href="http://nuggetapp.herokuapp.com/user/auth/google"
                >
                  <img
                    className="btn-social-icon"
                    src={googleWhite}
                    alt="Google icon"
                  />
                  Sign up with Google
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
