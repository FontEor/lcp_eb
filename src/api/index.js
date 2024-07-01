import message from "@/api/module/message.js";
import openBiz from "@/api/module/openBiz.js";

import appManager from "@/api/module/appManager.js";
import apiManager from "@/api/apiManager/supplier.js"

// 统一注册API
const api = { message, openBiz, appManager, apiManager};

export default api;
