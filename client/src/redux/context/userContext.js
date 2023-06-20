import { createStore } from "redux";

// Define initial state
const initialState = {
  user: {
    id: "",
    email: "",
  },
};

// Define reducer function
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: {
          id: action.payload.id,
        },
      };
    case "CLEAR_USER":
      return {
        ...state,
        user: {
          id: "",
        },
      };
    default:
      return state;
  }
};

// Create the Redux store
const store = createStore(userReducer);

export default store;
