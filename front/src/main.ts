import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import "./index.css";
import VueAnimXyz from "@animxyz/vue3";
import "@animxyz/core";
import Vue3Toastify, { type ToastContainerOptions } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

createApp(App)
  .use(Vue3Toastify, {
    autoClose: 3000,
  } as ToastContainerOptions)
  .use(VueAnimXyz)
  .use(router)
  .mount("#app");
