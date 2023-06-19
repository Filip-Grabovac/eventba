import { ToastContainer } from "react-toastify";
import { Footer, Navbar } from "./components";
import { AllRoutes } from "./routes/AllRoutes";

function App() {
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
