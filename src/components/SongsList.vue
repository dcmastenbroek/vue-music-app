<template>
  <div class="relative flex flex-col rounded border border-gray-200 bg-white">
    <div class="border-b border-gray-200 px-6 pt-6 pb-5 font-bold">
      <span class="card-title">My Songs</span>
      <i class="fa fa-compact-disc float-right text-2xl text-green-400"></i>
    </div>

    <div v-if="songStore.isLoading" class="p-6">
      <i class="fas fa-spinner fa-spin mr-2"></i> Loading...
    </div>
    <div v-else class="space-y-3 p-6">
      <template v-if="songStore.songs.length > 0">
        <div
          v-for="(song, index) in songStore.songs"
          :key="song.id"
          class="mb-4 rounded border border-gray-200 p-3"
        >
          <song-item
            :song="song"
            :index="index"
            :on-update-song="updateSong"
            @delete-song="deleteSong"
          />
        </div>
      </template>
      <template v-else>
        <div>There are no songs yet. Add one!</div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useSongStore } from "@/stores/song";
import SongItem from "@/components/SongItem.vue";

const songStore = useSongStore();

onMounted(async () => {
  await songStore.fetchSongs();
});

function updateSong(i, values) {
  songStore.updateSong(i, values);
}

function deleteSong(i) {
  songStore.deleteSong(i);
}
</script>
