import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
/** Tailwind CSS */
import "./assets/css/main.css";
/** Custom CSS */
import "./assets/css/custom.css";
/** Animate CSS */
import "animate.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
