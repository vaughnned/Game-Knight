import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import useLocalStorage from "./UseLocalStorage";
import jwt_decode from "jwt-decode";

const LoginComponent = () => {
  const [isValid, setIsValid] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [user, setUser, removeUser] = useLocalStorage("user");
  const navigate = useNavigate();

  const handleUsernameInput = (e) => {
    setUsername(e.target.value);
  };
  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
  };

  const handleLogIn = async (e) => {
    e.preventDefault();

    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    };

    const response = await fetch(
      "http://localhost:8000/dj-rest-auth/login/",
      options
    ).catch((error) => {
      console.error("THIS ISNT WORKING", error);
    });

    const data = await response.json();
    if (!response.ok) {
      alert("Incorrect username or password");
    } else {
      console.log(data, "DATA");
      // const token = data.token;
      // const decodedToken = jwt_decode(token);
      // console.log(decodedToken);
      setUser({
        firstName: username,
        email: "username@example.com",
        token: data.key,
      });
      Cookies.set("Authorization", `Token ${data.key}`);
      setIsValid(true);
      navigate("/");
    }

    // if login is valid
  };
  return (
    <div id="login-page">
      <Header />
      <section id="login-form">
        <h1>Login</h1>
        <form className="login-inputs" onSubmit={handleLogIn}>
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => handleUsernameInput(e)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => handlePasswordInput(e)}
          />
          <div id="sign-in">
            <input id="submit-button" type="submit" />|
            <a className="sign-up" href="/register">
              Sign Up
            </a>
          </div>
        </form>
      </section>
    </div>
  );
};

export default LoginComponent;