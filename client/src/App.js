import { ToastContainer } from "react-toastify";
import { Footer, Navbar } from "./components";
import { AllRoutes } from "./routes/AllRoutes";
import { useDispatch } from "react-redux";
import { setUserID } from "./store/userSlice";

function App() {
  const dispatch = useDispatch();

  let userId;

  if (localStorage.getItem("userId")) {
    userId = localStorage.getItem("userId");
  } else if (sessionStorage.getItem("userId")) {
    userId = sessionStorage.getItem("userId");
  }

  if (userId) {
    dispatch(setUserID(userId));
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
