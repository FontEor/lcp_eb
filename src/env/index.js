import testEnv from "./env.test.js";
import uatEnv from "./env.uat.js";
import productionEnv from "./env.production.js";
import devTestEnv from "./env.dev-test.js";

const hostname = window.location.hostname;
const envKey = hostname.split(".")[0] || '';
const envMap = {
  "dev-test-lcp": devTestEnv,
  "test-lcp": testEnv,
  "uat-lcp": uatEnv,
  lcp: productionEnv,
  "dev-test-cloud": devTestEnv,
  "test-cloud": testEnv,
  "uat-cloud": uatEnv,
  cloud: productionEnv,
};
export default envMap[envKey];
