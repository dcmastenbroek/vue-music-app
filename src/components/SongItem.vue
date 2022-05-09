<template>
  <div class="rounded border border-gray-200 p-3">
    <div>
      <h4 class="inline-block text-xl font-bold">{{ song.modified_name }}</h4>
      <button
        :id="'deleteButton' + song.id"
        class="float-right ml-1 rounded bg-red-600 py-1 px-2 text-sm text-white"
        @click.prevent="deleteSong"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        :id="'editButton' + song.id"
        class="float-right ml-1 rounded bg-blue-600 py-1 px-2 text-sm text-white"
        @click.prevent="editSong"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>

    <div v-if="isEditing" class="slidedown mt-3">
      <vee-form :validation-schema="schema" :initial-values="songData" @submit="updateSong">
        <div class="mb-3">
          <label class="mb-2 inline-block">Song Title</label>
          <vee-field
            name="name"
            type="text"
            class="block w-full rounded border border-gray-300 py-1.5 px-3 text-gray-800 transition duration-500 focus:border-black focus:outline-none"
            placeholder="Enter Song Title"
          />
          <vee-error-message name="name" class="text-red-600" />
        </div>
        <div class="mb-3">
          <label class="mb-2 inline-block">Genre</label>
          <vee-field
            name="genre"
            type="text"
            class="block w-full rounded border border-gray-300 py-1.5 px-3 text-gray-800 transition duration-500 focus:border-black focus:outline-none"
            placeholder="Enter Genre"
          />
          <vee-error-message name="genre" class="text-red-600" />
        </div>

        <div class="flex items-center justify-between">
          <div>
            <span v-if="isUpdated" class="text-sm text-green-500">Updated!</span>
          </div>
          <div class="flex items-center justify-end space-x-1">
            <button
              type="submit"
              class="rounded bg-green-600 py-1.5 px-3 text-white"
              :disabled="isLoading"
            >
              <i v-if="isLoading" class="fas fa-spinner fa-spin ml-2"></i>
              {{ $t("general.submit") }}
            </button>
            <button
              type="submit"
              class="rounded bg-gray-600 py-1.5 px-3 text-white"
              @click.prevent="editSong"
            >
              Cancel
            </button>
          </div>
        </div>
      </vee-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Field as VeeField, Form as VeeForm, ErrorMessage as VeeErrorMessage } from "vee-validate";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, storage } from "@/plugins/firebase";
import { ref as reference, deleteObject } from "firebase/storage";
import { useSongStore } from "@/stores/song";

const props = defineProps({
  song: {
    type: Object,
    required: true,
  },
  index: {
    type: [String, Number],
    required: true,
  },
  onUpdateSong: {
    type: Function,
    required: true,
  },
});

const emit = defineEmits(["deleteSong"]);

const songStore = useSongStore();

const isEditing = ref(false);
const isLoading = ref(false);
const isUpdated = ref(false);

const schema = ref({
  name: "required|min:3|max:100",
  genre: "alpha_spaces|min:3|max:100",
});
const songData = ref({
  name: props.song.modified_name,
  genre: props.song.genre,
});

function editSong() {
  isEditing.value = !isEditing.value;
  songStore.hasUnsavedChanges = true;
}

async function deleteSong() {
  if (confirm("Do you really want to delete?")) {
    try {
      await deleteDoc(doc(db, "songs", props.song.id));

      const songRef = reference(storage, `songs/${props.song.original_name}`);

      // Delete the file
      deleteObject(songRef)
        .then(() => {
          // File deleted successfully
          emit("deleteSong", props.index);
        })
        .catch((error) => {
          console.log("An error occurred", error);
        });
    } catch (e) {
      console.log("Error deleting song.", e);
    }
  }
}

async function updateSong(values) {
  isLoading.value = true;

  const songRef = doc(db, "songs", props.song.id);

  try {
    await updateDoc(songRef, {
      modified_name: values.name,
      genre: values.genre,
    });

    props.onUpdateSong(props.index, values);

    isLoading.value = false;
    isUpdated.value = true;

    setTimeout(() => {
      isUpdated.value = false;
    }, 3000);
  } catch (e) {
    isLoading.value = false;
    console.log("Error updating", e);
  }
}
</script>
