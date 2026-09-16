import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./i18n/LanguageContext.jsx";
import App from "./app/App.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import "./styles/global.css";
import "./styles/shared.css";
import "./styles/animations.css";

const Logo = lazy(() => import("./pages/Logo.jsx"));

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/project/:slug" element={<ProjectDetail />} />
          <Route path="/logo" element={<Suspense fallback={null}><Logo /></Suspense>} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  </StrictMode>,
);
