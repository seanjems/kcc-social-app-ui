import React, { useContext, useState } from "react";
import "./Auth.css";
import { Navigate } from "react-router-dom";

import Logo from "../../img/logo.png";
import AuthContext from "../../auth/context";
import testingApi from "../../api/testingApi";

import authorization from "../../api/authorization";

import { Formik, Form } from "formik";
import jwtDecode from "jwt-decode";

const Auth = (props) => {
  const userContext = useContext(AuthContext);
  const [hasAccount, setHasAccount] = useState(true);

  const [loginFailed, setLoginFailed] = useState(false);

  const handleLogin = async ({ userNameOrEmailAddress, password }) => {
    setLoginFailed(false);
    const result = await authorization.tryLogin(
      userNameOrEmailAddress,
      password
    );

    if (!result.ok) return setLoginFailed(true);
    //console.log(result.data.token);
    const user = jwtDecode(result.data.token);

    const cleanItem = JSON.parse(user.user);
    //console.log(cleanItem);
    userContext.setUser(cleanItem);
    localStorage.setItem("token", result.data.token);
    //console.log("from cache", localStorage.getItem("token"));
  };

  const Login = () => {
    // const handleLogin = () => {
    //   <Navigate to="/home" />;
    // };

    // const handleFetchPosts = async () => {
    //   console.log("we are here .. ");
    //   const response = await testingApi.getPosts();
    //   console.log(response.data);
    // };

    return (
      <>
        <div className="inputForm">
          <Formik
            initialValues={{ userNameOrEmailAddress: "", password: "" }}
            onSubmit={(values) => {
              handleLogin(values);
            }}
          >
            {({ handleChange, handleSubmit }) => (
              <Form>
                <h2>Login</h2>

                <span
                  style={
                    loginFailed
                      ? { display: "block", color: "red" }
                      : { display: "none" }
                  }
                >
                  Invalid Username and/or Password
                </span>
                <div>
                  <input
                    type="text"
                    placeholder="Username"
                    className="formInput"
                    onChange={handleChange("userNameOrEmailAddress")}
                  />
                </div>
                <div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="formInput"
                    onChange={handleChange("password")}
                  />
                </div>
                <span onClick={() => setHasAccount(!hasAccount)}>
                  Don't have an account? Signup
                </span>

                <button
                  className="button sign-button"
                  type="submit"
                  onSubmit={handleSubmit}
                >
                  Login
                </button>
              </Form>
            )}
          </Formik>
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
