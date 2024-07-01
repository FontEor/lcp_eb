import Vue from "vue";
import UmyUi from "umy-ui";
import "umy-ui/lib/theme-chalk/index.css"; // 引入样式
import App from "pages/national/App.vue";
import ElementUI, { Message } from "@lui/lui-ui";
import "@lui/lui-ui/lib/theme-chalk/index.css";
import Watermark from "@/components/watermark/watermark";
import VueClipboard from "vue-clipboard2"; //vue复制插件
import VueCodeMirror from "vue-codemirror";
import "codemirror/lib/codemirror.css";
import * as echarts from "echarts"; //ECharts
import "normalize.css/normalize.css"; // A modern alternative to CSS resets
import "@/styles/index.scss"; // global css
import "@/assets/wuliuyun/icons/iconfont.css";
import store from "@/store/national/index.js";
import "@/icons";
import "@/permission";
import router from "@/router/national/index.js";
import i18n from "@/locales/index.js";
import dayjs from "dayjs";
import "pages/national/public-path.js";
import microApp, { getActiveApps } from "@micro-zoe/micro-app";
import env from "@/env/index.js";

Vue.use(UmyUi);
Vue.use(ElementUI);
Vue.use(VueClipboard);
Vue.use(VueCodeMirror);

Vue.prototype.$echarts = echarts;
Vue.prototype.$dayjs = dayjs;

if (
  sessionStorage.getItem("store") &&
  sessionStorage.getItem("store") != null
) {
  store.replaceState(
    Object.assign({}, store.state, JSON.parse(sessionStorage.getItem("store")))
  );
}

window.addEventListener("beforeunload", () => {
  sessionStorage.setItem("store", JSON.stringify(store.state));
});

Vue.config.productionTip = false;
Vue.prototype.$watermark = new Watermark();
//定义一个新的Message方法，多传入一个offset参数，用于this.$messgae中修改offset中的初始值
const $message = (options) => {
  return Message({
    ...options,
    offset: 80,
  });
};
//重写一遍success的方法,将offset写入options
["success", "warning", "info", "error"].forEach((type) => {
  $message[type] = (options) => {
    if (typeof options === "string") {
      options = {
        message: options,
        offset: 80,
      };
    }
    options.type = type;
    return Message(options);
  };
});

// let envPath = `${
//   process.env.NODE_ENV === "production" ? "/admin" : ""
// }/config/env.json`;
// if (window.__MICRO_APP_ENVIRONMENT__) {
//   // 作为子应用运行
//   envPath =
//     `${__webpack_public_path__}/config/env.json`;
// }

// fetch(envPath)
//   .then((response) => response.json())
//   .then((data) => {
//     startMicro();
//     window.env = data;
//     new Vue({
//       el: "#lcp-web",
//       i18n,
//       router,
//       store,
//       render: (h) => h(App),
//     });
//   });

startMicro();
window.env = env;
window.microPushStatus = microPushStatus;
new Vue({
  el: "#lcp-web",
  i18n,
  router,
  store,
  render: (h) => h(App),
});
if (window.__MICRO_APP_ENVIRONMENT__) {
  // 作为子应用运行,可以在此处添加一些父子应用通信的事件
  addDataListener();
}
// window.microApp.dispatch({from:'lcp_web_upgrade',type: 'login'})

function startMicro() {
  microApp.start({
    tagName: "micro-app-lcp_web_upgrade",
  });
}
function microPushStatus(path, routeName) {
  if (!getActiveApps().includes("lcp_web_upgrade")) {
    router.push({ path });
  } else {
    microApp.setData("lcp_web_upgrade", { path, routeName });
  }
}

function addDataListener() {
  window.microApp.addDataListener((e) => {
    console.log(
      "子应用收到基座跳转路由通知开始跳转路由",
      e.routeName,
      router.push
    );
    if (e.routeName) {
      router.push({ name: e.routeName });
    }
  });
}
