<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import SongSection from "@/components/SongSection.vue";
import CommentForm from "@/components/CommentForm.vue";
import SongComments from "@/components/SongComments.vue";
import { songsCollection, commentsCollection } from "@/plugins/firebase";
import { doc, getDoc, getDocs, query, where, updateDoc } from "@firebase/firestore";

const isLoading = ref(true);
const song = ref({});
const commentCount = ref(0);

const router = useRouter();
const route = useRoute();

const sortedBy = ref(1);

const comments = reactive([]);

const sortedComments = computed(() => {
  return comments.slice().sort((a, b) => {
    if (sortedBy.value == 1) {
      return new Date(b.created_at) - new Date(a.created_at);
    } else {
      return new Date(a.created_at) - new Date(b.created_at);
    }
  });
});

async function addComment(comment) {
  comments.push({
    id: comment.id,
    ...comment.data(),
  });
  commentCount.value += 1;

  const songRef = doc(songsCollection, route.params.id);
  await updateDoc(songRef, {
    comment_count: commentCount.value,
  });
}

function changeSorting(sortField) {
  sortedBy.value = sortField;

  if (route.query.sort != sortField) {
    router.push({
      query: {
        sort: sortField,
      },
    });
  }
}

async function getComments() {
  const q = query(commentsCollection, where("sid", "==", route.params.id));
  comments.splice(1);

  try {
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      comments.push({
        id: doc.id,
        ...doc.data(),
      });
    });
  } catch (e) {
    console.log("Error retrieving songs", e);
  }
}

onMounted(async () => {
  const docSnapshot = await getDoc(doc(songsCollection, route.params.id));

  if (docSnapshot.exists()) {
    const { sort } = route.query;
    if (sort == 1 || sort == 2) {
      sortedBy.value = sort;
    }

    song.value = docSnapshot.data();
    commentCount.value = song.value.comment_count;
    await getComments();

    isLoading.value = false;
  } else {
    alert("The song does not exist.");
    router.push({ name: "home" });
    return;
  }
});
</script>

<template>
  <div v-if="!isLoading">
    <song-section :song="song" />

    <comment-form
      :song-id="route.params.id"
      :comment-count="commentCount"
      @comment-added="addComment"
      @sorting-changed="changeSorting"
    />

    <song-comments :comments="sortedComments" />
  </div>
</template>
