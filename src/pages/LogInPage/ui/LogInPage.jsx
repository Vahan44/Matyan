import React, { useState, useEffect } from "react";
import styles from "./LogInPage.module.css";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { logIn } from "./LogIn.js";
import { useSelector } from "react-redux";
import { FaBookOpen } from "react-icons/fa"

const LogInPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const Employee = useSelector((state) => state.Employee);



  const handleLogin = async () => {
    const response = await logIn(dispatch, { username, password });
    if (response.success) {
      navigate("/");
    } else {
      setError(response.message);
    }
   };

   const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div onKeyDown={handleKeyDown} className={styles.container}>
      <h1>
        Մատյան
              <FaBookOpen style={{marginLeft: "5p", marginBottom: '-5px', fontSize: '28px'}}/>
      </h1>
      <div className={styles.body}>
        <h4>Մուտք գործեք շարունակելու համար</h4>

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
          Մուտք գործել
        </button>
      </div>
    </div>
  );
};

export default LogInPage;
