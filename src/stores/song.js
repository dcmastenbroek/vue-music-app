import { defineStore } from "pinia";
import { query, where, getDocs } from "firebase/firestore";
import { songsCollection } from "@/plugins/firebase";
import { useAuthStore } from "@/stores/auth";

export const useSongStore = defineStore({
  id: "song",

  state: () => ({
    songs: [],
    isLoading: true,
    hasUnsavedChanges: false,
  }),

  actions: {
    async fetchSongs() {
      this.isLoading = true;
      this.songs = [];
      const authStore = useAuthStore();

      const q = query(songsCollection, where("uid", "==", authStore.user.uid));

      try {
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          this.addSong(doc);
        });

        this.isLoading = false;
      } catch (e) {
        console.log("Error retrieving songs", e);
      }
    },

    addSong(songRef) {
      this.songs.push({
        id: songRef.id,
        ...songRef.data(),
      });
    },

    updateSong(i, values) {
      this.songs[i].modified_name = values.name;
      this.songs[i].genre = values.genre;

      this.hasUnsavedChanges = false;
    },

    deleteSong(index) {
      this.songs.splice(index, 1);
    },
  },
});
