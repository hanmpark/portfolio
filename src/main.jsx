import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.jsx";
import "./styles/global.css";
import "./styles/shared.css";
import "./styles/animations.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
