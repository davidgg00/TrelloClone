import { jwtDecode } from "jwt-decode";
import { defineStore } from "pinia";

interface UserState {
  name: string;
  id: string;
  token: string;
}

// user store pinia save name, id and token using typescript
export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    name: "",
    id: "",
    token: "",
  }),

  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setName(name: string) {
      this.name = name;
    },
    setId(id: string) {
      this.id = id;
    },
    clear() {
      this.name = "";
      this.id = "";
      this.token = "";
    },
    loadUser() {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        this.setToken(token);
        this.setName(decodedToken.name);
        this.setId(decodedToken.id);
      }
    },
  },

  getters: {
    getUserName(state) {
      return state.name;
    },
    getUserId(state) {
      return state.id;
    },
  },
});
