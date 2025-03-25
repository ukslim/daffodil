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

  // Get the hash without the # symbol
  const hash = window.location.hash.slice(1);

  if (hash === "animated") {
    cleanup = initAnimatedView();
  } else {
    cleanup = initEditorView();
  }
}

// Initial route handling
handleRoute();

// Handle hash changes
window.addEventListener("hashchange", handleRoute);
