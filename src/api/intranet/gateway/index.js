import ApiManagerService from "@/api/intranet/gateway/ApiManagerService.js";
import OuterDomainService from "@/api/intranet/gateway/OuterDomainService.js";
import JsfApiMetaService from "@/api/intranet/gateway/JsfApiMetaService.js";
import JsfApiService from "@/api/intranet/gateway/JsfApiService.js";
import HttpApiService from "@/api/intranet/gateway/HttpApiService.js";
import CloudDomainService from "@/api/intranet/gateway/CloudDomainService.js";
import ApiDepotService from "@/api/intranet/gateway/ApiDepotService.js";
import messageAccessService from "@/api/intranet/gateway/messageAccessService.js";
import OuterDomainApiPluginPreService from "./OuterDomainApiPluginPreService.js";
import OuterDomainApiService from "./OuterDomainApiService.js";

// 内网网关统一注册API
const gateway = {
  ApiManagerService,
  OuterDomainService,
  JsfApiMetaService,
  JsfApiService,
  HttpApiService,
  CloudDomainService,
  ApiDepotService,
  messageAccessService,
  OuterDomainApiPluginPreService,
  OuterDomainApiService,
};

export default gateway;
