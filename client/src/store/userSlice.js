const { createSlice } = require("@reduxjs/toolkit");

const userSlice = createSlice({
  name: "user",
  initialState: { user: "" },
  reducers: {
    setUserID(state, action) {
      console.log(action.payload);
      return action.payload;
    },
  },
});

export const { setUserID } = userSlice.actions;

export const userReducer = userSlice.reducer;
