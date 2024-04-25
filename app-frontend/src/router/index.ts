// Composables
import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/store/user";
import path from "path";

const routes = [
  {
    path: "/",
    component: () => import("../layouts/default/Default.vue"),
    children: [
      {
        path: "",
        name: "Home",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/Home.vue"),
      },
      {
        path: "/admin",
        name: "Admin",
        component: () =>
          import(/* webpackChunkName: "admin" */ "@/views/Admin.vue"),
      },
      {
        path: "/:pathMatch(.*)*",
        redirect: "/", // redirect to home on 404
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {});

router.onError((error, to) => {
  if (
    error.message.includes("Failed to fetch dynamically imported module") ||
    error.message.includes("Importing a module script failed")
  ) {
    console.log("Router error", error);
    return to.fullPath;
  }
});

export default router;
