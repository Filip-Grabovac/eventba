import "devextreme/dist/css/dx.light.css";
import { ToastContainer } from "react-toastify";
import { Footer, Navbar } from "./components";
import { AllRoutes } from "./routes/AllRoutes";
import { useDispatch } from "react-redux";
import { setToken, setUserID } from "./store/userSlice";

function App() {
  const dispatch = useDispatch();

  let userId;
  let token;

  if (localStorage.getItem("userId")) {
    userId = localStorage.getItem("userId");
    token = localStorage.getItem("token");
  } else if (sessionStorage.getItem("userId")) {
    userId = sessionStorage.getItem("userId");
    token = sessionStorage.getItem("token");
  }

  if (userId) {
    dispatch(setUserID(userId));
    dispatch(setToken(token));
  }

  return (
    <div className="App">
      <Navbar />
      <AllRoutes />
      <ToastContainer />
      <Footer />
    </div>
  );
}

export default App;
