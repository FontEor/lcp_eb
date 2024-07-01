import isIntranet from "@/utils/isIntranet.js";

const pageClick = (intranetId = "", extranetId = "") => {
  const intranetEnvTable = {
    prod: `pageclick|keycount|${intranetId}`
  };
  const extranetEnvTable = {
    prod: `pageclick|keycount|${extranetId}`
  };
  if (isIntranet()) {
    return intranetId ? intranetEnvTable[window.env.baseEnv] || "" : "";
  } else {
    return extranetId ? extranetEnvTable[window.env.baseEnv] || "" : "";
  }
};
export default pageClick;
