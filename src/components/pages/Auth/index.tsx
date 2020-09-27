/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState, useContext, useEffect } from "react";
// @ts-ignore
import useFormBee from "useformbee";
import "./styles.scss";
import { RouteChildrenProps } from "react-router-dom";
import Form from "../../ui/Form";
import firebaseApp from "../../../configs/firebase";
import { UserContext, ActionType } from "../../../contexts/User";
import LoadingSpinner from "../../ui/LoadingSpinner";

const rules: EmailAndPassword = {
  email: "required|email",
  password: "required|string",
};

const AuthPage = ({
  history,
  location,
}: RouteChildrenProps<any, { referrer: string }>) => {
  const [serverError, setServerError] = useState<string>("");
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, dispatch } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      if (location.state) {
        history.push(location.state.referrer);
      } else {
        history.push("/");
      }
    }
  }, [history, location.state, user]);

  const handleError = (error: any) => {
    const errorCode = error.code;
    const errorMessage = error.message;

    switch (errorCode) {
      case "auth/email-already-in-use":
      case "auth/weak-password":
        setServerError(errorMessage);
        break;
      case "auth/wrong-password":
      case "auth/user-not-found":
        setServerError("Invalid credentials.");
        break;
      case "auth/user-disabled":
        setServerError("User is disabled");
        break;
      default:
        setServerError("An error occured, please try again");
        console.error(error);
    }
  };

  const signup = async ({ email, password, username }: EmailAndPassword) => {
    setServerError("");
    setLoading(true);
    try {
      const {
        user: newUser,
      } = await firebaseApp
        .auth()
        .createUserWithEmailAndPassword(email, password);

      if (newUser) {
        await newUser.updateProfile({
          displayName: username,
        });
        dispatch({ type: ActionType.LOGIN_USER, payload: { user: newUser } });
      }

      handleReset();
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        setServerError(error.message);
      } else {
        handleError(error);
      }
    }
    setLoading(false);
  };

  const login = async ({ email, password }: EmailAndPassword) => {
    setServerError("");
    setLoading(true);
    try {
      await firebaseApp.auth().signInWithEmailAndPassword(email, password);
      handleReset();
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        setServerError("Invalid credentials.");
      } else {
        handleError(error);
      }
    }
    setLoading(false);
  };

  const {
    values,
    handleChange,
    handleSubmit,
    errors,
    handleReset,
  } = useFormBee({
    callback: !toggle ? login : signup,
    rules,
  });

  const inputProps = [
    {
      label: "Email",
      errMsg: errors.email,
      value: values.email,
      onChange: handleChange,
      required: true,
      name: "email",
      type: "email",
      placeholder: "Johndoe@mock.com",
      disabled: loading,
    },
    {
      label: "Password",
      value: values.password,
      errMsg: errors.password,
      onChange: handleChange,
      name: "password",
      type: "password",
      placeholder: "*******",
      disabled: loading,
    },
  ];

  return (
    <main className="authPage">
      <div>
        <div>
          <h1>{!toggle ? "Welcome Back" : "Create Your Account"}</h1>
          <Form
            error={serverError}
            onSubmit={handleSubmit}
            submitLbl={!toggle ? "Sign in" : "Sign up"}
            inputs={inputProps}
            disabled={loading}
          />
          <div className="toggle">
            <p>{!toggle ? "Don't have an account?" : "Have an account?"}</p>
            <button onClick={() => setToggle(!toggle)} type="button">
              {!toggle ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
        {loading ? (
          <div className="loading">
            <LoadingSpinner
              textStyle={{ color: "white", fontWeight: "bold" }}
              text={!toggle ? "Authenticating" : "Creating account"}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
};

type EmailAndPassword = {
  email: string;
  password: string;
  username?: string;
};

export default AuthPage;
