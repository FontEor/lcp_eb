import intranetStore from "./intranet/index.js";
import extranetStore from "./extranet/index.js";
import isIntranet from "@/utils/isIntranet.js";

const store = isIntranet() ? intranetStore : extranetStore;

export default store;
