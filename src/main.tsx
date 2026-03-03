import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initTheme } from "./lib/theme";

// Apply saved theme before first render so all pages (including mobile) use it
initTheme();

createRoot(document.getElementById("root")!).render(<App />);
