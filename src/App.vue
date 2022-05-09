<script setup>
import { RouterView } from "vue-router";
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "@/plugins/firebase";
import { useAuthStore } from "@/stores/auth";
import SiteHeader from "@/components/SiteHeader.vue";
import PlayerOverlay from "@/components/PlayerOverlay.vue";
import AuthModal from "@/components/AuthModal.vue";
import ReloadPrompt from "@/components/ReloadPrompt.vue";

// Load the pinia store
const store = useAuthStore();

// Check if the user is logged in
store.initializeAuthentication();

// Keep track of user changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    store.user = user;
    store.isLoggedIn = true;
  } else {
    store.user = null;
    store.isLoggedIn = false;
  }
});
</script>

<template>
  <reload-prompt />

  <site-header />

  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component"></component>
    </transition>
  </router-view>

  <player-overlay />

  <auth-modal />
</template>
