import "../src/memoria-app.js";
import { MockApi } from "./mock-api.js";

// Deep links for screenshots: memoria-preview.html#/blocos
if (location.hash.length > 1) {
  history.replaceState({ rvDepth: 0, rvPath: location.hash.slice(1) }, "");
}
const el = document.createElement("memoria-app");
el.env = { topbar: false };
el.api = new MockApi();
document.getElementById("app").appendChild(el);
