import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import "./index.css";
import VueAnimXyz from "@animxyz/vue3";
import "@animxyz/core";

createApp(App).use(VueAnimXyz).use(router).mount("#app");
