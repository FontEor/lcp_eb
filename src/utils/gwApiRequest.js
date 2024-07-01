import axios from "axios";
import { Message, MessageBox } from "@lui/lui-ui";
import store from "@/store/national/index.js";
import { cacheClear } from "@/api/user";
import isIntranet from "@/utils/isIntranet.js";
import Cookies from "js-cookie";

let reLoginDialogVisible = false;
// create an axios instance
const gwApiRequest = axios.create({
  // 本地配置了proxyTable之后不需要配置baseUrl，其他环境需要这个baseUrl
  baseURL: window.env.gatewayApiDecoupling, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000, // request timeout
  headers: {
    "LOP-DN": window.env.gatewayApiDecouplingLop,
    "Account-Type": isIntranet() ? "erp" : "passport",
    "X-Requested-With": "XMLHttpRequest",
  },
});

gwApiRequest.interceptors.request.use(
  (config) => {
    config.headers["groupCode"] = Cookies.get("groupCode") || "";
    return config;
  },
  (error) => {
    console.log("gwApiRequest", error);
    return Promise.reject(error);
  }
);

gwApiRequest.interceptors.response.use(
  (response) => {
    const { status } = response;
    const { error_response } = response.data;
    if (error_response) {
      Message.error("服务异常");
      return Promise.reject(response);
    }
    if (status === 401 || status === 520) {
      if (!reLoginDialogVisible) {
        reLoginDialogVisible = true;
        reLogin();
      }
      return Promise.reject(response);
    }
    if (response.data.response) {
      const { code, message } = response.data.response;
      if (code === 20000) {
        return response.data.response;
      } else if (code === 10003) {
        return Promise.reject(response.data.response);
      } else {
        message && Message.error(message);
        return Promise.reject(response.data.response);
      }
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    const { status } = error.response;
    const { error_response } = error.response.data;
    if (error_response) {
      Message.error("服务异常");
    }
    if (status === 401 || status === 520) {
      if (!reLoginDialogVisible) {
        reLoginDialogVisible = true;
        reLogin();
      }
    }
    return Promise.reject(error.response);
  }
);

async function reLogin() {
  store.dispatch("user/resetUser");
  sessionStorage.setItem("store", JSON.stringify(store.state));
  MessageBox.confirm("您的登录状态已失效，是否重新登录？", "提示", {
    confirmButtonText: "登录",
    cancelButtonText: "不登录",
    type: "warning",
  })
    .then(async () => {
      reLoginDialogVisible = false;
      //清除sso cookie
      await cacheClear();

      if (isIntranet) {
        // window.location.href =
        //   `${window.env.domainErp}/sso/login?ReturnUrl=${encodeURIComponent(
        //     window.location.href
        //   )}` || ""; // erp内网 登录开启
        await store.dispatch("user/handleIntranetGetUserInfo");
      } else {
        window.location.reload();
      }
    })
    .catch(() => {
      reLoginDialogVisible = false;
    });
}

export default gwApiRequest;
