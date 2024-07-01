// 根据环境变量判断是否为内网
const hostnameList = ["dev-test-lcp.jdl.com","test-lcp.jdl.com", "uat-lcp.jdl.com", "lcp.jdl.com"];

const isIntranet = () => {
  const currentHostname = window.location.hostname;
  return hostnameList.includes(currentHostname);
};
export default isIntranet;
