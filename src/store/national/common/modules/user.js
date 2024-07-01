import { login, getInfo, cacheClear } from "@/api/user";
import { removeToken } from "@/utils/auth";
import { resetRouter } from "@/router/national/index.js";
import Cookies from "js-cookie";
import apiIntranetLcp from "@/api/intranet/lcp/index.js";
import {
  getQueryStringParamValue,
  getUrlWithoutSsoServiceTicket,
} from "@/utils/index.js";
import isIntranet from "@/utils/isIntranet.js";

const namespaced = true;

const state = () => ({
  // 前置路由守卫放行参数
  routerBeforeEachNextParams: null,
  /**
   * token
   */
  token: "",
  /**
   * 名字
   */
  name: "",
  /**
   * 头像地址
   */
  headImg: "",
  /**
   * 账号
   */
  user_pin: "",
  /**
   * 是否是开发者
   */
  user_develop: "no",
  /**
   * 登录状态
   */
  loginState: false,
  /**
   * 消息总数
   */
  msgCount: 0,
});

const mutations = {
  SET_ROUTER_BEFORE_EACH_NEXT_PARAMS: (state, routerBeforeEachNextParams) => {
    state.routerBeforeEachNextParams = routerBeforeEachNextParams;
  },
  SET_LOGIN_STATE: (state, loginState) => {
    state.loginState = loginState;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_HEAD_IMG: (state, headImg) => {
    state.headImg = headImg;
  },
  SET_USER_PIN: (state, pin) => {
    state.user_pin = pin;
  },
  SET_USER_DEVELOP: (state, develop) => {
    state.user_develop = develop;
  },
  SET_MSG_COUNT: (state, msgCount) => {
    state.msgCount = msgCount;
  },

  resetState: (state) => {
    Object.assign(state, {
      token: "",
      name: "",
      headImg: "",
      user_pin: "",
      user_develop: "no",
      loginState: false,
      msgCount: 0,
    });
  },
};

const actions = {
  // 内网设置token
  // async set_token() {
  //   const url = location.href;
  //   const key = "sso_service_ticket";
  //   const ticket = getQueryStringParamValue(url, key);
  //   const domain = ".jdl.com";
  //   const params = { ticket, domain };
  //   return await apiIntranetLcp.cookies.erp.set_token(params).catch((error) => {
  //     throw new Error(`set_token, ${error}`);
  //   });
  // },
  async setOidcToken() {
    const url = location.href;
    const code = getQueryStringParamValue(url, "code");
    const state = getQueryStringParamValue(url, "state");
    const domain = ".jdl.com";
    const params = { code, state, domain };
    return await apiIntranetLcp.cookies.erp
      .setOidcToken(params)
      .catch((error) => {
        throw new Error(`setOidcToken, ${error}`);
      });
  },
  // 内网获取用户信息
  async intranetGetUserInfo() {
    return await apiIntranetLcp.hrInfo.getUserInfo().catch((error) => {
      throw new Error(`intranetGetUserInfo, ${error}`);
    });
  },

  // 内网设置token
  // async handleSetToken({ dispatch }) {
  //   await dispatch("set_token").catch((error) => {
  //     throw new Error(`handleSetToken, ${error}`);
  //   });
  // },
  async handleSetOidcToken({ dispatch }) {
    await dispatch("setOidcToken").catch((error) => {
      throw new Error(`handleSetOidcToken, ${error}`);
    });
  },
  // 内网获取用户信息
  async handleIntranetGetUserInfo({ dispatch, commit }) {
    const { data } = await dispatch("intranetGetUserInfo").catch((error) => {
      throw new Error(`handleIntranetGetUserInfo, ${error}`);
    });
    const { name, headImg, userPin, develop, supplierId, supplierCode } =
      data || {};
    commit("SET_NAME", name);
    commit("SET_HEAD_IMG", headImg);
    commit("SET_USER_PIN", userPin);
    commit("SET_USER_DEVELOP", develop);
    commit("SET_LOGIN_STATE", true);
    Cookies.set("supplierId", supplierId);
    Cookies.set("groupCode", supplierCode);
    if (Number(Cookies.get("supplierId")) === -1) {
      let redirectNextLink = location.href;
      // const index = redirectNextLink.indexOf("sso_service_ticket=");
      // if (index > -1) {
      //   redirectNextLink = redirectNextLink.substring(0, index - 1);
      // }
      const codeIndex = redirectNextLink.indexOf("code=");
      const hasState = redirectNextLink.includes("state=");
      if (codeIndex > -1 && hasState) {
        redirectNextLink = redirectNextLink.substring(0, codeIndex - 1);
      }
      sessionStorage.setItem("redirectNextLink", redirectNextLink);
      location.href = `//${window.env.intranetHost}/#/chooseSupplier`;
    } else {
      // const ssoServiceTicket = getQueryStringParamValue(
      //   location.href,
      //   "sso_service_ticket"
      // );
      // if (!ssoServiceTicket) {
      //   return;
      // }
      const code = getQueryStringParamValue(location.href, "code");
      const state = getQueryStringParamValue(location.href, "state");
      if (!(code && state)) {
        return;
      }
      const [, path] = location.href.split("?code=")[0].split("#");
      commit("SET_ROUTER_BEFORE_EACH_NEXT_PARAMS", { path });
      location.href = location.href.split("?code=")[0];
    }
  },

  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then((response) => {
          const { data } = response;
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  /**
   * 给是否是开发者的状态赋值为yes
   * @param {*} param0
   * @param {*} val
   */
  setUserDevelopYes({ commit, state }, val) {
    commit("SET_USER_DEVELOP", "yes");
  },
  /**
   * 给是否是开发者的状态赋值为no ，目前没有引用此方法的
   * @param {*} param0
   * @param {*} val
   */
  setUserDevelopNo({ commit, state }, val) {
    commit("SET_USER_DEVELOP", "no");
  },
  /**
   * 获得用户信息
   * @param {*} param0
   */
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then((response) => {
          const data = response.data;
          if (!data) {
            reject("Verification failed, please Login again.");
          }
          commit("SET_NAME", data.name);
          commit("SET_HEAD_IMG", data.headImg);
          commit("SET_USER_PIN", data.userPin);
          commit("SET_USER_DEVELOP", data.develop);
          commit("SET_LOGIN_STATE", true);
          Cookies.set("supplierId", data.supplierId);
          Cookies.set("groupCode", data.supplierCode);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  /**
   * 重置用户信息
   * @param {*} param0
   */
  resetUser({ commit, state }) {
    commit("resetState");
  },

  /**
   * 内外网用户登录
   * @param {*} param0
   */
  // user logout
  async logout({ commit, state }) {
    sessionStorage.clear();
    removeToken(); // must remove  token  first
    resetRouter();
    await commit("resetState");
    if (!isIntranet()) {
      const returnUrl = `${window.location.origin}/#/home`;
      window.location.href = `${
        window.env.idaasLogoutDomain
      }/user1/logout?returnUrl=${encodeURIComponent(returnUrl)}`;
    } else {
      try {
        //退出登录调用接口清除sso cookie
        await cacheClear()
          .then((res) => {
            console.log(res);
          })
          .catch((error) => {
            console.log(error);
          });
        window.location.href = `${
          window.env.domainErp
        }/sso/logout?ReturnUrl=${encodeURIComponent(
          window.location.origin + "/#/home"
        )}`;
        //通过调后端接口，来清除cookie
      } catch (e) {
        window.location.href = `${window.location.origin}/#/home`;
      }
    }
  },
  /**
   * 删除token
   * @param {*} param0
   */
  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      commit("resetState");
      resolve();
    });
  },
  /**
   * 添加消息总数
   * @param {*} param0
   * @param {*} msgCount
   */
  // setMsgCount
  setMsgCount({ commit }, msgCount) {
    if (msgCount <= 0) {
      msgCount = 0;
    }
    commit("SET_MSG_COUNT", msgCount);
  },
  /**
   * 添加开发者
   * @param {*} param0
   * @param {*} develop
   */
  setDevelop({ commit }, develop) {
    if (develop) {
      commit("SET_USER_DEVELOP", develop);
    }
  },
};

const user = { namespaced, state, mutations, actions };

export default user;
