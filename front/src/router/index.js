// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";
import { validToken } from "../api/auth.api";

const isAuthenticated = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await validToken(token);
    if (response.validToken) {
      return true;
    }
  } catch (error) {
    console.log(false);
  }
  return false;
};

const routes = [
  { path: "/", redirect: "/login" },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    beforeEnter: async (to, from, next) => {
      const resp = await isAuthenticated();
      if (resp) {
        next("/dashboard");
      } else {
        next();
      }
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/RegisterView.vue"),
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardView,
    beforeEnter: async (to, from, next) => {
      const resp = await isAuthenticated();
      if (!resp) {
        next("/login");
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
