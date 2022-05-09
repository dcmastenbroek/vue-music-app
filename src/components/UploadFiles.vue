<script setup>
import { ref, reactive, onBeforeUnmount } from "vue";
import { storage, songsCollection } from "@/plugins/firebase";
import {
  ref as reference,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useAuthStore } from "@/stores/auth";
import { useSongStore } from "@/stores/song";
import { addDoc, getDoc } from "firebase/firestore";

const authStore = useAuthStore();
const songStore = useSongStore();

const isDragover = ref(false);
const isUploading = ref(false);

const fileUpload = ref(null);

let uploads = reactive([]);

function uploadFile(event) {
  isDragover.value = false;
  isUploading.value = true;

  const files = event.dataTransfer
    ? [...event.dataTransfer.files]
    : [...event.target.files];

  fileUpload.value.target = null;

  if (!navigator.onLine) {
    uploads.push({
      task: {},
      progress: 100,
      name: "Error",
      status: "error",
      error: "You cannot upload files when offline.",
    });
    return;
  }

  files.forEach((file) => {
    if (file.type !== "audio/mpeg") {
      alert("Wrong file type " + file.type);
      return;
    }

    const storageRef = reference(storage, `songs/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    const uploadIndex =
      uploads.push({
        task: uploadTask,
        progress: 0,
        name: file.name,
        status: "running",
        error: null,
      }) - 1;

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        uploads[uploadIndex].progress = progress;

        switch (snapshot.state) {
          case "paused":
            uploads[uploadIndex].status = "paused";
            break;
          case "running":
            uploads[uploadIndex].status = "running";
            break;
        }
      },
      (error) => {
        console.log("error uploading", error);
        uploads[uploadIndex].status = "error";
        uploads[uploadIndex].error = error.code;

        switch (error.code) {
          case "storage/unauthorized":
            break;
          case "storage/canceled":
            break;
          case "storage/unknown":
            break;
        }
      },
      async () => {
        // Upload completed successfully

        const song = {
          uid: authStore.user.uid,
          display_name: authStore.user.displayName,
          original_name: uploadTask.snapshot.ref.name,
          modified_name: uploadTask.snapshot.ref.name,
          genre: "",
          comment_count: 0,
        };

        // Get the download url for the song
        await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          song.url = downloadURL;
        });

        // Upload song
        try {
          const docRef = await addDoc(songsCollection, song);
          const docSnapshot = await getDoc(docRef);

          if (docSnapshot.exists()) {
            songStore.addSong(docSnapshot);
          } else {
            console.log("Could not add song to list.");
          }
        } catch (e) {
          console.error("Error adding song: ", e);
        }

        // Set upload status to finished
        uploads[uploadIndex].status = "finished";
      }
    );
  });

  isUploading.value = false;
}

// Clean up uploads when navigating away
onBeforeUnmount(() => {
  uploads.forEach((upload) => {
    upload.task.cancel();
  });
});
</script>

<template>
  <div class="relative flex flex-col rounded border border-gray-200 bg-white">
    <div class="border-b border-gray-200 px-6 pt-6 pb-5 font-bold">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-2xl text-green-400"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full cursor-pointer rounded border border-dashed border-gray-400 px-10 py-20 text-center text-gray-400 transition duration-500 hover:border-solid hover:border-green-400 hover:bg-green-400 hover:text-white"
        :class="{ 'border-solid border-green-400 bg-green-400': isDragover }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="isDragover = false"
        @dragover.prevent.stop="isDragover = true"
        @dragenter.prevent.stop="isDragover = true"
        @dragleave.prevent.stop="isDragover = false"
        @drop.prevent.stop="uploadFile($event)"
        @click="fileUpload.click()"
      >
        <h5>Click or drop your files here</h5>
        <input
          ref="fileUpload"
          type="file"
          multiple
          class="invisible hidden"
          @change="uploadFile($event)"
        />
      </div>

      <hr class="my-6" />

      <div v-for="upload in uploads" :key="upload.name" class="mb-4">
        <div
          class="text-sm font-bold"
          :class="{
            'text-red-400': upload.status === 'error',
            'text-blue-400': upload.status === 'running',
            'text-green-400': upload.status === 'finished',
          }"
        >
          <i
            v-if="upload.status === 'running'"
            class="fas fa-spinner fa-spin"
          ></i>
          <i v-else-if="upload.status === 'error'" class="fas fa-times"></i>
          <i v-else-if="upload.status === 'finished'" class="fas fa-check"></i>
          {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden rounded bg-gray-200">
          <div
            class="progress-bar transition-all"
            :class="{
              'bg-blue-400': upload.status === 'running',
              'bg-yellow-400': upload.status === 'paused',
              'bg-green-400': upload.status === 'finished',
              'bg-red-400': upload.status === 'error',
            }"
            :style="{ width: upload.progress + '%' }"
          ></div>
        </div>
        <div v-if="upload.error" class="text-red-400">{{ upload.error }}</div>
      </div>
    </div>
  </div>
</template>
