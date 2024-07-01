import appManager from "@/api/extranet/appManager/index.js";
import applyQualification from "@/api/extranet/applyQualification/index.js"
import dashboard from "@/api/extranet/dashboard/index.js"

// 外网统一注册API
const apiExtranet = { appManager, applyQualification, dashboard };

export default apiExtranet;
