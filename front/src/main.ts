import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
// @ts-ignore
import router from "./router";
import "./index.css";
import VueAnimXyz from "@animxyz/vue3";
import "@animxyz/core";
import Vue3Toastify, { type ToastContainerOptions } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { createPinia } from "pinia";
import { useUserStore } from "./stores/user";

const pinia = createPinia();

const app = createApp(App);
app.use(pinia);

const userStore = useUserStore();

userStore.loadUser();

app
  .use(Vue3Toastify, {
    autoClose: 3000,
  } as ToastContainerOptions)
  .use(VueAnimXyz)
  .use(router)
  .mount("#app");
