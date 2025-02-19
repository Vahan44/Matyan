import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import boardsSlice from "./boardsSlice";
import scheduleReducer from "./SheduleSlice";
//import blogSlice from "./blogSlice";

export const store = configureStore({
    reducer: {
        user: userSlice ,
        boards: boardsSlice,
        schedule: scheduleReducer,
    }
});
