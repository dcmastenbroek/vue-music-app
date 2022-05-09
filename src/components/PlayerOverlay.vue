<script setup>
import { storeToRefs } from "pinia";
import { usePlayerStore } from "@/stores/player";
import { formatTime } from "@/includes/helpers.js";

const playerStore = usePlayerStore();

const { seek, duration, isPlaying, hasActiveSong, activeSong, playerProgress } =
  storeToRefs(playerStore);
const { toggleAudio, updateSeek } = playerStore;
</script>

<template>
  <!-- Player -->
  <div
    v-if="hasActiveSong"
    class="fixed bottom-0 left-0 h-16 w-full bg-white p-5 pb-4 text-left align-top"
  >
    <div class="relative flex items-center justify-between space-x-4">
      <!-- Play/Pause Button -->
      <div class="w-7 leading-3">
        <button
          id="player-play-button"
          type="button"
          @click.prevent="toggleAudio()"
        >
          <i v-if="isPlaying" class="fas fa-pause text-xl text-gray-500"></i>
          <i v-else class="fa fa-play text-xl text-gray-500"></i>
        </button>
      </div>

      <!-- Current Position -->
      <div class="w-14 text-center text-lg leading-3 text-gray-400">
        <span class="player-currenttime">{{ formatTime(seek) }}</span>
      </div>

      <!-- Scrub -->
      <div class="player-scrub grow leading-3">
        <div class="player-song-info mx-auto text-center text-lg">
          <span class="song-title">{{ activeSong.modified_name }}</span>
          (Uploaded by
          <span class="song-artist">{{ activeSong.display_name }}</span
          >)
        </div>

        <!-- Scrub container -->
        <span
          class="relative m-1 block h-2 w-full cursor-pointer rounded bg-gray-200"
          @click.prevent="updateSeek($event)"
        >
          <span
            class="top-neg-8 absolute -ml-1 text-lg text-gray-800"
            :style="{ left: playerProgress }"
          >
            <i class="fas fa-circle"></i>
          </span>
          <span
            class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
            :style="{ width: playerProgress }"
          ></span>
        </span>
      </div>

      <!-- Duration -->
      <div class="w-14 text-center text-lg leading-3 text-gray-400">
        <span class="player-duration">{{ formatTime(duration) }}</span>
      </div>
    </div>
  </div>
</template>
