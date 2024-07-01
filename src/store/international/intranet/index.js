import Vue from "vue";
import Vuex from "vuex";
import commonModules from "../common/modules/index.js";
import commonGetters from "../common/getters.js";
import intranetModules from "./modules/index.js";

Vue.use(Vuex);

const modules = { ...commonModules, ...intranetModules };
const getters = { ...commonGetters };

const store = new Vuex.Store({
  modules,
  getters
});

export default store;
