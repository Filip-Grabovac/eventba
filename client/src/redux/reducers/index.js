import setUser from "./setUser";
import { combineReducers } from "redux";

const allReducers = combineReducers({
  user: setUser,
});

export default allReducers;
