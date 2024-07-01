import request from "@/utils/request.js";

const userManager = {
    /**
     * 同步IdaaS用户手机号
     */
    syncOutDeveloperFromIdaas: params =>
        request.get("/user/syncOutDeveloperFromIdaas", { params }),
};

export default userManager;