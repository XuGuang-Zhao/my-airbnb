import { defineStore } from "pinia";

interface User {
  id: number;
  email: string;
  name: string;
  avatar?: string;
}

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
    isLogin: false,
  }),
  actions: {
    setUser(payload: User) {
      this.user = payload;
      this.isLogin = true;
    },
    clearUser() {
      this.user = null;
      this.isLogin = false;
    },
  },
});
