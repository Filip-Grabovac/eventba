import { createSlice } from "@reduxjs/toolkit";

const loginSlice = createSlice({
  name: "login",
  initialState: { isLoginOpen: false },
  reducers: {
    setLoginIsOpen: (state, action) => {
      state.isLoginOpen = action.payload;
    },
  },
});

export const { setLoginIsOpen } = loginSlice.actions;
export const loginReducer = loginSlice.reducer;
