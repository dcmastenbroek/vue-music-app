<script setup>
import { reactive } from "vue";
import { RouterLink } from "vue-router";
import { useModalStore } from "@/stores/modal";
import { useAuthStore } from "@/stores/auth";
import NavigationLink from "./NavigationLink.vue";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n({ useScope: "global" });

const modalStore = useModalStore();
const authStore = useAuthStore();

const langs = reactive([
  { key: "en", name: t("general.english") },
  { key: "nl", name: t("general.dutch") },
]);
</script>

<template>
  <header id="header" class="bg-gray-700">
    <nav
      class="container mx-auto flex flex-col items-center justify-start py-5 px-4 md:flex-row"
    >
      <!-- App Name -->
      <router-link
        :to="{ name: 'home' }"
        class="text-2xl font-bold uppercase text-white md:mr-4"
      >
        {{ t("general.music") }}
      </router-link>

      <div class="flex flex-grow flex-col items-center md:flex-row">
        <!-- Primary Navigation -->
        <ul class="flex w-full flex-col items-center md:flex-row">
          <!-- Navigation Links -->
          <li>
            <navigation-link to="/">
              {{ t("navigation.home") }}
            </navigation-link>
          </li>
          <li>
            <navigation-link :to="{ name: 'about' }">
              {{ t("navigation.about") }}
            </navigation-link>
          </li>
        </ul>

        <ul class="flex w-full flex-col items-center justify-end md:flex-row">
          <li class="px-2">
            <select v-model="locale">
              <option v-for="lang in langs" :key="lang.key" :value="lang.key">
                {{ lang.name }}
              </option>
            </select>
          </li>
          <li v-if="!authStore.isLoggedIn">
            <a
              href="#"
              class="px-2 text-white"
              @click.prevent="modalStore.toggle()"
            >
              {{ t("navigation.login") }} / {{ t("navigation.register") }}
            </a>
          </li>
          <template v-else>
            <li>
              <span class="px-2 text-white">{{ authStore.user.email }}</span>
            </li>
            <li>
              <navigation-link to="/manage">
                <span class="mr-2">{{ t("navigation.manage") }}</span>
                <i class="fas fa-user"></i>
              </navigation-link>
            </li>
            <li>
              <a
                href="#"
                class="px-2 text-white"
                @click.prevent="authStore.handleLogout()"
              >
                <span class="mr-2">{{ t("navigation.logout") }}</span>
                <i class="fas fa-sign-out-alt"></i>
              </a>
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>
