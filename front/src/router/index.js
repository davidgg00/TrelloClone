// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";

// Simulación de autenticación (puedes cambiarlo a algo real)
const isAuthenticated = () => !!localStorage.getItem("auth");

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: "Login", component: LoginView },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/RegisterView.vue"),
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardView,
    beforeEnter: (to, from, next) => {
      if (!isAuthenticated()) {
        next();
        /* next("/login"); */
      } else {
        next();
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
