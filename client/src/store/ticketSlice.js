const { createSlice } = require("@reduxjs/toolkit");

const ticketSlice = createSlice({
  name: "ticket",
  initialState: {
    name: "",
    lname: "",
    email: "",
    price: 0,
  },
  reducers: {
    add(state, action) {
      console.log(action.payload);
    },
    remove() {},
  },
});

export const { add, remove } = ticketSlice.actions;

export const ticketReducer = ticketSlice.reducer;
