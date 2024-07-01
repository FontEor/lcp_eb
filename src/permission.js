import router from "@/router/national/index.js";
import store from "@/store/national/index.js";
import { Message } from "@lui/lui-ui";
// import getPageTitle from "@/utils/get-page-title";
import Cookies from "js-cookie";
import request from "@/utils/request";
import iDaasRequest from "@/utils/idass-request";
import isIntranet from "@/utils/isIntranet.js";
import {
  getQueryStringParamValue,
  getUrlWithoutSsoServiceTicket,
} from "@/utils/index.js";

router.beforeEach(async (to, from, next) => {
  if (isIntranet()) {
    // document.title = getPageTitle(to.meta.title);
    const { user_develop, loginState } = store.getters;
    if (user_develop === "no") {
      if (loginState) {
        location.href = `//${window.env.intranetHost}/#/home`;
      } else {
        // const sso_service_ticket = getQueryStringParamValue(
        //   location.href,
        //   "sso_service_ticket"
        // );
        // if (sso_service_ticket) {
        const code = getQueryStringParamValue(location.href, "code");
        const state = getQueryStringParamValue(location.href, "state");
        if (code && state) {
          // await store.dispatch("user/handleSetToken");
          await store.dispatch("user/handleSetOidcToken");
          await store.dispatch("user/handleIntranetGetUserInfo");
        } else {
          // location.href = `${
          //   window.env.domainErp
          // }/sso/login?ReturnUrl=${encodeURIComponent(location.href)}`;
          await store.dispatch("user/handleIntranetGetUserInfo");
        }
      }
    } else {
      await store.dispatch("user/handleIntranetGetUserInfo");
      await store.dispatch("tools/getDictionaryList");
    }
    const { routerBeforeEachNextParams } = store.getters;
    if (routerBeforeEachNextParams) {
      store.commit("user/SET_ROUTER_BEFORE_EACH_NEXT_PARAMS", null);
      next(routerBeforeEachNextParams);
    } else {
      next();
    }
  } else {
    // document.title = getPageTitle(to.meta.title);
    const { user_develop, loginState } = store.getters;
    if (user_develop === "no") {
      //判断是否已经登录。已经登录：返回首页  未登录：下面的判断
      //未登录状态
      if (loginState) {
        location.href = `//${window.env.intranetHost}/#/home`;
      } else {
        try {
          await store
            .dispatch("user/getInfo")
            .then(async (data) => {
              const supplierId = Number(Cookies.get("supplierId"));
              if (supplierId === -1) {
                await request({
                  url: "/user/saveOutDeveloper",
                  method: "get",
                })
                  .then((res) => {
                    //自动入驻后将supplierId的值存入缓存
                    store.dispatch("user/setDevelop", res.data.develop);
                    Cookies.set("supplierId", res.data.supplierId);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
            })
            .catch((e) => {
              iDaasLogin();
            });
        } catch (e) {
          iDaasLogin();
        }
      }
    } else {
      getUserInfo("passport");
      // 进入控制台时获取字典，若字典存在，则不获取
      // !store.getters["tools/hasDictionaryProperty"] &&
      await store.dispatch("tools/getDictionaryList");
    }
    next();
  }
});

function getUserInfo(type) {
  if (type === "passport") {
    store
      .dispatch("user/getInfo")
      .then((data) => {
        const supplierId = Number(Cookies.get("supplierId"));
        if (supplierId === -1) {
          location.href = `${location.origin}/#/home`;
        } else {
          const ssoTicket = getQueryStringParamValue(
            location.href,
            "sso_service_ticket"
          );
          if (ssoTicket !== "") {
            location.href = getUrlWithoutSsoServiceTicket(location.href);
            location.reload();
          }
        }
      })
      .catch((e) => {
        console.log(e, "error");
      });
  }
}

function iDaasLogin() {
  iDaasRequest({
    url: "/getLogin",
    method: "get",
  })
    .then((rsp) => {
      if (rsp.data) {
        const { returnUrl } = rsp.data;
        if (returnUrl) {
          const index = returnUrl.indexOf("&returnUrl");
          if (index > -1) {
            window.location.href = `${window.location.origin}`;
            window.location.href =
              returnUrl
                .substring(0, index)
                .concat("&source=WLY_SAAS")
                .concat(
                  `&returnUrl=${encodeURIComponent(window.location.href)}`
                ) || "";
          }
        }
      }
    })
    .catch(async (error) => {
      console.log("异常信息: " + error);
      Message.error("账户IDaas系统出现异常,请联系相关开发人员");
      window.location.href = `${window.location.origin}`;
    });
}
