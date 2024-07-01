import axios from "axios";
import { Message, MessageBox } from "@lui/lui-ui";
import store from "@/store/national/index.js";
import { cacheClear } from "@/api/user";
import Cookies from "js-cookie";
import isIntranet from "@/utils/isIntranet.js";

let showReloginCount = 0;
// create an axios instance
const gwRequest = axios.create({
  // 本地配置了proxyTable之后不需要配置baseUrl，其他环境需要这个baseUrl
  baseURL: window.env.gatewayBaseApi, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000, // request timeout
  headers: {
    "LOP-DN": "inner.cloud.com",
    AppParams: window.env.gatewayPtnr,
    "X-Requested-With": "XMLHttpRequest",
  },
});

export const gwUploadRequest = axios.create({
  // 本地配置了proxyTable之后不需要配置baseUrl，其他环境需要这个baseUrl
  baseURL: window.env.gatewayFileBaseApi, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 100000, // request timeout
  headers: {
    "LOP-DN": window.env.gatewayUploadLopDn,
  },
});

export const gwUploadXmlRequest = axios.create({
  // 本地配置了proxyTable之后不需要配置baseUrl，其他环境需要这个baseUrl
  baseURL: window.env.gatewayFileBaseApi, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 100000, // request timeout
  headers: {
    "LOP-DN": window.env.gatewayUploadLopDnXml,
  },
});

const cipherInfo = {
  pkid: "132",
  pk: "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC/uVC+siRD8Kaiwq0xdXZe0LcgKQD/q33EDi5AJY7ClFDYOr0kJrkUpx16bWH5XCz4tMIN7N8gcVQ2IaMdrs6gtJFeOVtqUgylMoo6SUfN2okbADBg6yMTuRF8W20jBxqvi329VL5EWm9Nz+mnx0ipi1HA1otxOLq8bIfptEz0JwIDAQAB",
};

gwRequest.interceptors.request.use(
  (config) => {
    config.headers["supplierId"] = Number(Cookies.get("supplierId")) || -1;
    return config;
  },
  (error) => {
    console.log("supplierId interceptors error", error);
    return Promise.reject(error);
  }
);

gwRequest.interceptors.response.use(
  (response) => {
    const { error_response } = response.data;
    if (error_response) {
      Message.error("服务异常");
    }
    if (status === 401 || status === 520) {
      if (showReloginCount === 0) {
        showReloginCount = showReloginCount + 1;
        reLogin();
      }
      return;
    }
    return response;
  },
  (error) => {
    console.log("err" + error); // for debug
    return Promise.reject(error);
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
      showReloginCount = 0;
      //清除sso cookie
      await cacheClear();
      if (isIntranet()) {
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
      showReloginCount = 0;
    });
}

export default gwRequest;
