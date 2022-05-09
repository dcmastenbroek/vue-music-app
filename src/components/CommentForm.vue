<script setup>
import { ref } from "vue";
import { Field as VeeField, Form as VeeForm, ErrorMessage as VeeErrorMessage } from "vee-validate";
import { commentsCollection } from "@/plugins/firebase";
import { addDoc, getDoc } from "firebase/firestore";
import { useAuthStore } from "@/stores/auth";
import { useRoute } from "vue-router";

const authStore = useAuthStore();

const schema = ref({
  comment: "required|min:3|max:200",
});

const inSubmission = ref(false);
const isAdded = ref(false);

const props = defineProps({
  songId: {
    type: String,
    required: true,
  },
  commentCount: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["commentAdded", "sortingChanged"]);

const sortedBy = ref(1);

const route = useRoute();
const { sort } = route.query;
if (sort == 1 || sort == 2) {
  sortedBy.value = sort;
}

function onChange(event) {
  emit("sortingChanged", event.target.value);
}

async function addComment(values, { resetForm }) {
  inSubmission.value = true;

  try {
    const docRef = await addDoc(commentsCollection, {
      sid: props.songId,
      uid: authStore.user.uid,
      content: values.comment,
      created_at: new Date().toString(),
      name: authStore.user.displayName,
    });
    const commentSnapshot = await getDoc(docRef);

    emit("commentAdded", commentSnapshot);

    resetForm();

    isAdded.value = true;

    setTimeout(() => {
      isAdded.value = false;
    }, 3000);
  } catch (e) {
    console.error("Error adding comment: ", e);
  }

  inSubmission.value = false;
}
</script>

<template>
  <section class="container mx-auto mt-6">
    <div class="relative flex flex-col rounded border border-gray-200 bg-white">
      <div
        class="flex items-center justify-between border-b border-gray-200 px-6 pt-6 pb-5 font-bold"
      >
        <!-- Comment Count -->
        <span class="card-title">{{
          $t("pages.song.comment_count", commentCount, { count: commentCount })
        }}</span>
        <i class="fa fa-comments float-right text-2xl text-green-400"></i>
      </div>

      <div class="p-6">
        <vee-form v-if="authStore.isLoggedIn" :validation-schema="schema" @submit="addComment">
          <vee-field
            as="textarea"
            name="comment"
            class="block w-full rounded border border-gray-300 py-1.5 px-3 text-gray-800 transition duration-500 focus:border-black focus:outline-none"
          ></vee-field>
          <vee-error-message name="comment" class="mt-0.5 block text-red-600" />

          <div class="mt-4 flex items-center space-x-2">
            <button
              type="submit"
              class="rounded bg-green-600 py-1.5 px-3 text-white"
              :class="{ 'bg-gray-600': inSubmission }"
              :disabled="inSubmission"
            >
              <i v-if="inSubmission" class="fas fa-spinner fa-spin ml-2"></i>
              {{ $t("general.submit") }}
            </button>

            <span v-if="isAdded" class="text-base font-bold text-green-500">{{
              $t("general.added_comment")
            }}</span>
          </div>
        </vee-form>

        <!-- Comment Sorting -->
        <select
          v-model="sortedBy"
          class="mt-4 block rounded border border-gray-300 py-1.5 px-3 text-gray-800 transition duration-500 focus:border-black focus:outline-none"
          @change="onChange($event)"
        >
          <option value="1">{{ $t("general.latest") }}</option>
          <option value="2">{{ $t("general.oldest") }}</option>
        </select>
      </div>
    </div>
  </section>
</template>
