import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";

import { mount } from "@vue/test-utils";
import AboutView from "../AboutView.vue";

const $t = () => {};

describe("AboutView", () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia());
  });

  it("renders properly", () => {
    const wrapper = mount(AboutView, {
      global: {
        mocks: {
          $t,
        },
      },
    });
    expect(wrapper.text()).toContain("Lorem ipsum");
  });
});
