const { createSlice } = require("@reduxjs/toolkit");

const userSlice = createSlice({
  name: "user",
  initialState: { user: "", token: "" },
  reducers: {
    setUserID(state, action) {
      return { ...state, user: action.payload };
    },
    setToken(state, action) {
      return { ...state, token: action.payload };
    },
  },
});

export const { setUserID, setToken } = userSlice.actions;

export const userReducer = userSlice.reducer;
