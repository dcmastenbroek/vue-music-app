<template>
  <div
    class="mb-4 p-5 text-center font-bold text-white"
    :class="alertVariantClasses"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: "AlertComponent",

  props: {
    variant: {
      type: String,
      default: "info",
    },
  },

  computed: {
    alertVariantClasses() {
      return {
        "bg-blue-500": this.variant === "info",
        "bg-red-500": this.variant === "error",
        "bg-green-500": this.variant === "success",
      };
    },
  },
};
</script>
