<template>
  <div class="publish-records">
    <div v-if="list.length > 0">
      <el-timeline class="timeline-record">
        <el-timeline-item
          v-for="(item, index) in list"
          :key="index"
          :timestamp="formatPublishTime(item.publishTime)"
          placement="top"
        >
          <el-card>
            <p>发布人：{{ item.publisher }}</p>
            <p>发布原因：{{ item.publishReason }}</p>
            <p>发布审核人：{{ item.checker }}</p>
            <p>
              发布审核结果：{{ formatStatus(item.status) }};{{
                item.checkReason
              }}
            </p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
    <div class="no-data" v-else>
      <img src="@/assets/img/noData.png" />
      <p>暂无发布记录</p>
    </div>
  </div>
</template>
<script>
import gateway from "@/api/intranet/gateway/index.js";
import parseTime from "@/utils/parseTime.js";

export default {
  name: "messageManagerPublishRecords",
  data() {
    return {
      list: []
    };
  },
  mounted() {
    this.queryMessageUpdateLog();
  },
  methods: {
    formatStatus(status) {
      const hashMapStatus = ["初始化", "待审批", "通过", "驳回"];
      return hashMapStatus[status];
    },
    formatPublishTime(publishTime) {
      return parseTime.timeInTable(publishTime);
    },
    async queryMessageUpdateLog() {
      const topic = this.$route.params.topic;
      const data = { topic };
      const response = await gateway.messageAccessService
        .queryMessageUpdateLog([data])
        .catch(error => {
          throw new Error("queryMessageUpdateLog" + error);
        });
      this.list = response.data;
    }
  }
};
</script>
<style lang="scss" scoped>
.publish-records {
  .timeline-record {
    width: 60%;
  }
  .no-data {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
}
</style>
