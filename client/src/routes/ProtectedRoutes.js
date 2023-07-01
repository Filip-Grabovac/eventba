import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const userId = useSelector((state) => state.userState.user);
  return userId ? children : <Navigate to="/" />;
};