<template>
  <router-link class="px-2 text-white" active-class="font-bold text-yellow-500">
    <slot />
  </router-link>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>
