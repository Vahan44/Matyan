import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
};

export const autoLogIn = createAsyncThunk(
  "user/autoLogin",
  async () => {
      let userData = JSON.parse(localStorage.getItem("user") || "null");
      if (!userData) {
          throw new Error("No user found");
      }
      return userData;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user"); // Ջնջում է user-ը
    },
  },
  extraReducers: (builder) => {
    builder.addCase(autoLogIn.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(autoLogIn.rejected, (state) => {
      state.user = null;
      state.isAuthenticated = false;
    });
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
