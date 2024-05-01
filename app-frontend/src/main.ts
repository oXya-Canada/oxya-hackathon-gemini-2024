/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Plugins
import { registerPlugins } from "../src/plugins";
import { useToast } from "vue-toastification";
import axios from "axios";
import { useNotificationStore } from "./store/notification";
axios.defaults.withCredentials = false;
axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    config.withCredentials = false;
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    // all 2xx/3xx responses will end here
    const toast = useToast();

    // Use it!
    if (response.data.message)
      toast.info("Success : " + response.data.message, {
        timeout: 1000,
        toastClassName: "bg-primary",
      });
    if (response.data?.create_notification) {
      const notificationStore = useNotificationStore();
      notificationStore.addNotification(response.data.create_notification);
    }
    return response;
  },
  (error) => {
    // all 4xx/5xx responses will end here
    const toast = useToast();
    if (!error.response) {
      toast.error(error.message, {
        timeout: 10000,
      });
    }
    console.log(error.response);
    // Use it!
    if (error.response.status === 404) {
      toast.error(`404 : Not Found`, {
        timeout: 10000,
      });
    } else {
      toast.error(error.response.data.message, {
        timeout: 10000,
      });
    }
    if (error.response.status === 409) {
      console.log("Conflict reloading data");
    }
    if (error.response.data?.create_notification) {
      const notificationStore = useNotificationStore();
      notificationStore.addNotification(
        error.response.data.create_notification
      );
    }
    return Promise.reject(error);
  }
);

const app = createApp(App);

registerPlugins(app);

app.mount("#app");
