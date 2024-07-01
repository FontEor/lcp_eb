import Vue from "vue";
import Router from "vue-router";
import isIntranet from "@/utils/isIntranet.js";
import intranetRoutes from "@/router/national/intranetRoutes.js";
import extranetRoutes from "@/router/national/extranetRoutes.js";
import store from "@/store/national/index.js";
Vue.use(Router);

const baseRoutes = [
  {
    path: "/404",
    component: () => import("@/views/common/404.vue"),
    hidden: true,
  },
  {
    path: window.__MICRO_APP_BASE_ROUTE__ || "/",
    name: "Home",
    redirect: (to) => {
      // 根据内外网环境判断控制台根路由重定向路径
      return isIntranet() ? "/openBiz" : "/appManager";
    },
  },
  { path: "*", redirect: "/404", hidden: true },
];
// 根据内外网环境加载不同路由表
const routes = isIntranet()
  ? baseRoutes.concat(intranetRoutes)
  : baseRoutes.concat(extranetRoutes);

const createRouter = () =>
  new Router({
    mode: "hash",
    scrollBehavior: () => ({ y: 0 }),
    routes,
  });

const router = createRouter();
// Add route but not showed in menus

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export const commitRouters = () => {
  if (!isIntranet()) {
    store.commit("app/setMenus", extranetRoutes);
  } else {
    store.commit("app/setMenus", intranetRoutes);
  }
};

export default router;
