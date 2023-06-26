const setTicket = (
  state = { name: "", lname: "", email: "", price: "", area: "", seat: "" },
  action
) => {
  switch (action.type) {
    case "SET_TICKET":
      return action.payload;
    default:
      return state;
  }
};

export default setTicket;
