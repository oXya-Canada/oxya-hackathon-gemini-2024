// Utilities
import { defineStore } from "pinia";
import UserSercice from "../services/UserService";

export const useUserStore = defineStore("user", {
  state: () => ({
    email: "",
    status: "idle",
  }),
  actions: {
    async getUser() {
      this.status = "pending";
      try {
        const responseUser = await UserSercice.getUser();
        this.email = responseUser.email;

        this.status = "succeeded";
      } catch (error) {
        console.log(error);
        this.status = "failed";
      }
    },
  },
});
