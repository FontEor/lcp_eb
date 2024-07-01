<template>
  <div class="user-manager app-container">
    <div class="header_contain">
      <img class="header_img" src="@/assets/sandbox/iconHeader.png" alt="" />
      <span class="header_span">联调场景任务</span>
    </div>
    <div class="warning_info" v-if="isShowWarningInfo">
      <img
        class="warning_info_img"
        src="@/assets/sandbox/zriconWarning.png"
        alt=""
      />
      <span class="header_span"
        >沙箱工具为开发者提供参数用于测试环境的业务联调，您可查看<a
          href="https://cloud.jdl.com/#/devSupport/53009"
          target="_blank"
          :clstag="clstag('','SandBoxTool_1693313320392|2')"
          >沙箱工具使用手册</a
        >进行联调。 注：沙箱环境并非 100%
        与生产环境一致，接口的实际响应逻辑请以生产环境为准，沙箱环境开发调试完成后，仍然需要在生产环境进行测试验收。</span
      >
      <img
        class="warning_info_error_img"
        src="@/assets/sandbox/errorClose.png"
        alt=""
        @click="handleWarningInfo"
      />
    </div>
    <el-table :data="tableData" border>
      <el-table-column label="序号" type="index" width="100px" />
      <el-table-column prop="name" label="联调场景"> </el-table-column>
      <el-table-column prop="remark" label="场景说明"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button
            @click="handleJoinClick(scope.row)"
            type="text"
            size="small"
            :clstag="clstag('','SandBoxTool_1693313320392|3')"
            >进入联调</el-button
          >
          <el-button type="text" size="small" @click="handleCheckDoc"
            :clstag="clstag('','SandBoxTool_1693313320392|4')"
            >查看文档</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import sandboxStore from "@/store/national/extranet/modules/sandbox";
import basicInfo from "@/api/extranet/sandbox/index.js";
import pageClick from "@/utils/pageClick.js";
export default {
  name: "sandbox",
  components: {},
  data() {
    return {
      isShowWarningInfo: true,
      tableData: [],
    };
  },
  filters: {},
  computed: {},
  created() {},
  mounted() {
    this.findAllScene();
  },
  methods: {
    // 点击事件埋点
    clstag(intranetId, extranetId) {
      return pageClick(intranetId, extranetId);
    },
    handleWarningInfo() {
      this.isShowWarningInfo = false;
    },
    handleCheckDoc() {
      window.open(
        "https://cloud.jdl.com/#/open-business-document/api-doc/267/841",
        "_blank"
      );
      // 修改为你要跳转的链接
    },
    handleJoinClick(row) {
      sandboxStore.commit("setSandboxTableData", row);
      this.$router.push({
        name: "basicInfo",
      });
    },
    // 联调场景维护页面-查询全部
    async findAllScene() {
      await basicInfo
        .findAllScene()
        .then((res) => {
          this.tableData = res;
        })
        .catch((error) => {
          throw new Error(error, "findAllScene");
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.header_contain {
  display: flex;
  align-items: center;
  width: 120px;
  height: 24px;
  margin-bottom: 8px;
  .header_img {
    width: 12px;
    height: 14px;
    background: linear-gradient(
      130.13deg,
      rgba(60, 110, 240, 1) 0%,
      rgba(88, 134, 255, 1) 100%
    );
    border-radius: 2px;
    margin-right: 8px;
  }
  .header_span {
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 600;
    color: rgba(0, 0, 0, 1);
  }
}
.warning_info {
  position: relative;
  display: flex;
  align-items: center;
  // height: 32px;
  background: rgba(253, 242, 232, 1);
  border: 1px solid rgba(251, 219, 191, 1);
  border-radius: 4px;
  margin-bottom: 17px;
  .warning_info_img {
    width: 14px;
    height: 14px;
    margin-right: 13px;
    margin-left: 16px;
  }
  .warning_info_error_img {
    position: absolute;
    right: 16px;
    width: 12px;
    height: 12px;
  }
}
</style>
