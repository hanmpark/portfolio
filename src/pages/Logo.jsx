import { useEffect } from "react";
import LogoShowcase from "../components/LogoShowcase.jsx";
import "./Logo.css";

export default function Logo() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Logo — Hanmin Park";
    window.scrollTo({ top: 0, behavior: "instant" });
    return () => { document.title = previousTitle; };
  }, []);
  return (
    <main className="logo-page">
      <LogoShowcase />
    </main>
  );
}
