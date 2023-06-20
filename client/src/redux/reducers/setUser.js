const setUser = (state = "", action) => {
  switch (action.type) {
    case "SETUSER":
      return action.payload;
    default:
      return state;
  }
};

export default setUser;
