<script>
import { defineComponent } from "vue";
import backgroundImage from "@/assets/img/header.png";

export default defineComponent({
  name: "IntroductionSection",
  setup() {
    return { backgroundImage };
  },
});
</script>

<template>
  <section class="relative mb-8 py-20 text-center text-white">
    <div
      class="introduction-bg absolute inset-0 h-full w-full bg-contain"
      :style="{
        'background-image': `url(${backgroundImage})`,
      }"
    ></div>
    <div class="container mx-auto">
      <div class="main-header-content text-white">
        <h1 class="mb-5 text-5xl font-bold">{{ $t("pages.home.listen") }}</h1>
        <p class="mx-auto w-full md:w-8/12">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et
          dolor mollis, congue augue non, venenatis elit. Nunc justo eros,
          suscipit ac aliquet imperdiet, venenatis et sapien. Duis sed magna
          pulvinar, fringilla lorem eget, ullamcorper urna.
        </p>
      </div>
    </div>

    <img
      class="relative mx-auto mt-5 -mb-20 block w-auto max-w-full"
      src="@/assets/img/introduction-music.png"
    />
  </section>
</template>
