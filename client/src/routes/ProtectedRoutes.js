import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const userId = useSelector((state) => state.userState.user);
  const token = useSelector((state) => state.userState.token);
  return userId && token ? children : <Navigate to="/" />;
};
