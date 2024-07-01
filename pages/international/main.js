import Vue from "vue";
import UmyUi from "umy-ui";
import "umy-ui/lib/theme-chalk/index.css"; // 引入样式
import App from "pages/international/App.vue";
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
import store from "@/store/international/index.js";
import "@/icons";
import "@/permission";
import router from "@/router/international/index.js";
import i18n from "@/locales/index.js";

Vue.use(UmyUi);
Vue.use(ElementUI, { i18n: (key, value) => i18n.t(key, value) });
Vue.use(VueClipboard);
Vue.use(VueCodeMirror);

Vue.prototype.$echarts = echarts;

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

fetch(
  `${process.env.NODE_ENV === "production" ? "/admin" : ""}/config/env.json`
)
  .then((response) => response.json())
  .then((data) => {
    window.env = data;

    new Vue({
      el: "#app",
      i18n,
      router,
      store,
      render: (h) => h(App),
    });
  });
