import Vue from "vue";
import Vuex from "vuex";
import commonModules from "../common/modules/index.js";
import commonGetters from "../common/getters.js";
import extranetModules from "./modules/index.js";
// import commonMutations from "../common/mutations";

Vue.use(Vuex);

const modules = { ...commonModules, ...extranetModules };
const getters = { ...commonGetters };
// const mutations = { ...commonMutations };

const store = new Vuex.Store({
  modules,
  getters,
  // mutations,
});

export default store;
