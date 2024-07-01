<template type="ElementUI">
  <div>
    <span v-if="history === 'exists'">
      <el-row>
        <el-col :span="12">
          <el-timeline key="1">
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :timestamp="activity.updateTime"
              placement="top"
            >
              <el-card>
                <div style="margin: 10px">
                  <p style="margin: 10px">更新人: {{ activity.updateUser }}</p>
                  <p style="margin: 10px">更新内容: {{ activity.remark }}</p>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-col>
      </el-row>
    </span>
    <span v-else-if="history === 'noExists'" key="2">
      <div class="no-data">
        <img src="@/assets/img/noData.png" />
        <p>暂无更新记录</p>
      </div>
    </span>
  </div>
</template>

<script>
import request from "@/utils/request.js";
import { parseTime } from "@/utils/index.js";
import gwApiRequest from "@/utils/gwApiRequest.js";

export default {
  data() {
    return {
      activities: [],
      history: "noExists",
    };
  },
  methods: {
    async findApiBaseInfo() {
      const url = "/ApiManagerService/findApiBaseInfo";
      const { id } = this.$route.params;
      const data = [{ id }];
      return await gwApiRequest.post(url, JSON.stringify(data));
    },

    //--2020-05-15
    //--事先根据ID获取完全限定名
    async fetchApiInstance() {
      const { data } = await this.findApiBaseInfo().catch(() => {
        throw new Error("fetchApiInstance findApiBaseInfo");
      });
      this.qualifiedName = data.qualifiedName;
      this.fetchUpdateHistory();
    },

    fetchUpdateHistory() {
      gwApiRequest({
        method: "post",
        url: "/ApiManagerService/queryUpdateLog",
        data: JSON.stringify([
          {
            pageSize: 10,
            pageNumb: 1,
          },
          {
            qualifiedName: this.qualifiedName,
          },
        ]),
      })
        .then((resp) => {
          let list = resp.data.list;
          let j = list.length;
          if (j > 0) {
            this.history = "exists";
            for (let i = 0; i < list.length; i++) {
              list[i].updateTime = parseTime(
                list[i].updateTime,
                "{y}-{m}-{d} {h}:{i}"
              );
              list[i].id = j;
              j--;
            }
            this.activities = list;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  created() {
    this.fetchApiInstance();
  },
};
</script>

<style lang="scss" scoped>
.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
