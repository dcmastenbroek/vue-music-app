<script setup>
import { useModalStore } from "@/stores/modal";
import RegistrationForm from "./RegistrationForm.vue";
import LoginForm from "./LoginForm.vue";

const store = useModalStore();
</script>

<template>
  <!-- Auth Modal -->
  <div
    id="modal"
    class="fixed inset-0 z-10 overflow-y-auto"
    :class="{ hidden: !store.getActiveState }"
  >
    <div
      class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0 transition-opacity">
        <div
          class="absolute inset-0 bg-gray-800 opacity-75"
          @click.stop="store.toggle()"
        ></div>
      </div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:h-screen sm:align-middle"
        >&#8203;</span
      >

      <div
        class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
      >
        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <div class="py-4 px-6 text-left">
          <!--Title-->
          <div class="flex items-center justify-between pb-4">
            <p class="text-2xl font-bold">{{ $t("general.your_account") }}</p>
            <!-- Modal Close Button -->
            <div
              class="modal-close z-50 cursor-pointer"
              @click="store.toggle()"
            >
              <i class="fas fa-times"></i>
            </div>
          </div>

          <!-- Tabs -->
          <ul class="mb-4 flex flex-wrap">
            <li class="flex-auto text-center">
              <a
                class="block rounded py-3 px-4 transition"
                :class="{
                  'bg-blue-600 text-white hover:text-white':
                    store.activeTab === 'login',
                  'hover:text-blue-600': store.activeTab !== 'login',
                }"
                href="#"
                @click.prevent="store.switchTab('login')"
                >{{ $t("navigation.login") }}</a
              >
            </li>
            <li class="flex-auto text-center">
              <a
                class="block rounded py-3 px-4 transition"
                :class="{
                  'bg-blue-600 text-white hover:text-white':
                    store.activeTab === 'register',
                  'hover:text-blue-600': store.activeTab !== 'register',
                }"
                href="#"
                @click.prevent="store.switchTab('register')"
                >{{ $t("navigation.register") }}</a
              >
            </li>
          </ul>

          <login-form v-if="store.activeTab === 'login'" />

          <registration-form v-else />
        </div>
      </div>
    </div>
  </div>
</template>
