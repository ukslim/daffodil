import { initAnimatedView } from "./animated";
import { initEditorView } from "./editor";
import "./style.css";

// Handle routing
function handleRoute() {
  const path = window.location.pathname;
  if (path === "/daffodil/animated") {
    initAnimatedView();
  } else {
    initEditorView();
  }
}

// Initial route handling
handleRoute();

// Handle browser back/forward buttons
window.addEventListener("popstate", handleRoute);
