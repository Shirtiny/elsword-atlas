import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { appWindow } from "@tauri-apps/api/window";

import "./styles.css";

let pined: boolean = true;

appWindow.setAlwaysOnTop(pined);

document
  .getElementById("titlebar-pin")
  ?.addEventListener("click", async (e) => {
    await appWindow.setAlwaysOnTop(!pined);
    pined = !pined;
    const pinEl = document.getElementById("titlebar-pin");
    const newIcon = document.createElement("img");
 
    newIcon.src = `https://api.iconify.design/material-symbols:push-pin${
      pined ? "" : "-outline"
    }.svg`;

    pinEl?.replaceChildren(newIcon);
  });
document
  .getElementById("titlebar-minimize")
  ?.addEventListener("click", () => appWindow.close());
document
  .getElementById("titlebar-close")
  ?.addEventListener("click", () => appWindow.close());

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
