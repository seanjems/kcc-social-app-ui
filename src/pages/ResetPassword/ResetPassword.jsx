import React, { useContext, useState } from "react";
import "./Auth.css";

import AuthContext from "../../auth/context";
import Logo from "../../img/logo.png";

import authorization from "../../api/authorization";

import { Form, Formik } from "formik";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import ErrorTextComponent from "../../components/Reusables/ErrorTextComponent";
import { useEffect } from "react";
import { showNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons";

//validationObjects
const resetUserFormValidation = Yup.object().shape({
  emailAddress: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
  confirmpass: Yup.string()
    .required()
    .min(4)
    .label("Confirm password")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const ResetPassword = (props) => {
  const userContext = useContext(AuthContext);
  const [accountCreated, setAccountCreated] = useState(false);
  const [createUserFailed, setCreateUserFailed] = useState(false);
  const [createUserErrors, setCreateUserErrors] = useState([]);
  const [token, setToken] = useState();

  let { resettoken } = useParams();
  // console.log(
  //   "🚀 ~ file: ResetPassword.jsx:32 ~ ResetPassword ~ useParams()",
  //   useParams()
  // );
  useEffect(() => {
    setToken(resettoken);
  }, []);
  console.log(
    "🚀 ~ file: ResetPassword.jsx:41 ~ useEffect ~ resettoken",
    resettoken
  );

  const mobile = window.innerWidth <= 768 ? true : false;

  const handleResetPassword = async (createUserInput) => {
    var { password, emailAddress } = createUserInput;
    //set username
    setAccountCreated(false);
    setCreateUserErrors([]);
    setCreateUserFailed(false);
    console.log("ready to dispatch create", password, emailAddress, token);
    //validate passwords
    const result = await authorization.tryResetUserPassword(
      password,
      emailAddress,
      token
    );

    console.log("reset token result", result);
    console.log(
      "🚀 ~ file: ResetPassword.jsx:59 ~ handleResetPassword ~ result",
      result
    );
    if (!result.ok) {
      setCreateUserFailed(true);
      setCreateUserErrors(result.data);
      showNotification({
        id: "user-data",
        title: "Error",
        message: `${result.status && result.status} ${result.problem}`,
        autoClose: false,
        disallowClose: false,
        // style: { zIndex: "999999" },
      });
      return;
    }

    //set notification on success
    showNotification({
      id: "save-data",
      icon: <IconCheck size={16} />,
      title: "Password reset success",
      message: `Your password has been reset. You can go to homepage to login`,
      autoClose: false,
      disallowClose: false,
      style: { zIndex: "999999" },
    });
    setAccountCreated(true);
  };

  const ResetPasswordForm = () => {
    return (
      <>
        <div className="inputForm">
          <Formik
            initialValues={{
              password: "",
              emailAddress: "",
              confirmpass: "",
            }}
            onSubmit={(values) => {
              handleResetPassword(values);
            }}
            validationSchema={resetUserFormValidation}
          >
            {({
              handleChange,
              handleSubmit,
              errors,
              setFieldTouched,
              touched,
            }) => (
              <Form>
                {createUserFailed
                  ? createUserErrors &&
                    createUserErrors?.map((error, idx) => {
                      return (
                        <ErrorTextComponent
                          key={idx}
                          error={error.description}
                          visible={createUserFailed}
                        />
                      );
                    })
                  : ""}

                {mobile && (
                  <div className="validationsSmall">
                    <ErrorTextComponent
                      error={errors.password}
                      visible={touched.password}
                    />

                    <ErrorTextComponent
                      error={errors.confirmpass}
                      visible={touched.confirmpass}
                    />
                  </div>
                )}
                <h2>Reset your Password</h2>

                <div>
                  <input
                    type="text"
                    onChange={handleChange("emailAddress")}
                    placeholder="Email"
                    className="formInput"
                  />
                </div>
                {!mobile && (
                  <div className="validationsLarge">
                    <ErrorTextComponent
                      error={errors.emailAddress}
                      visible={touched.emailAddress}
                    />
                  </div>
                )}

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
                {!mobile && (
                  <div className="validationsLarge">
                    <ErrorTextComponent
                      error={errors.password}
                      visible={touched.password}
                    />

                    <ErrorTextComponent
                      error={errors.confirmpass}
                      visible={touched.confirmpass}
                    />
                  </div>
                )}

                <button
                  className="button sign-button"
                  type="submit"
                  onSubmit={handleSubmit}
                >
                  Reset Password
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

      <div className="a-right d-flex flex-column align-center">
        <ResetPasswordForm />
        <br />
        <br />
        <div>
          <a
            href="https://kampalacentraladventist.org"
            className="btn btn-primary btn-small align-self-centre"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
