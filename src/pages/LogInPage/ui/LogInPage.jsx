import React, { useState, useEffect } from "react";
import { SiTrello } from "react-icons/si";
import styles from "./LogInPage.module.css";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { logIn } from "./LogIn.js";
import { useSelector } from "react-redux";

const LogInPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const Employee = useSelector((state) => state.Employee);


   

  const handleLogin = async () => {
    const response = await logIn(dispatch, { username, password });
     console.log(Employee)
    if (response.success) {
      navigate("/MainPage");
    } else {
      setError(response.message);
    }
   };

  return (
    <div className={styles.container}>
      <h1>
        <SiTrello /> Trello
      </h1>
      <div className={styles.body}>
        <h4>Log in to continue</h4>

        {error && <p className={styles.error}>{error}</p>}

        <input
          className={styles.email_input}
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className={styles.email_input}
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className={styles.button} onClick={handleLogin}>
          Log in
        </button>
      </div>
    </div>
  );
};

export default LogInPage;
