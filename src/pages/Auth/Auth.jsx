import React, { useContext, useState } from "react";
import "./Auth.css";
import { Navigate } from "react-router-dom";

import Logo from "../../img/logo.png";
import AuthContext from "../../auth/context";
import testingApi from "../../api/testingApi";

import authorization from "../../api/authorization";

import { Formik, Form } from "formik";
import jwtDecode from "jwt-decode";
import * as Yup from "yup";
import ErrorTextComponent from "../../components/Reusables/ErrorTextComponent";

//validationObjects
const createUserFormValidation = Yup.object().shape({
  emailAddress: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
  confirmpass: Yup.string()
    .required()
    .min(4)
    .label("Confirm password")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
  surname: Yup.string().required().min(3).max(15).label("Lastname"),
  name: Yup.string().required().min(3).max(15).label("Firstname"),
});

const loginFormValidation = Yup.object().shape({
  userNameOrEmailAddress: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

const Auth = (props) => {
  const userContext = useContext(AuthContext);
  const [hasAccount, setHasAccount] = useState(true);
  const [accountCreated, setAccountCreated] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);

  const handleCreateUser = async ({
    appName,
    password,
    emailAddress,
    userName,
    name,
    surname,
  }) => {
    //set username
    setAccountCreated(false);
    userName = `${name}${surname}`;
    appName = "sdakcc_React";
    console.log(appName, password, emailAddress, userName, name, surname);
    ////validate passwords
    // const result = await authorization.tryCreateUser(
    //   appName,
    //   password,
    //   emailAddress,
    //   userName,
    //   name,
    //   surname
    // );

    //set notification on success
    setHasAccount(true);
    setAccountCreated(true);
  };

  const handleLogin = async ({ userNameOrEmailAddress, password }) => {
    setLoginFailed(false);
    setAccountCreated(false);
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
    return (
      <>
        <div className="inputForm">
          <Formik
            initialValues={{ userNameOrEmailAddress: "", password: "" }}
            onSubmit={(values) => {
              handleLogin(values);
            }}
            validationSchema={loginFormValidation}
          >
            {({
              handleChange,
              handleSubmit,
              errors,
              setFieldTouched,
              touched,
            }) => (
              <Form>
                <ErrorTextComponent
                  error="Account creation successfull"
                  visible={accountCreated}
                  greenMessage={true}
                />
                <h2>Login</h2>

                <ErrorTextComponent
                  error="Invalid Username and/or Password"
                  visible={loginFailed}
                />

                <div>
                  <input
                    type="text"
                    placeholder="Username"
                    onBlur={() => setFieldTouched("userNameOrEmailAddress")}
                    className="formInput"
                    onChange={handleChange("userNameOrEmailAddress")}
                  />
                </div>

                <ErrorTextComponent
                  error={errors.userNameOrEmailAddress}
                  visible={touched.userNameOrEmailAddress}
                />

                <div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onBlur={() => setFieldTouched("password")}
                    className="formInput"
                    onChange={handleChange("password")}
                  />
                </div>
                <ErrorTextComponent
                  error={errors.password}
                  visible={touched.password}
                />

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
          <Formik
            initialValues={{
              appName: "",
              password: "",
              emailAddress: "",
              userName: "",
              name: "",
              surname: "",
              confirmpass: "",
            }}
            onSubmit={(values) => {
              handleCreateUser(values);
            }}
            validationSchema={createUserFormValidation}
          >
            {({
              handleChange,
              handleSubmit,
              errors,
              setFieldTouched,
              touched,
            }) => (
              <Form>
                <h2>Sign up</h2>
                <div>
                  <input
                    type="text"
                    onChange={handleChange("name")}
                    placeholder="FirstName"
                    className="formInput"
                    onBlur={() => setFieldTouched("name")}
                  />

                  <input
                    type="text"
                    onChange={handleChange("surname")}
                    placeholder="Last name"
                    className="formInput"
                    onBlur={() => setFieldTouched("surname")}
                  />
                </div>
                <div>
                  <ErrorTextComponent
                    error={errors.name}
                    visible={touched.name}
                  />

                  <ErrorTextComponent
                    error={errors.surname}
                    visible={touched.surname}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    onChange={handleChange("emailAddress")}
                    placeholder="Email"
                    className="formInput"
                  />
                </div>
                <ErrorTextComponent
                  error={errors.userName}
                  visible={touched.userName}
                />
                <div>
                  <input
                    type="password"
                    onChange={handleChange("password")}
                    placeholder="Password"
                    className="formInput"
                  />
                  <input
                    type="password"
                    onChange={handleChange("confirmpass")}
                    placeholder="Confirm Password"
                    className="formInput"
                  />
                </div>
                <div>
                  <ErrorTextComponent
                    error={errors.password}
                    visible={touched.password}
                  />

                  <ErrorTextComponent
                    error={errors.confirmpass}
                    visible={touched.confirmpass}
                  />
                </div>
                <span onClick={() => setHasAccount(!hasAccount)}>
                  Already have an account? Login
                </span>

                <button
                  className="button sign-button"
                  type="submit"
                  onSubmit={handleSubmit}
                >
                  Signup
                </button>
              </Form>
            )}
          </Formik>
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
