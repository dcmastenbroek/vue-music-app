import { createRouter, createWebHistory } from "vue-router";
import { getCurrentUser } from "@/plugins/firebase";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, savedPosition) {
    const scroll = {};

    if (savedPosition) {
      return savedPosition;
    }

    if (to.hash) {
      return {
        el: to.hash,
      };
    }

    if (to.meta.toTop) {
      scroll.top = 0;
    }

    if (to.meta.smoothScroll) {
      scroll.behavior = "smooth";
    }

    return scroll;
  },
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      component: () => import("@/views/AboutView.vue"),
      alias: "/about-app",
    },
    {
      path: "/manage",
      name: "manage",
      component: () => import("@/views/ManageView.vue"),
      meta: { requireAuth: true },
      beforeEnter: (to, from, next) => {
        next();
      }, // route specific guard
    },
    {
      path: "/song/:id",
      name: "song",
      component: () => import("@/views/SongView.vue"),
      props: true,
      meta: {
        toTop: true,
        smoothScroll: true,
      },
    },

    // Redirects
    {
      path: "/manage-songs",
      redirect: { name: "manage" },
    },

    // Catch all
    {
      path: "/:catchAll(.*)*",
      component: () => import("../views/ErrorView.vue"),
      props: { error: "404" },
    },
  ],
});

// Global navigation guard
router.beforeEach(async (to, from, next) => {
  const authStatus = await getCurrentUser();
  const requireAuth = to.matched.some((route) => route.meta.requireAuth);

  if (requireAuth && !authStatus) {
    next({ path: "/" });
  } else {
    next();
  }
});

export default router;
