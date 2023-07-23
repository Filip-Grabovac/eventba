import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "../src/style.css";
import { BrowserRouter as Router } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { ScrollToTop } from "./components/helper/ScrollToTop";
import { store } from "./store/store";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <Router>
      <ScrollToTop />
      <App />
    </Router>
  </Provider>
);
