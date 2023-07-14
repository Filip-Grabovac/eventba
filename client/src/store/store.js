import { configureStore } from "@reduxjs/toolkit";
import { ticketReducer } from "./ticketSlice";
import { userReducer } from "./userSlice";
import { entranceControllerReducer } from "./entranceControllerSlice";

export const store = configureStore({
  reducer: {
    userState: userReducer,
    ticketState: ticketReducer,
    entranceControllerState: entranceControllerReducer,
  },
});
