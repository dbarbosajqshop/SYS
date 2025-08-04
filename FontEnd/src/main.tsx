import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

document.title = import.meta.env.VITE_APP_TITLE || "JQ Shop";

createRoot(document.getElementById("root")!).render(<App />);
