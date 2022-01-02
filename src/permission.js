import router from "./router";
import store from "./store";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const hasToken = getToken();
  const hasUserInfo = store.getters.user;

  if (to.meta.auth) {
    // 需要登录
    if (hasUserInfo) {
      console.log("本地有信息，直接过");
      next();
      NProgress.done();
    } else {
      if (hasToken) {
        console.log("走whoami接口");
        const data = store.dispatch("user/whoami");
        if (typeof data === "string") {
          console.log("whoami没过，进入登录页");
          next(`/login?redirect=${to.path}`);
        } else {
          console.log("whoami过了，过");
          next();
          NProgress.done();
        }
      } else {
        console.log("啥也没有，去登录页面");
        next(`/login?redirect=${to.path}`);
      }
    }
  } else {
    // 不需要登录
    console.log("不需要登录，直接过");
    if (to.path === "/login" && hasUserInfo) {
      next("/");
    } else {
      next();
    }
    NProgress.done();
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
