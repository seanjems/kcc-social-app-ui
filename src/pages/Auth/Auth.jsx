import React, { useContext, useState } from "react";
import "./Auth.css";
import { Navigate } from "react-router-dom";

import Logo from "../../img/logo.png";
import AuthContext from "../../auth/context";
import testingApi from "../../api/testingApi";

const Auth = (props) => {
  const userContext = useContext(AuthContext);
  const [hasAccount, setHasAccount] = useState(true);
  const Login = () => {
    const handleLogin = () => {
      <Navigate to="/home" />;
    };

    const handleFetchPosts = async () => {
      console.log("we are here .. ");
      const response = await testingApi.getPosts();
      console.log(response.data);
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
                type="password"
                name="password"
                placeholder="Password"
                className="formInput"
              />
            </div>
            <span onClick={() => setHasAccount(!hasAccount)}>
              Don't have an account? Signup
            </span>

            <button
              className="button sign-button"
              onClick={(e) => {
                e.preventDefault();
                //fetchPosts();
                //handleFetchPosts();
                userContext.setIsLoggedIn(true);
                localStorage.setItem("isLoggedIn", true);
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
        <div className="inputForm">
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
                type="password"
                name="password"
                placeholder="Password"
                className="formInput"
              />
              <input
                type="password"
                name="confirmpass"
                placeholder="Confirm Password"
                className="formInput"
              />
            </div>
            <span onClick={() => setHasAccount(!hasAccount)}>
              Already have an account? Login
            </span>

            <button className="button sign-button">Signup</button>
          </form>
        </div>
      </>
    );
  };
  return (
    <div className="Auth">
      <div className="a-left">
        <img src={Logo} alt="" />
        <div>
          <h1>SDA Kcc social</h1>
          <span>Connect and share with your church memebers all the time.</span>
        </div>
      </div>
      <div className="a-right">{hasAccount ? <Login /> : <SignUp />}</div>
    </div>
  );
};

export default Auth;
