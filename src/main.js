import { createApp, markRaw } from "vue";
import { createPinia } from "pinia";
import { setLocale } from "@vee-validate/i18n";
import { onAuthStateChanged } from "@firebase/auth";

import App from "./App.vue";
import router from "./router";

import i18n from "./plugins/i18n";
setLocale("en");

import "./assets/css/tailwind.css";
import "./assets/css/main.css";

import "./plugins/vee-validate.js";
import { auth } from "./plugins/firebase";

import "nprogress/nprogress.css";
import ProgressBar from "./plugins/progress";
ProgressBar(router);

const pinia = createPinia();
pinia.use(({ store }) => {
  store.router = markRaw(router);
});

let app;

onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(App);

    app.use(pinia);
    app.use(i18n);
    app.use(router);

    app.mount("#app");
  }
});
