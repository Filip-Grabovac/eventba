export const setUser = (id, email) => {
  return {
    type: "SET_USER",
    payload: { id },
  };
};

export const clearUser = () => {
  return {
    type: "CLEAR_USER",
  };
};
