import softwareSystem from "@/api/intranet/softwareSystem/index.js";
import apiManager from "@/api/intranet/apiManager/index.js";
import openBusinese from "@/api/intranet/openBusinese/index.js"

// 内网统一注册API
const apiIntranet = { softwareSystem, apiManager, openBusinese };

export default apiIntranet;
