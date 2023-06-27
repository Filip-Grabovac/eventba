const { createSlice } = require("@reduxjs/toolkit");

const ticketSlice = createSlice({
  name: "ticket",
  initialState: {
    ticketList: [{ id: 1, name: "", lname: "", email: "", price: 0 }],
    totalAmount: 0,
  },
  reducers: {
    addTicket(state, action) {
      const newTicket = action.payload;

      // Check if the newTicket ID already exists in the ticketList
      const existingTicketIndex = state.ticketList.findIndex(
        (ticket) => ticket.id === newTicket.id
      );

      if (existingTicketIndex !== -1) {
        // Update the existing ticket
        const updatedTicketList = [...state.ticketList];
        updatedTicketList[existingTicketIndex] = {
          ...updatedTicketList[existingTicketIndex], // Keep the existing properties
          name: newTicket.name,
          lname: newTicket.lname,
          email: newTicket.email,
        };

        // Calculate the total amount based on the updated ticketList
        const total = updatedTicketList.reduce(
          (sum, ticket) => sum + ticket.price,
          0
        );

        return { ...state, totalAmount: total, ticketList: updatedTicketList };
      }

      // If the ticket does not exist, proceed with adding it to the ticketList
      const updatedTicketList = [...state.ticketList, newTicket];
      const total = state.totalAmount + newTicket.price;

      return { ...state, totalAmount: total, ticketList: updatedTicketList };
    },
    removeLastTicket(state, action) {
      const deletingId = action.payload;

      // Find the index of the ticket to be deleted based on the provided ID
      const existingTicketIndex = state.ticketList.findIndex(
        (ticket) => ticket.id === deletingId.id
      );

      if (existingTicketIndex !== -1) {
        // Remove the ticket from the ticketList
        const updatedTicketList = [...state.ticketList];
        updatedTicketList.splice(existingTicketIndex, 1);

        // Calculate the new total amount based on the updated ticketList
        const total = updatedTicketList.reduce(
          (sum, ticket) => sum + ticket.price,
          0
        );

        return { ...state, totalAmount: total, ticketList: updatedTicketList };
      }

      // If the ticket with the provided ID does not exist, return the state as it is
      return state;
    },
    addTicketPrice(state, action) {
      const { seatPrice, ticketID } = action.payload;

      // Find the index of the ticket to update based on the provided ticketID

      const ticketIndex = state.ticketList.findIndex(
        (ticket) => ticket.id === ticketID
      );

      if (ticketIndex !== -1) {
        // Update the seat price for the ticket
        const updatedTicketList = [...state.ticketList];
        updatedTicketList[ticketIndex] = {
          ...updatedTicketList[ticketIndex],
          price: seatPrice,
        };

        // Calculate the new total amount based on the updated ticketList
        const total = updatedTicketList.reduce(
          (sum, ticket) => sum + ticket.price,
          0
        );

        return { ...state, totalAmount: total, ticketList: updatedTicketList };
      }

      // If the ticket with the provided ID does not exist, return the state as it is
      return state;
    },
  },
});

export const { addTicket, removeLastTicket, addTicketPrice } =
  ticketSlice.actions;
export const ticketReducer = ticketSlice.reducer;
