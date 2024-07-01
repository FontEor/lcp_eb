// 开发环境地址
const config = {
  lcp_web_upgrade_i: "http://dev-test-lcp.jdl.com:8083",
  lcp_web_upgrade_e: "http://dev-test-cloud.jdl.com:8083",
};

// 线上环境地址
if (process.env.NODE_ENV === "production") {
  // 基座应用和子应用部署在同一个域名下，这里使用location.origin进行补全
  Object.keys(config).forEach((key) => {
    config[key] = window.location.origin;
  });
}

export default config;
