<template>
  <div>
    <span v-if="history === 'exists'">
      <el-row>
        <el-col :span="12">
          <el-timeline key="1">
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :timestamp="
                activity.updateTime | parseTimefilter('{y}-{m}-{d} {h}:{i}')
              "
              placement="top"
            >
              <el-card>
                <div style="margin: 10px">
                  <p style="margin: 10px">发布人: {{ activity.updateUser }}</p>
                  <p style="margin: 10px">发布内容: {{ activity.remark }}</p>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-col>
      </el-row>
    </span>
    <span v-else-if="history === 'noExists'" key="2">
      <div style="margin-top: 0px; text-align: center">
        <img src="@/assets/img/noData.png" />
      </div>
      <div class="noDataMessage">还没有发布过哦～</div>
    </span>
  </div>
</template>

<script>
import request from "@/utils/request";
import { parseTime } from "@/utils";
import { Message } from "@lui/lui-ui";

export default {
  name: "ReleaseRecords",
  data() {
    return {
      history: "noExists",
      unitId: "",
      activities: [],
    };
  },
  filters: {
    parseTimefilter(obj, fomart) {
      if (obj) {
        return parseTime(obj, fomart);
      }
    },
  },
  created() {
    this.unitId = this.$route.params.id;
    this.queryUpdateLog();
  },
  methods: {
    queryUpdateLog() {
      this.loading = true;
      let url = "/bizunit/getUpdateLog";
      request({
        url: url,
        method: "get",
        params: { unitId: this.unitId },
      })
        .then((rsp) => {
          if (rsp.data) {
            this.activities = rsp.data;
            if (this.activities && this.activities.length > 0) {
              this.history = "exists";
            }
          } else {
            Message.error("无权限查看数据");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>

<style scoped>
.nohistory {
  width: 158px;
  height: 400px;
  margin: 0 auto;
  vertical-align: middle;
  color: #646464;
  font-size: 20px;
  font-family: PingFangSC-Medium;
}
.noDataMessage {
  width: 100%;
  margin: 0 auto;
  margin-top: 0px;
  text-align: center;
  vertical-align: middle;
}
</style>
