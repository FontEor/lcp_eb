<template>
  <div class="subscribe-version">
    <div>
      <!-- 顶部tag信息 -->
      <TagTip :closable="false">
        可在当前页给租户开通版本
        <a class="anchor initColor" :href="hrefHelpDocument" target="_blank"
          >新手帮助文档</a
        >
      </TagTip>
    </div>
    <el-row>
      <el-col :span="12"
        ><el-page-header @back="back" content="版本详情"></el-page-header
      ></el-col>
      <el-col :span="12">
        <el-tooltip
          v-if="openVersionDisabled"
          content="当前租户已开通版本，若要修改版本请回收当前版本再下发。"
          placement="top-end"
        >
          <el-button
            class="open-version--disabled"
            style="float: right"
            type="primary"
            @click="createVersion"
            >开通版本</el-button
          >
        </el-tooltip>
        <el-button
          v-else
          style="float: right"
          type="primary"
          @click="createVersion"
          >开通版本</el-button
        >
      </el-col>
    </el-row>
    <br />
    <el-table
      :data="subscribeVersionTable"
      :row-class-name="rowClassName"
      :header-cell-style="{ 'text-align': 'left' }"
    >
      <el-table-column label="序号" type="index" align="left" width="64" />
      <el-table-column label="版本名称" prop="versionName" align="left" />
      <el-table-column label="版本号" prop="versionCode" />
      <el-table-column label="开通环境" prop="envName" align="left" />
      <el-table-column label="开通状态" prop="statusName" align="left">
        <template slot-scope="scope">
          <span :class="getColor(scope.row.status)">
            {{ scope.row.statusName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" prop="createUser" align="left" />
      <el-table-column label="开通时间" prop="createTime" align="left">
        <template slot-scope="scope">
          <span>{{
            scope.row.createTime | parseTimefilter("{y}-{m}-{d} {h}:{i}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="activateId" align="left">
        <template slot-scope="scope">
          <el-button
            type="text"
            :disabled="statusDisabled(scope.row.status)"
            v-on:click="closeVersion(scope.row.activateId)"
            >关闭版本</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="24">
        <pagination
          v-show="listQuery.total"
          :total="listQuery.total"
          :pageSizes.sync="listQuery.pageSizes"
          :page.sync="listQuery.pageNumb"
          :limit.sync="listQuery.pageSize"
          v-on:pagination="paginationChange"
          style="margin: 0px; float: right"
        />
      </el-col>
    </el-row>
    <div>
      <el-dialog
        width="40%"
        :visible.sync="dialog"
        title="开通版本"
        :before-close="onClose"
        @close="checkOpenVersionDisabled"
      >
        <steps v-bind="stepsObj" />
        <SelectVersion
          v-if="progress == 0 && dialog"
          :tenementInfo="tenementInfo"
          :systemMessage="systemMessage"
          :subscribeVersionForm="subscribeVersionForm"
          @next="next"
          @onCancel="onCancel"
        ></SelectVersion>
        <SelectEnvironment
          v-if="progress == 1 && dialog"
          @next="next"
          @back="previous"
          @onCancel="onCancel"
          :tenementInfo="tenementInfo"
          :systemMessage="systemMessage"
          :subscribeVersionForm="subscribeVersionForm"
        ></SelectEnvironment>
        <Finish v-if="progress == 2" @onCancel="onCancel"></Finish>
      </el-dialog>
    </div>
    <div>
      <el-dialog
        title="确认关闭"
        :visible.sync="closeDialog"
        width="40%"
        @close="checkOpenVersionDisabled"
      >
        <span>关闭后，下发给该租户的资源一并删除，已授权用户将没有权限。</span
        ><span style="color: red">谨慎操作！</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog = false">取 消</el-button>
          <el-button type="primary" @click="deleteVersion()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
import { parseTime } from "@/utils";
import steps from "@/components/steps/index.vue";
import Pagination from "@/components/Pagination/index.vue";
import SelectVersion from "./selectVersion.vue";
import SelectEnvironment from "./selectEnvironment.vue";
import Finish from "./finish.vue";
import softwareSystem from "@/api/intranet/softwareSystem/index.js";

export default {
  props: {
    tenementInfo: Object,
    systemMessage: Object,
  },
  components: {
    TagTip: () => import("@/components/common/TagTip.vue"),
    Pagination,
    steps,
    SelectVersion,
    SelectEnvironment,
    Finish,
  },
  data() {
    return {
      openVersionDisabled: false,
      subscribeVersionTable: [],
      listQuery: {
        total: 1,
        pageNumb: 1,
        pageSize: 10,
        pageSizes: [10, 20, 40, 60],
      },
      dialog: false,
      stepsObj: {},
      stepsList: [
        {
          active: 0,
          tiptitle: ["选择版本", "选择同步环境", "完成"],
        },
        {
          active: 1,
          tiptitle: ["选择版本", "选择同步环境", "完成"],
        },
        {
          active: 2,
          tiptitle: ["选择版本", "选择同步环境", "完成"],
        },
      ],
      progress: 0,
      closeDialog: false,
      colseVersionId: 0,
      //开通版本提交的表单
      subscribeVersionForm: {},
      hrefHelpDocument: "//lcp.jdl.com/#/newHand/53054",
    };
  },

  filters: {
    parseTimefilter(obj, fomart) {
      if (obj) {
        return parseTime(obj, fomart);
      } else {
        return "";
      }
    },
  },
  methods: {
    // 软件系统-订阅-查看版本-获得禁止开通的环境，用于置灰选项
    async activatedEnvs() {
      const productId = this.systemMessage.id;
      const tenementId = this.tenementInfo.id;
      const params = { productId, tenementId };
      return await softwareSystem.activatedEnvs(params).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("activatedEnvs");
      });
    },
    // 软件系统-订阅-查看版本-获取环境列表
    async envGet() {
      const productId = this.systemMessage.id;
      const type = "USF";
      const params = { productId, type };
      return await softwareSystem.envGet(params).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("envGet");
      });
    },

    // 检查开通版本禁用
    async checkOpenVersionDisabled() {
      const envGetResponse = await this.envGet().catch(() => {
        throw new Error("envGet");
      });
      const envList = envGetResponse.data.data;
      const activatedEnvsResponse = await this.activatedEnvs().catch(() => {
        throw new Error("activatedEnvs");
      });
      const activatedEnvList = activatedEnvsResponse.data.data;
      // 对比环境列表与开通流程环境列表，若全部环境均处于开通状态，则禁用开通版本
      this.openVersionDisabled = envList.every((envItem) => {
        const { id } = envItem;
        return activatedEnvList.some(
          (activatedEnvItem) => id === activatedEnvItem.id
        );
      });
    },
    /**
     * 回退到订阅关系页
     */
    back() {
      this.$emit("back");
    },
    /**
     * 开通 新版本
     */
    createVersion() {
      if (this.openVersionDisabled) return;
      this.stepsObj = this.stepsList[this.progress];
      this.dialog = true;
    },
    /**
     * 表格换页
     */
    paginationChange(p) {
      this.listQuery.pageNumb = p.page;
      this.listQuery.pageSize = p.limit;
      this.getActivateVersionList();
    },
    /*
     *dialog 关闭前的回调，会暂停 Dialog 的关闭
     */
    onClose(done) {
      this.refresh();
      done();
      this.progress = 0;
    },
    /**
     * dialog 取消操作
     * */
    onCancel() {
      this.refresh();
      this.progress = 0;
      this.dialog = false;
    },
    refresh() {
      this.initSubscribeVersionForm();
      this.getActivateVersionList();
    },
    /**
     * 初始化开通版本需要提交的表单
     */
    initSubscribeVersionForm() {
      this.subscribeVersionForm = {
        tenementName: this.tenementInfo.tenementName,
        tenementCode: this.tenementInfo.tenementCode,
        versionId: 0,
        versionCode: "",
        versionName: "",
        remark: "",
      };
    },
    /**
     * 上一步
     */
    previous() {
      if (this.progress > 0) {
        this.progress--;
        this.stepsObj = this.stepsList[this.progress];
      }
    },
    /**
     * 下一步
     */
    next() {
      if (this.progress < 2) {
        this.progress++;
        this.stepsObj = this.stepsList[this.progress];
      }
    },
    /**
     * 在关闭前需要打开提示框
     */
    closeVersion(activateId) {
      this.closeDialog = true;
      this.colseVersionId = activateId;
    },
    /**
     * 确定关闭了，往后端发送请求
     */
    deleteVersion() {
      //0代表没有获取到订阅版本的id
      if (this.colseVersionId === 0) {
        return;
      }
      let url = "/saas/system/tenement/version/activate/close";
      request({
        url: url,
        method: "post",
        params: {
          activateId: this.colseVersionId,
        },
      })
        .then((rsp) => {
          if (rsp.code === 20000) {
            this.colseVersionId = 0;
            this.closeDialog = false;
            this.getActivateVersionList();
          } else {
            this.$message.error(rsp.message);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    /**
     * 关闭版本是否置灰
     */
    statusDisabled(status) {
      console.log("status", status);
      if (status === 2 || status == 6) {
        return false;
      }
      return true;
    },
    /**
     * 表格上的序号规则
     */
    rowClassName({ row, rowIndex }) {
      row.number = rowIndex + 1;
    },
    getActivateVersionList() {
      let url = "/saas/system/tenement/version/activate/list";
      request({
        url: url,
        method: "get",
        params: {
          productId: this.systemMessage.id,
          tenementId: this.tenementInfo.id,
          pageSize: this.listQuery.pageSize,
          pageNumb: this.listQuery.pageNumb,
        },
      })
        .then((rsp) => {
          console.log("获得订阅中的版本历史", rsp.data);
          this.listQuery.total = rsp.data.total;
          this.subscribeVersionTable = rsp.data.list;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getColor(status) {
      if (status === 0) {
        return "initColor";
      }
      if (status === 1 || status === 4) {
        return "updateColor";
      }
      if (status === 2) {
        return "normalColor";
      }
      if (status === 3 || status === 4) {
        return "unknownColor";
      }
      if (status == 5) {
        return "deadColor";
      }
    },
  },
  mounted() {
    this.refresh();
    this.checkOpenVersionDisabled();
  },
};
</script>
<style lang="scss" scoped>
.subscribe-version {
  .anchor.initColor {
    &:hover {
      color: #3c6ef0;
    }
  }
  ::v-deep .my-step-bar {
    width: 80%;
    margin: 25px auto 40px;
  }
  .open-version--disabled {
    pointer-events: unset;
    cursor: not-allowed;
    background-color: #9eb7f8;
    border-color: #9eb7f8;
  }
}
</style>