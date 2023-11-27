import { useDispatch } from "react-redux";
import { setToken, setUserID } from "../../store/userSlice";
import { setLoginIsOpen } from "../../store/loginSlice";

const useLogout = () => {
  console.log("LOGOUT woked");
  const dispatch = useDispatch();

  const logoutFunction = () => {
    // Dispatch the action to set isLoginOpen to true
    dispatch(setLoginIsOpen(true));

    // Dispatch actions to clear user ID and token
    // dispatch(setUserID(""));
    // dispatch(setToken(""));

    // // Clear local storage and session storage
    // localStorage.clear();
    // sessionStorage.clear();
  };

  return logoutFunction;
};

export default useLogout;
