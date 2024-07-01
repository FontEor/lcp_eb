<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="index"
        :label="item"
        :name="item"
      >
        <MessageTable v-if="activeName === item" :msgType="index + 1" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import request from "@/utils/request";
import MessageTable from "./messagetable";
export default {
  components: {
    MessageTable,
  },
  data() {
    return {
      activeName: "",
      tabList: [],
      tabTable: ["", this.$t('messageManager.message.5ix0l9sive40'), this.$t('messageManager.message.5ix0l9sive41')],
    };
  },
  async mounted() {
    const url = "/message/getMsgType";
    const method = "get";
    const response = await request({ url, method }).catch((error) => {
      throw error;
    });
    if (response.code === 20000) {
      if (response.data && response.data.length > 0) {
        response.data.forEach((item) => {
          this.tabList.push(this.tabTable[item]);
        });
        this.activeName = this.tabList[0];
      }
    }
  },
};
</script>
