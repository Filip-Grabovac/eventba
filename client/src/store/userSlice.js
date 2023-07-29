const { createSlice } = require('@reduxjs/toolkit');

const userSlice = createSlice({
  name: 'user',
  initialState: { user: '' },
  reducers: {
    setUserID(state, action) {
      return { ...state, user: action.payload };
    },
  },
});

export const { setUserID } = userSlice.actions;

export const userReducer = userSlice.reducer;
