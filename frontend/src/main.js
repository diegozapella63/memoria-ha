// Entry point of the UI served by the MemorIA app.
import "./selectsheet.js"; // first: its Back comes before the app's
import "./memoria-app.js";
import { Api, appEnv } from "./api.js";

const root = document.getElementById("app");
const el = document.createElement("memoria-app");
el.env = appEnv();
el.api = new Api();
root.replaceChildren(el);
