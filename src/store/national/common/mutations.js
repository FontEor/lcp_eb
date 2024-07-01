const mutations = {
  setSandboxTableData(state, newData) {
    state.sandboxTableData = newData;
  },
  setNodeCode(state, newData) {
    state.nodeCode = newData;
    console.log(state.nodeCode)
  },
  setWaybillCode(state, newData) {
    state.wayBillCode = newData;
  },
  setOrderCode(state, newData) {
    state.orderCode = newData;
  },
};
export default mutations;
