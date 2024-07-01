import axios from "axios";
import { Message, MessageBox } from "@lui/lui-ui";
import store from "@/store/national/index.js";
import { cacheClear } from "@/api/user";
import isIntranet from "./isIntranet.js";
import Cookies from "js-cookie";

// create an axios instance
const service = axios.create({
  baseURL: "/lcp-rest/", // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000, // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    config.headers["Account-Type"] = isIntranet() ? "erp" : "passport";
    //request请求头加上supplierId
    config.headers["supplierId"] = Number(Cookies.get("supplierId")) || -1;
    config.headers["X-Requested-With"] = "XMLHttpRequest";
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

let intranetLoginMessageBoxVisible = false;
let extranetLoginMessageBoxVisible = false;

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const { data, config } = response;

    // if the custom code is not 20000, it is judged as an error.
    if (data.code === 20000) {
      return data;
    } else {
      if (data.code !== "999999") {
        Message({
          message: data.message,
          type: "error",
        });
        console.log(data);
      }
      if (data.code === "999999" && data.error === "NotLogin") {
        // 外网登录态失效
        if (config.url !== "/lcp-rest/hrInfo/getUserInfo") {
          if (!extranetLoginMessageBoxVisible) {
            extranetLoginMessageBoxVisible = true;
            reLogin();
          }
        }
      }
      return Promise.reject(data);
    }
  },

  (error) => {
    if (error.response) {
      //发出的请求收到了response，但非2XX状态码
      if (error.response.status === 520 || error.response.status === 401) {
        if (!error.config.url.includes("/hrInfo/getUserInfo")) {
          //弹窗计数，当出现多个401请求，只打开一次
          if (!intranetLoginMessageBoxVisible) {
            intranetLoginMessageBoxVisible = true;
            reLogin();
          }
        } else {
          if (isIntranet()) {
            store.dispatch("user/resetUser");
            sessionStorage.setItem("store", JSON.stringify(store.state));
            const {
              response: {
                headers: { location = "" },
              },
            } = error;
            const formatLocation = location
              .split("&")
              .filter((item) => !item.includes("redirect_uri"))
              .join("&");
            const redirectUri = encodeURIComponent(window.location.href);
            window.location.href = `${formatLocation}&redirect_uri=${redirectUri}`;
          }
        }
      }
    } else if (error.request) {
      // 请求发出，但没有收到response
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      //设置触发错误的请求时，message信息
      console.log("Error", error.message);
    }
    console.log(error.config);

    return Promise.reject(error);
  }
);

const reLogin = () => {
  store.dispatch("user/resetUser");
  sessionStorage.setItem("store", JSON.stringify(store.state));
  MessageBox.confirm("您的登录状态已失效，是否重新登录？", "提示", {
    confirmButtonText: "登录",
    cancelButtonText: "不登录",
    type: "warning",
  })
    .then(async () => {
      intranetLoginMessageBoxVisible = false;
      extranetLoginMessageBoxVisible = false;
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
      intranetLoginMessageBoxVisible = false;
      extranetLoginMessageBoxVisible = false;
    });
};
export default service;
