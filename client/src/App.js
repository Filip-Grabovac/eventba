import { ToastContainer } from "react-toastify";
import { Footer, Navbar } from "./components";
import { AllRoutes } from "./routes/AllRoutes";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./redux/actions/index.js";

function App() {
  const dispatch = useDispatch();
  // Check if user ID exists in session storage
  const userId = sessionStorage.getItem("userId");
  if (userId) {
    // Dispatch the setUser action with the user ID
    dispatch(setUser(userId));
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
