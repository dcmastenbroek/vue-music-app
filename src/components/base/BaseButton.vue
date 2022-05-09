<template>
  <button :disabled="loading || disabled" :class="[defaultClass, variantClass]">
    <i
      v-if="loading"
      class="fas fa-spinner fa-spin"
      :class="[iconLeftClass, iconVariantClass]"
    ></i>

    <slot />
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  defaultClass: {
    type: String,
    default:
      "w-full rounded py-1.5 px-3 transition whitespace-nowrap items-center border font-medium focus:outline-none focus:ring-2 focus:ring-offset-2",
  },
  variant: {
    type: String,
    default: "primary",
    validator: function (value) {
      return ["primary", "secondary", "success", "error"].indexOf(value) !== -1;
    },
  },
});

const variantClass = computed(() => {
  return {
    "border-transparent shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500":
      props.variant === "primary",
    "border-transparent text-primary-700 bg-primary-100 hover:bg-primary-200 focus:ring-primary-500":
      props.variant === "secondary",
    "border-transparent text-green-700 bg-green-100 hover:bg-green-200 focus:ring-green-500":
      props.variant === "success",
    "border-transparent shadow-sm text-white bg-red-600 hover:bg-red-700 focus:ring-red-500":
      props.variant === "error",
  };
});

const iconLeftClass = computed(() => {
  return "-ml-0.5 mr-2 h-4 w-4";
});

const iconVariantClass = computed(() => {
  return {
    "text-white": props.variant === "primary",
    "text-primary-700": props.variant === "secondary",
  };
});
</script>
