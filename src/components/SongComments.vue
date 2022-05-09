<script setup>
defineProps({
  comments: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div id="comments" class="container mx-auto mt-4">
    <div v-if="comments.length < 1" class="border border-gray-200 bg-white p-6">
      There are no comments.
    </div>
    <!-- Comments -->
    <ul v-else>
      <li
        v-for="comment in comments"
        :key="comment.id"
        class="border border-gray-200 bg-gray-50 p-6"
      >
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ comment.created_at }}</time>
        </div>

        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </div>
</template>
