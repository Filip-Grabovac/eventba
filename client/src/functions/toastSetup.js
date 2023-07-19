export const toastSetup = (position, autoClose) => {
  const toastSetup = {
    position: position,
    autoClose: autoClose,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  return toastSetup;
};
