import Cookies from "js-cookie";

export function removeToken() {
  Cookies.set("needLogin", "false");
  Cookies.remove("supplierId");
  Cookies.remove("groupCode");
}
