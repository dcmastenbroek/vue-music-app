<script setup>
defineProps({
  error: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <section class="container mx-auto mt-4 px-4">
    This is an error page with code: {{ error }}
  </section>
</template>
