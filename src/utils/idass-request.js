import axios from "axios";
import { Message, MessageBox } from "@lui/lui-ui";
import store from "@/store/national/index.js";
import isIntranet from "@/utils/isIntranet.js";

// create an axios instance
const iDaasRequest = axios.create({
  baseURL: "/lcp-rest/", // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000, // request timeout
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
});

// request interceptor
iDaasRequest.interceptors.request.use(
  (config) => {
    config.headers["Account-Type"] = isIntranet() ? "erp" : "passport";
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
iDaasRequest.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code == "999999") {
      return response;
    }
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      Message({
        message: res.message || "Error",
        type: "error",
        duration: 5 * 1000,
        offset: 80,
      });

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm(
          "You have been logged out, you can cancel to stay on this page, or log in again",
          "Confirm logout",
          {
            confirmButtonText: "Re-Login",
            cancelButtonText: "Cancel",
            type: "warning",
          }
        ).then(() => {
          store.dispatch("user/resetToken").then(() => {
            location.reload();
          });
        });
      }
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  (error) => {
    if (error.response) {
      //发出的请求收到了response，但非2XX状态码
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      if (error.response.status === 520 || error.response.status === 401) {
        _520Error();
        return;
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
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000,
      offset: 80,
    });
    return Promise.reject(error);
  }
);

export default iDaasRequest;
