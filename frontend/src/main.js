// Entry point of the UI served by the MemorIA app.
import "./selectsheet.js"; // first: its Back comes before the app's
import "./textareas.js"; // the text fields keep the size the person left them (the same file in all the apps)
import "./memoria-app.js";
import { Api, appEnv } from "./api.js";

const root = document.getElementById("app");
const el = document.createElement("memoria-app");
el.env = appEnv();
el.api = new Api();
root.replaceChildren(el);
