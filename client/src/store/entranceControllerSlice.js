const { createSlice } = require("@reduxjs/toolkit");

const entranceControllerSlice = createSlice({
  name: "entranceController",
  initialState: { entranceController: "" },
  reducers: {
    setUserID(state, action) {
      return { ...state, entranceController: action.payload };
    },
  },
});

export const { setUserID } = entranceControllerSlice.actions;

export const entranceControllerReducer = entranceControllerSlice.reducer;
