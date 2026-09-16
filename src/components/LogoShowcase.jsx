import { useRef } from "react";
import HeroLogo from "./HeroLogo.jsx";
import "./LogoShowcase.css";

export default function LogoShowcase() {
  const stageRef = useRef(null);
  return (
    <div className="logo-showcase" ref={stageRef} role="img" aria-label="Glass logo in front of build and repeat, repeated on three lines." lang="en">
      <HeroLogo hostRef={stageRef} showcase />
    </div>
  );
}
