import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const ProtectedControllerRoute = ({ children }) => {
  const controllerId = useSelector(
    (state) => state.entranceControllerState.entranceController
  );
  return controllerId ? children : <Navigate to="/controller_login" />;
};
