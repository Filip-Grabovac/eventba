export const closeModalOnEsc = (setState) => {
  const handleKeyPress = (e) => {
    if (e.key === "Escape") {
      setState(false);
    }
  };
  document.addEventListener("keydown", handleKeyPress);
  return () => {
    document.removeEventListener("keydown", handleKeyPress);
  };
};
