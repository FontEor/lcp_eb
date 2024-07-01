import request_msg from "@/utils/request_msg";

const cookies = {
  erp: {
    /**
     * 内网设置token
     */
    // set_token: (params) =>
    //   request_msg.get("/cookies/erp/set_token", { params }),
    setOidcToken: (params) =>
      request_msg.get("/cookies/erp/setOidcToken", { params }),

    /**
     * 清除jdl.com域下cookies
     */
    logout: (params) =>
      request_msg.post("/cookies/erp/logout", null, { params }),
  },
};

export default cookies;
