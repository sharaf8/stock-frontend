import "./global.css";
import "./lib/i18n";

import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found");
}

// Create root only once and handle potential re-renders
let root: ReturnType<typeof createRoot>;

function render() {
  if (!root) {
    root = createRoot(container);
  }
  root.render(<App />);
}

// Initial render
render();

// Handle hot module replacement in development
if (import.meta.hot) {
  import.meta.hot.accept("./App", () => {
    render();
  });
}
