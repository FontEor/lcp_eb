// const sandbox = {
//   namespaced: true,
//   state: () => ({
//     sandboxTableData: {
//       code: "sandbox_kuaidi",
//       createTime: 1693465474000,
//       createUser: "huangjunjie42",
//       id: 1,
//       name: "京东快递-B2C/C2C正向下单",
//       parentId: 0,
//       seq: 0,
//       unitCode: "testtest",
//       unitName: "testtest",
//       updateTime: 1694512323000,
//       updateUser: "huangjunjie42",
//       remark: "remark",
//     },
//     nodeCode: "receiveTaskAssignment", //"merchantOrder",
//     wayBillCode: "xxxxx", //运单号
//     orderCode: "xxxxx", //订单号
//   }),
// };

// export default sandbox;

// import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";
import Vuex from "vuex";
// import mutations from "../../common/mutations";
// 创建一个新的 store 实例
const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});
const sandboxStore = new Vuex.Store({
  state() {
    return {
      sandboxTableData: {
        code: "",
        createTime: 1693465474000,
        createUser: "",
        id: 1,
        name: "",
        parentId: 0,
        seq: 0,
        unitCode: "",
        unitName: "",
        updateTime: 1694512323000,
        updateUser: "",
        remark: "",
      },
      nodeCode: "merchantOrder", // "receiveTaskAssignment", //"merchantOrder",
      wayBillCode: "", //运单号
      orderCode: "", //订单号
    };
  },
  mutations: {
    setSandboxTableData(state, newData) {
      state.sandboxTableData = newData;
    },
    setNodeCode(state, newData) {
      state.nodeCode = newData;
    },
    setWayBillCode(state, newData) {
      state.wayBillCode = newData;
    },
    setOrderCode(state, newData) {
      state.orderCode = newData;
    },
  },
  plugins: [vuexLocal.plugin],
});
export default sandboxStore;
