import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./i18n/LanguageContext.jsx";
import App from "./app/App.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import "./styles/global.css";
import "./styles/shared.css";
import "./styles/animations.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/project/:slug" element={<ProjectDetail />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  </StrictMode>,
);
