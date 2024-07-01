import select from "@/api/intranet/lcp/select.js";
import bizapinterface from "@/api/intranet/lcp/bizapinterface.js";
import bizunit from "@/api/intranet/lcp/bizunit.js";
import api from "@/api/intranet/lcp/api.js";
import assetTransfer from "@/api/intranet/lcp/assetTransfer.js";
import hrInfo from "@/api/intranet/lcp/hrInfo.js";
import user from "@/api/intranet/lcp/user.js";
import message from "@/api/intranet/lcp/message.js";
import supplier from "@/api/intranet/lcp/supplier.js";
import asset from "@/api/intranet/lcp/asset.js";
import lcpDict from "@/api/intranet/lcp/lcpDict.js";
import businesstype from "@/api/intranet/lcp/businesstype.js";
import bizmsg from "./bizmsg.js";
import sysResources from "./sysResources.js";
import sysVersion from "./sysVersion.js";
import sysResourcesExtendedField from "./sysResourcesExtendedField.js";
import cookies from "./cookies.js";
import releaseRecord from "./releaseRecord.js";
import jsf from "./jsf.js";

// 内网平台统一注册API
const lcp = {
  select,
  bizapinterface,
  bizunit,
  api,
  assetTransfer,
  hrInfo,
  user,
  message,
  supplier,
  asset,
  lcpDict,
  businesstype,
  bizmsg,
  sysResources,
  sysVersion,
  sysResourcesExtendedField,
  cookies,
  releaseRecord,
  jsf,
};

export default lcp;
