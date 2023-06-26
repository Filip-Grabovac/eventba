import { configureStore } from "@reduxjs/toolkit";
import { ticketReducer } from "./ticketSlice";
import { userReducer } from "./userSlice";

export const store = configureStore({
  reducer: {
    userState: userReducer,
    ticketState: ticketReducer,
  },
});
