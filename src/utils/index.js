export const getQueryStringParamValue = (url = "", key) => {
  const urlStringList = url.split("?");
  const queryStringParams =
    urlStringList.length > 1 ? urlStringList[urlStringList.length - 1] : "";
  if (!queryStringParams) {
    return "";
  }
  const queryStringParamList = queryStringParams.split("&");
  const queryStringParam = queryStringParamList.find((queryStringParam) => {
    const [queryStringParamKey] = queryStringParam.split("=");
    return queryStringParamKey === key;
  });
  if (!queryStringParam) {
    return "";
  }
  const [, queryStringParamValue] = queryStringParam.split("=");
  return queryStringParamValue;
};

export const getUrlWithoutSsoServiceTicket = (url = "") => {
  const [urlWithoutQueryString, queryStringParams] = url.split("?");
  if (!queryStringParams) {
    return urlWithoutQueryString;
  }
  let queryStringParamList = queryStringParams.split("&");
  queryStringParamList = queryStringParamList.filter((queryStringParam) => {
    const [queryStringParamKey] = queryStringParam.split("=");
    return queryStringParamKey !== "sso_service_ticket";
  });
  const urlWithoutSsoServiceTicket = `${urlWithoutQueryString}?${queryStringParamList.join(
    "&"
  )}`;
  return urlWithoutSsoServiceTicket;
};

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    const exploreName = getExploreName();
    if (exploreName === "Safari") {
      // time=time.replace('T',' ')
      time = typeof time === "string" ? time.replace(".000+0000", "") : time;
      // date = new Date(time.replace(/ /g, "T"))
      date = new Date(time);
    } else {
      date = new Date(time);
    }
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    return value.toString().padStart(2, "0");
  });
  return time_str;
}

/**
 * 获取浏览器名称
 * @returns {string}
 */
function getExploreName() {
  var userAgent = navigator.userAgent;
  if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
    return "Opera";
  } else if (
    userAgent.indexOf("compatible") > -1 &&
    userAgent.indexOf("MSIE") > -1
  ) {
    return "IE";
  } else if (userAgent.indexOf("Edge") > -1) {
    return "Edge";
  } else if (userAgent.indexOf("Firefox") > -1) {
    return "Firefox";
  } else if (
    userAgent.indexOf("Safari") > -1 &&
    userAgent.indexOf("Chrome") == -1
  ) {
    return "Safari";
  } else if (
    userAgent.indexOf("Chrome") > -1 &&
    userAgent.indexOf("Safari") > -1
  ) {
    return "Chrome";
  } else if (!!window.ActiveXObject || "ActiveXObject" in window) {
    return "IE>=11";
  } else {
    return "Unkonwn";
  }
}

/**
 * @param {number} length
 * @returns {string}
 */
export function randomString(length) {
  if (arguments.length === 0) {
    length = 16;
  }
  var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
