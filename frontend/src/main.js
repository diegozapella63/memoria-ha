// Entry point of the UI served by the MemorIA app.
import "./selectsheet.js"; // first: its Back comes before the app's
import "./hatema.js"; // the background and the cards of the Home Assistant theme (the same file in all the apps)
import { tecladoCalmo } from "./teclado.js"; // the keyboard of the phone does not leave the pages around the app scrolled
import "./textareas.js"; // the text fields keep the size the person left them (the same file in all the apps)
import "./memoria-app.js";
import { Api, appEnv } from "./api.js";

tecladoCalmo();

const root = document.getElementById("app");
const el = document.createElement("memoria-app");
el.env = appEnv();
el.api = new Api();
root.replaceChildren(el);
