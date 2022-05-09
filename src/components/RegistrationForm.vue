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

const schema = ref({
  name: "required|min:3|max:100|alpha_spaces",
  email: "required|min:3|max:100|email",
  age: "required|min_value:18|max_value:120",
  password: "required|min:3|max:100",
  confirm_password: "confirmed:@password",
  country: "required|excluded:Russia",
  tos: "tos",
});

const userData = ref({
  country: "USA",
});

let inSubmission = ref(false);
let showAlert = ref(false);
let alertVariant = ref("info");
let alertMessage = ref("Please wait, your account is being created...");

function onSubmit(values, { resetForm }) {
  inSubmission.value = true;
  alertVariant.value = "info";
  alertMessage.value = "Please wait, your account is being created...";
  showAlert.value = true;

  authStore
    .handleRegistration(values)
    .then(() => {
      resetForm();
      inSubmission.value = false;

      alertVariant.value = "success";
      alertMessage.value = "Success! Your account has been created.";

      setTimeout(() => {
        modalStore.toggle();
      }, 3000);
    })
    .catch((error) => {
      alertVariant.value = "error";
      alertMessage.value = error.message;
    });
}
</script>

<template>
  <!-- Registration Form -->
  <vee-form
    :validation-schema="schema"
    :initial-values="userData"
    @submit="onSubmit"
  >
    <alert-component v-if="showAlert" :variant="alertVariant">
      {{ alertMessage }}
    </alert-component>

    <!-- Name -->
    <div class="mb-3">
      <label class="mb-2 inline-block">{{ $t("pages.register.name") }}</label>
      <vee-field
        type="text"
        name="name"
        class="block w-full rounded border border-gray-300 py-1.5 px-3 text-gray-800 transition duration-500 focus:border-black focus:outline-none"
      />
      <vee-error-message name="name" class="text-red-600" />
    </div>

    <!-- Email -->
    <div class="mb-3">
      <label class="mb-2 inline-block">{{ $t("pages.register.email") }}</label>
      <vee-field
        name="email"
        type="email"
        class="block w-full rounded border border-gray-300 py-1.5 px-3 text-gray-800 transition duration-500 focus:border-black focus:outline-none"
        placeholder="email@email.com"
      />
      <vee-error-message name="email" class="text-red-600" />
    </div>

    <!-- Age -->
    <div class="mb-3">
      <label class="mb-2 inline-block">{{ $t("pages.register.age") }}</label>
      <vee-field
        name="age"
        type="number"
        class="block w-full rounded border border-gray-300 py-1.5 px-3 text-gray-800 transition duration-500 focus:border-black focus:outline-none"
      />
      <vee-error-message name="age" class="text-red-600" />
    </div>

    <!-- Password -->
    <div class="mb-3">
      <label class="mb-2 inline-block">{{
        $t("pages.register.password")
      }}</label>
      <vee-field v-slot="{ field, errors }" name="password" :bails="false">
        <input
          name="password"
          type="password"
          class="block w-full rounded border border-gray-300 py-1.5 px-3 text-gray-800 transition duration-500 focus:border-black focus:outline-none"
          placeholder="********"
          v-bind="field"
        />
        <div v-for="error in errors" :key="error" class="text-red-600">
          {{ error }}
        </div>
      </vee-field>
    </div>

    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="mb-2 inline-block">{{
        $t("pages.register.confirm_password")
      }}</label>
      <vee-field
        name="confirm_password"
        type="password"
        class="block w-full rounded border border-gray-300 py-1.5 px-3 text-gray-800 transition duration-500 focus:border-black focus:outline-none"
        placeholder="********"
      />
      <vee-error-message name="confirm_password" class="text-red-600" />
    </div>

    <!-- Country -->
    <div class="mb-3">
      <label class="mb-2 inline-block">{{
        $t("pages.register.country")
      }}</label>
      <vee-field
        as="select"
        name="country"
        class="block w-full rounded border border-gray-300 py-1.5 px-3 text-gray-800 transition duration-500 focus:border-black focus:outline-none"
      >
        <option value="USA">{{ $t("pages.register.usa") }}</option>
        <option value="Mexico">{{ $t("pages.register.mexico") }}</option>
        <option value="Germany">{{ $t("pages.register.germany") }}</option>
        <option value="Russia">{{ $t("pages.register.russia") }}</option>
      </vee-field>
      <vee-error-message name="country" class="text-red-600" />
    </div>

    <!-- TOS -->
    <div class="mb-3 pl-6">
      <div>
        <vee-field
          id="tos"
          name="tos"
          type="checkbox"
          value="1"
          class="float-left -ml-6 mt-1 h-4 w-4 rounded"
        />
        <i18n-t
          keypath="pages.register.accept_terms"
          tag="label"
          for="tos"
          class="inline-block"
          scope="global"
        >
          <a href="#" target="_blank">
            {{ $t("pages.register.tos") }}
          </a>
        </i18n-t>
      </div>
      <vee-error-message name="tos" class="text-red-600" />
    </div>

    <button
      type="submit"
      class="block w-full rounded py-1.5 px-3 text-white transition"
      :class="{
        'bg-gray-500': inSubmission,
        'bg-purple-600 hover:bg-purple-700': !inSubmission,
      }"
      :disabled="inSubmission"
    >
      {{ $t("general.submit") }}
    </button>
  </vee-form>
</template>
