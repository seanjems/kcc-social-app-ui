import React, { useEffect, useState } from "react";
import "./Auth.css";
import { Navigate } from "react-router-dom";

import Logo from "../../img/logo.png";

const Auth = (props) => {
  useEffect(() => {}, []);
  return (
    <div className="Auth">
      <div className="a-left">
        <img src={Logo} alt="" />
        <div>
          <h1>SDA Kcc social</h1>
          <span>Connect and share with your church memebers all the time.</span>
        </div>
      </div>
      <div className="a-right">
        <Login />
      </div>
    </div>
  );
};

const Login = () => {
  const handleLogin = () => {
    <Navigate to="/home" />;
  };
  return (
    <>
      <div className="inputForm">
        <form>
          <h2>Login</h2>

          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="formInput"
            />
          </div>
          <div>
            <input
              type="text"
              name="password"
              placeholder="Password"
              className="formInput"
            />
          </div>
          <span>Don't have an account? Signup</span>

          <button
            className="button sign-button"
            onClick={() => {
              handleLogin();
            }}
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
};

const SignUp = () => {
  return (
    <>
      <div className="signupForm">
        <form action="submit">
          <h2>Sign up</h2>
          <div>
            <input
              type="text"
              name="firstname"
              placeholder="FirstName"
              className="formInput"
            />
            <input
              type="text"
              name="lastname"
              placeholder="Last name"
              className="formInput"
            />
          </div>
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="formInput"
            />
          </div>
          <div>
            <input
              type="text"
              name="password"
              placeholder="Password"
              className="formInput"
            />
            <input
              type="text"
              name="confirmpass"
              placeholder="Confirm Password"
              className="formInput"
            />
          </div>
          <span>Already have an account? Login</span>

          <button className="button sign-button">Signup</button>
        </form>
      </div>
    </>
  );
};

export default Auth;
