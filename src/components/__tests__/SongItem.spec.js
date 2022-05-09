import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import "@/plugins/vee-validate";

import { shallowMount } from "@vue/test-utils";
import SongItem from "../SongItem.vue";

const $t = () => {};

describe("SongItem", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("renders properly", async () => {
    const testSong = {
      id: 1,
      original_name: "Song Name",
      modified_name: "Modified Name",
      genre: "Genre",
    };

    const wrapper = shallowMount(SongItem, {
      global: {
        mocks: {
          $t,
        },
      },
      props: {
        song: testSong,
        index: 1,
        onUpdateSong() {},
      },
    });

    const songName = wrapper.find(".text-xl");
    expect(songName.text()).toBe(testSong.modified_name);

    await wrapper.find("#editButton1").trigger("click");
  });
});
