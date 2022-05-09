import { defineStore } from "pinia";
import { songsCollection } from "@/plugins/firebase";
import {
  doc,
  query,
  getDocs,
  getDoc,
  orderBy,
  limit,
  startAfter,
} from "@firebase/firestore";
import { Howl } from "howler";

export const usePlayerStore = defineStore({
  id: "player",

  state: () => ({
    isLoading: false,
    songs: [],
    activeSong: {},
    sound: {},
    seek: "00:00",
    duration: "00:00",
    playerProgress: "0%",
  }),

  getters: {
    hasActiveSong: (state) => Object.keys(state.activeSong).length !== 0,
    isPlaying: (state) => (state.sound.playing ? state.sound.playing() : false),
  },

  actions: {
    async fetchSongs(maxPerPage = 3) {
      this.activeSong = {};

      if (this.isLoading === true) {
        return;
      }

      this.isLoading = true;
      const lastDoc = this.songs.length
        ? await getDoc(
            doc(songsCollection, this.songs[this.songs.length - 1].id)
          )
        : "A";

      const q = query(
        songsCollection,
        orderBy("modified_name"),
        limit(maxPerPage),
        startAfter(lastDoc)
      );

      try {
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          this.songs.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        this.isLoading = false;
      } catch (e) {
        console.log("Error retrieving songs", e);
      }
    },

    setActiveSong(song) {
      if (this.activeSong === song) {
        this.sound.play();
        return;
      }

      if (this.sound instanceof Howl) {
        this.sound.unload();
      }

      this.activeSong = song;
      this.sound = new Howl({
        src: [song.url],
        html5: true,
      });
      this.sound.play();

      this.sound.on("play", () => {
        requestAnimationFrame(() => {
          this.progress();
        });
      });
    },

    progress() {
      this.seek = this.sound.seek();
      this.duration = this.sound.duration();
      this.playerProgress =
        (this.sound.seek() / this.sound.duration()) * 100 + "%";

      if (this.sound.playing()) {
        requestAnimationFrame(() => {
          this.progress();
        });
      }
    },

    toggleAudio() {
      if (!this.sound.playing) {
        return;
      }

      if (this.sound.playing()) {
        this.sound.pause();
      } else {
        this.sound.play();
      }
    },

    updateSeek(event) {
      if (!this.sound.playing) {
        return;
      }

      const { x, width } = event.currentTarget.getBoundingClientRect();
      const clickX = event.clientX - x;
      const percentage = clickX / width;
      const seconds = this.sound.duration() * percentage;

      this.sound.seek(seconds);

      this.sound.once("seek", () => {
        this.progress();
      });
    },
  },
});
