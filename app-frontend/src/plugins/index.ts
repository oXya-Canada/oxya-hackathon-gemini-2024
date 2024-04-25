/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import { loadFonts } from "./webfontloader";
import vuetify from "./vuetify";
import pinia from "../store";
import router from "../router";

import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

// Types
import type { App } from "vue";

export function registerPlugins(app: App) {
  loadFonts();
  app
    .use(Toast, {
      // Setting the global default position
      position: POSITION.BOTTOM_CENTER,
      pauseOnFocusLoss: true,
    })
    .use(vuetify)
    .use(router)
    .use(pinia);
}
