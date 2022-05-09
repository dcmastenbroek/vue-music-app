import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import "@/plugins/vee-validate";

import { mount } from "@vue/test-utils";
import AuthModal from "../AuthModal.vue";

const $t = () => {};

describe("AuthModal", () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia());
  });

  it("renders properly", () => {
    const wrapper = mount(AuthModal, {
      global: {
        mocks: {
          $t,
        },
      },
    });
    //expect(wrapper.text()).toContain("Login");
  });
});
