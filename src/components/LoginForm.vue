<script setup>
import { ref } from "vue";
import { useModalStore } from "@/stores/modal";
import { useAuthStore } from "@/stores/auth";
import {
  Field as VeeField,
  Form as VeeForm,
  ErrorMessage as VeeErrorMessage,
} from "vee-validate";
import AlertComponent from "@/components/AlertComponent.vue";

const modalStore = useModalStore();
const authStore = useAuthStore();

let inSubmission = ref(false);
let showAlert = ref(false);
let alertMessage = ref("");
let alertVariant = ref("info");

const schema = ref({
  email: "required|min:3|max:100|email",
  password: "required|min:3|max:100",
});

function onLogin(values, { setFieldValue }) {
  inSubmission.value = true;

  authStore
    .handleLogin(values)
    .then((userCredentials) => {
      inSubmission.value = false;

      showAlert.value = true;
      alertMessage.value = "You logged in sucessfully!";
      alertVariant.value = "success";

      authStore.user = userCredentials.user;

      modalStore.toggle();
    })
    .catch((error) => {
      switch (error.code) {
        case "auth/invalid-email":
          alertMessage.value = "Invalid email";
          setFieldValue("email", "");
          break;
        case "auth/user-not-found":
          alertMessage.value = "No account with that email was found";
          setFieldValue("email", "");
          break;
        case "auth/wrong-password":
          alertMessage.value = "Incorrect password";
          break;
        default:
          alertMessage.value = "Email or password was incorrect";
          break;
      }

      inSubmission.value = false;
      showAlert.value = true;
      alertVariant.value = "error";

      setFieldValue("password", "");
    });
}
</script>

<template>
  <!-- Login Form -->
  <vee-form :validation-schema="schema" @submit="onLogin">
    <alert-component v-if="showAlert" :variant="alertVariant">
      {{ alertMessage }}
    </alert-component>

    <!-- Email -->
    <div class="mb-3">
      <label class="mb-2 inline-block">{{ $t("pages.login.email") }}</label>
      <vee-field
        name="email"
        type="email"
        class="block w-full rounded border border-gray-300 py-1.5 px-3 text-gray-800 transition duration-500 focus:border-black focus:outline-none"
        placeholder="email@email.com"
      />
      <vee-error-message name="email" class="text-red-600" />
    </div>

    <!-- Password -->
    <div class="mb-3">
      <label class="mb-2 inline-block">{{ $t("pages.login.password") }}</label>
      <vee-field
        name="password"
        type="password"
        class="block w-full rounded border border-gray-300 py-1.5 px-3 text-gray-800 transition duration-500 focus:border-black focus:outline-none"
        placeholder="*********"
      />
      <vee-error-message name="password" class="text-red-600" />
    </div>

    <button
      type="submit"
      :disabled="inSubmission"
      class="block w-full rounded bg-purple-600 py-1.5 px-3 text-white transition hover:bg-purple-700"
    >
      {{ $t("general.submit") }}
    </button>
  </vee-form>
</template>
