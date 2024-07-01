import softwareSystem from "@/api/intranet/softwareSystem/index.js";

const tools = {
  namespaced: true,
  state: {
    dictionaryList: [],
    dictionary: {}
  },

  mutations: {
    // 更新字典列表
    updateDictionaryList(state, newValue) {
      state.dictionaryList = newValue;
    },
    // 根据字典列表更新字典
    updateDictionary(state) {
      const condition = state.dictionaryList && state.dictionaryList.length > 0;
      if (condition) {
        state.dictionary = state.dictionaryList.reduce((result, item) => {
          const { type, dictName, dictValue, remarks } = item;
          const value = dictValue;
          if (item) {
            if (!result[type]) {
              result[type] = {};
            }
            result[type][dictName] = { value, remarks };
          }
          return result;
        }, {});
      }
    }
  },

  actions: {
    // 软件系统-查询字段表数据
    async getDict() {
      return await softwareSystem.getDicts().catch(error => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("getDict");
      });
    },

    // 查询字典数据并更新字典列表与字典
    async getDictionaryList({ commit, dispatch }) {
      const response = await dispatch("getDict").catch(() => {
        throw new Error("getDictionaryList");
      });
      const { data } = response.data;
      commit("updateDictionaryList", data);
      commit("updateDictionary");
    }
  },

  getters: {
    // 判断字典是否具有属性
    hasDictionaryProperty(state) {
      return Boolean(Object.keys(state.dictionary).length);
    }
  }
};

export default tools;
