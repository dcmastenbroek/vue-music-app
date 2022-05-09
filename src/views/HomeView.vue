<script setup>
import { onBeforeUnmount } from "vue";
import { usePlayerStore } from "@/stores/player";
import IntroductionSection from "@/components/IntroductionSection.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const store = usePlayerStore();
store.fetchSongs();

function handleScroll() {
  const { scrollTop, offsetHeight } = document.documentElement;
  const { innerHeight } = window;
  const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

  if (bottomOfWindow) {
    store.fetchSongs();
  }
}

window.addEventListener("scroll", handleScroll);

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div>
    <introduction-section />

    <section class="container mx-auto px-4">
      <div class="relative flex flex-col rounded border border-gray-200 bg-white">
        <div
          class="flex items-center justify-between border-b border-gray-200 px-6 pt-6 pb-5 font-bold"
        >
          <span class="card-title">{{ t("general.songs") }}</span>
          <i class="fa fa-headphones-alt float-right text-2xl text-green-400"></i>
        </div>
        <!-- Playlist -->
        <div v-if="store.songs.length < 1" class="py-3 px-6">
          {{ t("general.loading") }} {{ t("general.songs") }}...
        </div>
        <ol v-else id="playlist">
          <li
            v-for="song in store.songs"
            :key="song.id"
            class="group flex cursor-pointer items-center justify-between py-3 px-6 transition duration-300 hover:bg-gray-50"
          >
            <div>
              <router-link
                :to="{ name: 'song', params: { id: song.id } }"
                class="composition-name block font-bold text-gray-600 group-hover:text-yellow-600"
              >
                {{ song.modified_name }}
              </router-link>
              <span class="text-sm text-gray-500">{{ song.display_name }}</span>
            </div>

            <div class="text-lg text-gray-600">
              <router-link
                v-slot="{ navigate }"
                custom
                :to="{
                  name: 'song',
                  params: { id: song.id },
                  hash: '#comments',
                }"
              >
                <span class="comments" @click="navigate">
                  <i class="fa fa-comments text-gray-600"></i>
                  {{ song.comment_count }}
                </span>
              </router-link>
            </div>
          </li>
        </ol>
        <div
          v-if="store.isLoading && store.songs.length > 0"
          class="flex items-center justify-center p-4"
        >
          <i class="fas fa-spinner fa-spin fa-2xl"></i>
        </div>
        <!-- .. end Playlist -->
      </div>
    </section>
  </div>
</template>
