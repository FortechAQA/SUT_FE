import React, { useEffect, useState, useContext } from "react";
import axios, { Axios } from "axios";
import DispatchContext from "../DispatchContext";

function HeaderLoggedOut() {
  const appDispatch = useContext(DispatchContext);

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post("/login", { username, password });
      if (response.data) {
        console.log(response.data);

        appDispatch({
          type: "login",
          data: response.data
        });
      } else {
        console.log("Bad credentials.");
      }
    } catch (e) {
      console.log(e.response.data);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0" data-cy="login-form">
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            id="username"
            onChange={e => {
              setUsername(e.target.value);
            }}
            name="username"
            className="form-control form-control-sm input-dark"
            type="text"
            placeholder="Username"
            autoComplete="off"
            data-cy="username"
          />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            id="password"
            onChange={e => {
              setPassword(e.target.value);
            }}
            name="password"
            className="form-control form-control-sm input-dark"
            type="password"
            placeholder="Password"
            data-cy="password"
          />
        </div>
        <div className="col-md-auto">
          <input type="checkbox" data-cy="remember-me" />
          <span>Remember me</span>
          <button id="login-submit" className="btn btn-success btn-sm" data-cy="submit">
            Sign In
          </button>
        </div>
      </div>
    </form>
  );
}

export default HeaderLoggedOut;
