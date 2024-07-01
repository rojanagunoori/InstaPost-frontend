import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "@material-tailwind/react";
import MyState from "./context/data/myState"; // Import MyState

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <MyState>
        <App />
      </MyState>
    </ThemeProvider>
  </React.StrictMode>
);
