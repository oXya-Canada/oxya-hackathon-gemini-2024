/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
// import { VDataTable, VDataTableServer } from "vuetify/labs/VDataTable";

// Composables
import { createVuetify } from "vuetify";
import { VNumberInput } from "vuetify/labs/VNumberInput";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          primary: "#8C86C1",
          secondary: "#5CBBF6",
          success: "#40a829",
          error: "#e01010",
        },
      },
      dark: {
        colors: {
          primary: "#8C86C1",
          secondary: "#5CBBF6",
        },
      },
    },
  },
  components: {
    VNumberInput,
    // VDataTable,
    // VDataTableServer,
  },
});
