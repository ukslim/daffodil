import { initAnimatedView } from "./animated";
import { initEditorView } from "./editor";
import "./style.css";

let cleanup: (() => void) | undefined;

// Handle routing
function handleRoute() {
  // Clean up previous view if it exists
  if (cleanup) {
    cleanup();
    cleanup = undefined;
  }

  const path = window.location.pathname;
  if (path === "/daffodil/animated") {
    cleanup = initAnimatedView();
  } else {
    cleanup = initEditorView();
  }
}

// Initial route handling
handleRoute();

// Handle browser back/forward buttons
window.addEventListener("popstate", handleRoute);
