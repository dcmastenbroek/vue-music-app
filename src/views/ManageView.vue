<script setup>
import UploadFiles from "@/components/UploadFiles.vue";
import SongsList from "@/components/SongsList.vue";
import { onBeforeRouteLeave } from "vue-router";
import { useSongStore } from "@/stores/song";

const songStore = useSongStore();

onBeforeRouteLeave(() => {
  if (songStore.hasUnsavedChanges) {
    const answer = window.confirm(
      "Do you really want to leave? You have unsaved changes!"
    );
    // cancel the navigation and stay on the same page
    if (!answer) return false;

    songStore.hasUnsavedChanges = false;
  }
});
</script>

<template>
  <section class="container mx-auto mt-6 px-4">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <upload-files />
      </div>
      <div class="col-span-2">
        <songs-list />
      </div>
    </div>
  </section>
</template>
