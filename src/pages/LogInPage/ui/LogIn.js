import axios from "axios";
import { setUser } from "../../../Redux/userSlice";

export const logIn = async (dispatch, credentials) => {
  try {
    const response = await axios.post("http://localhost:5000/api/auth/login", credentials);
    dispatch(setUser( response.data.user )); // Պահում ենք ամբողջ user օբյեկտը
    localStorage.setItem("user", JSON.stringify(response.data.user))
    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: error.response?.data?.message || "Login failed" };
  }
  
};
