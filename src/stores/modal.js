import { defineStore } from "pinia";

export const useModalStore = defineStore({
  id: "modal",

  state: () => ({
    isActive: false,
    activeTab: "login",
  }),

  getters: {
    getActiveState: (state) => state.isActive,
    getActiveTab: (state) => state.activeTab,
  },

  actions: {
    toggle() {
      this.isActive = !this.isActive;
      this.formData = null;
    },

    switchTab(tabName) {
      this.activeTab = tabName;
    },
  },
});
