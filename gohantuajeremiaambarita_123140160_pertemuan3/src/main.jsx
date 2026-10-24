import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { BookProvider } from "./context/BookContext";
import "./styles.css";
// HashRouter membuat rute #/statistik tetap dapat dibuka pada hosting statis.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <BookProvider>
        <App />
      </BookProvider>
    </HashRouter>
  </React.StrictMode>,
);
