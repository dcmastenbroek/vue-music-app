import NProgress from "nprogress";

export default (router) => {
  router.beforeResolve((to, from, next) => {
    if (to.name) {
      NProgress.start();
    }

    next();
  });

  router.afterEach(() => {
    NProgress.done();
  });
};
