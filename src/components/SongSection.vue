<script setup>
import backgroundImage from "@/assets/img/song-header.png";
import { usePlayerStore } from "@/stores/player";

const playerStore = usePlayerStore();

defineProps({
  song: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <section class="relative mb-8 w-full py-14 text-center text-white">
    <div
      class="music-bg absolute inset-0 box-border h-full w-full bg-contain"
      :style="{
        'background-image': `url(${backgroundImage})`,
      }"
    ></div>
    <div class="container mx-auto flex items-center">
      <button
        v-if="!playerStore.isPlaying"
        id="play-button"
        type="button"
        class="z-50 h-24 w-24 rounded-full bg-white text-3xl text-black focus:outline-none"
        @click.prevent="playerStore.setActiveSong(song)"
      >
        <i class="fas fa-play"></i>
      </button>
      <button
        v-else
        type="button"
        class="z-50 h-24 w-24 rounded-full bg-white text-3xl text-black focus:outline-none"
        @click.prevent="playerStore.toggleAudio()"
      >
        <i class="fas fa-pause"></i>
      </button>

      <div class="z-50 ml-8 text-left">
        <div class="text-3xl font-bold">{{ song.modified_name }}</div>
        <div>{{ song.genre }}</div>
        <div class="song-price">{{ $n(10, "currency") }}</div>
      </div>
    </div>
  </section>
</template>
