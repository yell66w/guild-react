import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
/** Tailwind CSS */
import "./assets/css/tailwind.css";
/** Custom CSS */
import "./assets/css/custom.css";
/** Animate CSS */
import "animate.css";
/** Toastify CSS */
import "react-toastify/dist/ReactToastify.css";
/** Custom Toastify CSS */
import "./assets/css/toastify.css";
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
