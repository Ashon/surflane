import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./surflane.css";
import { SurflaneDemo } from "./surflane-demo.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SurflaneDemo framework="Vite" />
  </StrictMode>,
);
