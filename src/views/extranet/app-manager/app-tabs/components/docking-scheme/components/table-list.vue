<template>
  <div class="table-list">
    <el-row type="flex" justify="end">
      <el-button
        type="primary"
        icon="el-icon-plus"
        style="margin-bottom: 8px"
        @click="handleClickSubscribeButton"
        >{{ $t("app.appOfOpenBiz.5ix7qv4tih01") }}
      </el-button>
    </el-row>

    <el-table
      v-loading="tableLoading"
      class="table-list__table"
      :data="tableData"
    >
      <el-table-column
        :label="$t('app.appOfOpenBiz.5ix7qv4tih00')"
        type="index"
        min-width="60"
      />
      <el-table-column
        v-for="{ prop, label, showOverflowTooltip, minWidth } in tableList"
        :key="prop"
        :prop="prop"
        :label="label"
        :minWidth="minWidth"
        :showOverflowTooltip="showOverflowTooltip"
      >
        <template
          slot-scope="{
            row,
            row: { availableQuantity, usedQuantity, status, onlineStatus },
            column: { property },
          }"
        >
          <span
            v-if="property === 'usedQuantity'"
            :class="{
              'used-quantity-class': usedQuantity / availableQuantity > 0.8,
            }"
            >{{
              usedQuantity === null
                ? "-"
                : usedQuantity + $t("app.appOfOpenBiz.5jv5xbvwa3s0")
            }}</span
          >
          <span v-else-if="property === 'availableQuantity'">{{
            availableQuantity === -1
              ? $t("app.appOfOpenBiz.5jv5xbvx2gc0")
              : availableQuantity + $t("app.appOfOpenBiz.5jv5xbvwa3s0")
          }}</span>
          <span
            v-else-if="property === 'status'"
            :class="status | formatStatusClassName"
            >{{ status | formatStatusText($i18n) }}</span
          >
          <template v-else-if="property === 'onlineStatus'">
            <span :class="onlineStatus | formatOnlineStatusClassName">{{
              onlineStatus | formatOnlineStatusText($i18n)
            }}</span>
            <el-tooltip
              v-if="judgeOnlineStatusTooltipVisible(onlineStatus)"
              effect="dark"
              :content="$t('app.appOfOpenBiz.5ix7qv4tjds1')"
              placement="top"
            >
              <i class="el-icon-info deadColor" style="margin-left: 4px" />
            </el-tooltip>
          </template>
          <span v-else-if="property === 'orderTime'">{{
            formatTime(row.orderTime)
          }}</span>
          <span v-else>{{ row[property] }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('app.appOfOpenBiz.5ix7qv4tjds0')" width="220">
        <template
          slot-scope="{
            row,
            row: { status, onlineStatus, isEvaluate },
            $index,
          }"
        >
          <el-button
            type="text"
            v-if="status === 1"
            @click="handleConfiguration(row)"
            >{{ $t("app.appOfOpenBiz.5ix7qv4tjkg0") }}</el-button
          >
          <el-button
            type="text"
            @click="handleClickDockingSolutionButton(row)"
            >{{ $t("app.appOfOpenBiz.5ix7qv4tjo40") }}</el-button
          >
          <el-popover
            v-model="row.popoverVisible"
            trigger="manual"
            placement="top-end"
            width="248"
            popper-class="table__online-status-popover"
            :ref="`popover-${$index}`"
          >
            <template v-if="row.onlineSign !== 1">
              <p>{{ $t("app.appOfOpenBiz.5ix7qv4tjr40") }}</p>
              <div style="text-align: right; margin: 10px 0 0">
                <el-button
                  size="mini"
                  type="text"
                  @click="row.popoverVisible = false"
                  >{{ $t("app.appOfOpenBiz.5ix7qv4tjuo0") }}</el-button
                >
                <el-button
                  :loading="onlineLoading"
                  :clstag="clstag('', 'duijiefangan_1649646683362|1')"
                  type="primary"
                  size="mini"
                  @click="handleClickConfirmOnlineButton(row)"
                  >{{ $t("app.appOfOpenBiz.5ix7qv4tjxs0") }}</el-button
                >
              </div>
            </template>
            <template v-else>
              <p>
                <i
                  style="color: #ea7308; font-size: 16px"
                  class="el-icon-warning"
                ></i>
                {{ $t("app.appOfOpenBiz.5jv5xbvx2p00") }}
              </p>
              <div style="text-align: right; margin: 10px 0 0">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleClickNotice(row)"
                  >{{ $t("app.appOfOpenBiz.5jv5xbvx2tw0") }}</el-button
                >
              </div>
            </template>

            <el-button
              v-if="judgeOnlineButtonVisible(status) && row.onlineSign !== 1"
              slot="reference"
              type="text"
              style="margin-left: 8px"
              :disabled="judgeOnlineButtonDisabled(onlineStatus)"
              @click="handleClickOnlineButton(row, `popover-${$index}`)"
              >{{ $t("app.appOfOpenBiz.5ix7qv4tjxs0") }}</el-button
            >
            <el-button
              v-if="judgeOnlineButtonVisible(status) && row.onlineSign === 1"
              slot="reference"
              type="text"
              style="margin-left: 8px"
              :disabled="judgeOnlineButtonDisabled(onlineStatus)"
              @click="handleClickConfirmOnlineButton(row)"
              >{{ $t("app.appOfOpenBiz.5jv5xbvx2y40") }}</el-button
            >
          </el-popover>
          <el-badge
            v-if="judgeEvaluateButtonVisible(onlineStatus, isEvaluate)"
            class="table__badge"
            :is-dot="true"
          >
            <el-button
              type="text"
              style="margin-left: 8px"
              :clstag="clstag('', 'duijiefangan_1649646683362|2')"
              @click="handleClickEvaluateButton(row)"
              >{{ $t("app.appOfOpenBiz.5ix7qv4tk0s0") }}</el-button
            >
          </el-badge>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      class="evaluate-dialog"
      width="640px"
      :visible.sync="evaluateDialogVisible"
      :close-on-click-modal="false"
      @close="handleCloseEvaluateDialog"
    >
      <template slot="title">
        <span
          ref="evaluateDialogClose"
          style="visibility: hidden"
          :clstag="clstag('', 'duijiefangan_1649646683362|3')"
        ></span>
      </template>
      <section class="evaluate-dialog__subtitle">
        <i v-if="justFinishedOnlineMessageVisible" class="el-icon-success" />
        <p class="subtitle__tip">
          {{
            justFinishedOnlineMessageVisible
              | formatEvaluateDialogTipText($i18n)
          }}
        </p>
      </section>

      <p class="evaluate-dialog__tip">
        {{ $t("app.appOfOpenBiz.5ix7qv4tk4g0") }}
      </p>
      <el-form
        class="evaluate-dialog__form"
        ref="evaluateForm"
        :model="evaluateFormData"
        label-width="400px"
        label-position="left"
      >
        <template v-for="{ prop, label } in computeEvaluateFormList">
          <el-form-item :key="prop" :prop="prop" :label="label">
            <el-rate
              v-model="evaluateFormData[prop]"
              :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
            >
            </el-rate>
          </el-form-item>
          <el-input
            v-if="
              judgeEvaluateDialogFormItemContentVisible(evaluateFormData[prop])
            "
            v-model="evaluateFormData[`${prop}Content`]"
            :key="`${prop}Content`"
            :rows="2"
            :maxlength="500"
            type="textarea"
            resize="none"
            :placeholder="$t('app.appOfOpenBiz.5ix7qv4tk7k0')"
            style="margin-bottom: 8px"
          ></el-input>
        </template>
      </el-form>

      <div slot="footer" style="text-align: center">
        <el-button
          :loading="evaluateSubmitLoading"
          :disabled="computeEvaluateSubmitButtonDisabled"
          type="primary"
          @click="handleClickEvaluateSubmitButton"
          >{{ $t("app.appOfOpenBiz.5ix7qv4tkac0") }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import buriedPoint from "@/mixins/buriedPoint.js";
import lcp from "@/api/extranet/lcp/index.js";
import parseTime from "@/utils/parseTime.js";

export default {
  name: "TableList",
  mixins: [buriedPoint],
  props: {
    appKey: {
      type: String,
      required: true,
    },
    currentRow: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      businessTypeList: [],
      // 对接方案表格数据
      tableLoading: true,
      tableData: [],
      tableList: [
        {
          prop: "unitName",
          label: this.$t("app.appOfOpenBiz.5ix7qv4tkek0"),
          minWidth: "100",
          showOverflowTooltip: true,
        },
        {
          prop: "unitCode",
          label: this.$t("app.appOfOpenBiz.5ix7qv4tkho0"),
          minWidth: "100",
          showOverflowTooltip: true,
        },
        {
          prop: "status",
          label: this.$t("app.appOfOpenBiz.5ix7qv4tkqc0"),
          minWidth: "100",
        },
        {
          prop: "onlineStatus",
          label: this.$t("app.appOfOpenBiz.5ix7qv4tktk0"),
          minWidth: "100",
        },
        {
          prop: "usedQuantity",
          label: this.$t("app.appOfOpenBiz.5jv5xbvx32s0"),
          minWidth: "100",
        },
        {
          prop: "availableQuantity",
          label: this.$t("app.appOfOpenBiz.5jv5xbvx3740"),
          minWidth: "100",
        },
        {
          prop: "orderTime",
          label: this.$t("app.appOfOpenBiz.5ix7qv4tkks0"),
          minWidth: "180",
        },
      ],
      onlineDebounceTimer: null,
      onlineLoading: false,
      // 评价对话框
      justFinishedOnlineMessageVisible: false,
      evaluateDialogVisible: false,
      evaluateFormData: {
        dockingExperience: 0,
        dockingExperienceContent: "",
        usingPlatform: 0,
        usingPlatformContent: "",
        operationsQuality: 0,
        operationsQualityContent: "",
      },
      evaluateFormList: [
        {
          prop: "dockingExperience",
          label: "",
        },
        {
          prop: "usingPlatform",
          label: "",
        },
        {
          prop: "operationsQuality",
          label: "",
        },
      ],
      dimensionHashMap: {
        dockingExperience: 1,
        usingPlatform: 2,
        operationsQuality: 3,
      },
      evaluateDebounceTimer: null,
      evaluateSubmitLoading: false,
    };
  },
  filters: {
    formatStatusClassName(status) {
      const hashMap = ["updateColor", "normalColor", "unknownColor"];
      return hashMap[status] || "";
    },
    formatStatusText(status, i18n) {
      const hashMap = [
        i18n.t("app.appOfOpenBiz.5ix7qv4tkwk0"),
        i18n.t("app.appOfOpenBiz.5ix7qv4tkz40"),
        i18n.t("app.appOfOpenBiz.5ix7qv4tl300"),
      ];
      return hashMap[status] || "";
    },
    formatOnlineStatusText(onlineStatus, i18n) {
      const hashMap = {
        1: i18n.t("app.appOfOpenBiz.5ix7qv4tl7k0"),
        2: i18n.t("app.appOfOpenBiz.5ix7qv4tlag0"),
        3: i18n.t("app.appOfOpenBiz.5ix7qv4tld40"),
      };
      return hashMap[onlineStatus] || "";
    },
    formatOnlineStatusClassName(onlineStatus) {
      const hashMap = { 1: "deadColor", 2: "normalColor", 3: "unknownColor" };
      return hashMap[onlineStatus] || "";
    },
    formatEvaluateDialogTipText(justFinishedOnlineMessageVisible, i18n) {
      return justFinishedOnlineMessageVisible
        ? i18n.t("app.appOfOpenBiz.5ix7qv4tlg00")
        : i18n.t("app.appOfOpenBiz.5ix7qv4tlig0");
    },
  },
  computed: {
    // 计算评价表单列表，从字典表更新表单项标签
    computeEvaluateFormList() {
      const { dimensionHashMap, evaluateFormList } = this;
      const { dictionary } = this.$store.state.tools;
      return evaluateFormList.map(({ prop, label }) => {
        try {
          label =
            dictionary.bizUnitSatisfactionType[dimensionHashMap[prop]].value;
        } catch (error) {
          console.log(`computeEvaluateFormList, ${error}`);
        }
        return { prop, label };
      });
    },
    // 计算评价提交按钮是否禁用
    computeEvaluateSubmitButtonDisabled() {
      const {
        evaluateFormData: {
          dockingExperience,
          usingPlatform,
          operationsQuality,
        },
      } = this;
      return !(dockingExperience && usingPlatform && operationsQuality);
    },
  },
  methods: {
    // 解析时间格式
    formatTime(time) {
      return parseTime.timeInTable(time) || "-";
    },
    // 查询对接方案分类列表
    async getBusinessTypes() {
      return await lcp.businesstype.getBusinessTypes();
    },
    // 应用管理查询对接方案列表数据
    async findRecord() {
      const { appKey } = this;
      const params = { appKey };
      return await lcp.bizunit.findRecord(params);
    },
    // 应用管理对接方案上线
    async online(bizOrderId) {
      const params = { bizOrderId };
      return await lcp.bizunit.online(params);
    },
    // 提交上线评价
    async submitUserSatisfactionRecord() {
      const { dimensionHashMap } = this;
      const { id } = this.currentRow;
      const objId = id;
      const type = 1;
      const dimensionList = Object.keys(dimensionHashMap) || [];
      const userSatisfactionList = dimensionList.map((dimension) => {
        const score = this.evaluateFormData[dimension];
        const content =
          score < 3.5 ? this.evaluateFormData[`${dimension}Content`] : "";
        dimension = dimensionHashMap[dimension] || dimension;
        return { dimension, score, content };
      });
      const data = { objId, type, userSatisfactionList };
      return await lcp.userSatisfaction.submitUserSatisfactionRecord(data);
    },

    // 获取对接方案分类列表操作
    async handleGetBusinessTypeList() {
      const { data } = await this.getBusinessTypes().catch((error) => {
        throw new Error(`handleGetBusinessTypeList getBusinessTypes, ${error}`);
      });
      this.businessTypeList = data || [];
    },

    // 查询对接方案列表并展示上线提示气泡
    async handleSearchPopoverTableData() {
      await this.handleSearchDockingSolutionTableData().catch((error) => {
        throw new Error(
          `handleSearchPopoverTableData handleSearchDockingSolutionTableData, ${error}`
        );
      });
      this.$nextTick(() => {
        this.tableData.forEach((item) => {
          if (item.onlineSign === 1) {
            item.popoverVisible = true;
          }
        });
      });
    },

    // 查询对接方案表格数据操作，为行数据添加弹出框绑定值
    async handleSearchDockingSolutionTableData() {
      this.tableLoading = true;
      const { data } = await this.findRecord().catch((error) => {
        throw new Error(
          `handleSearchDockingSolutionTableData findRecord, ${error}`
        );
      });
      this.tableData = data.map((item) => ({ ...item, popoverVisible: false }));
      this.tableLoading = false;
    },
    // 点击订阅新的对接方案按钮操作
    handleClickSubscribeButton() {
      this.$router.push({
        name: "AppManagerAppTabsSubscribeDockingScheme",
        params: { id: this.$route.params.id },
      });
    },
    // 配置
    handleConfiguration(row) {
      this.$emit("update:currentRow", row);
      this.$emit("update:showComponent", "Configuration");
    },
    //新标签页打开前台当前方案管理的文档页-接入指南-业务说明
    handleClickDockingSolutionButton(row) {
      const { unitId } = row;
      const url = `${window.origin}/#/open-business-document/access-guide/${unitId}`;
      window.open(url, "_blank");
    },
    // 判断上线状态文字提示可见性
    judgeOnlineStatusTooltipVisible(onlineStatus) {
      return onlineStatus === 1;
    },
    // 判断上线按钮可见性
    judgeOnlineButtonVisible(status) {
      return status === 1;
    },
    // 判断上线按钮是否禁用
    judgeOnlineButtonDisabled(onlineStatus) {
      return onlineStatus === 2;
    },
    // 判断待评价按钮可见性
    judgeEvaluateButtonVisible(onlineStatus, isEvaluate) {
      return onlineStatus === 2 && isEvaluate === 0;
    },
    // 点击上线按钮，打开当前行二次确认弹出框
    handleClickOnlineButton(row, popoverRefName) {
      row.popoverVisible = true;
      // 解决el-table-column fixed popover 重复显示的问题
      this.$nextTick(() => {
        this.$refs[popoverRefName].$refs.popper.previousSibling.remove();
      });
    },
    // 点击二次确认上线按钮操作
    handleClickConfirmOnlineButton(row) {
      clearTimeout(this.onlineDebounceTimer);
      this.onlineDebounceTimer = setTimeout(async () => {
        const { id } = row;
        this.onlineLoading = true;
        await this.online(id).catch((error) => {
          this.onlineLoading = false;
          throw new Error(`handleClickConfirmOnlineButton online, ${error}`);
        });
        row.popoverVisible = false;
        this.onlineLoading = false;
        this.$emit("update:currentRow", row);
        this.justFinishedOnlineMessageVisible = true;
        this.evaluateDialogVisible = true;
        await this.handleSearchDockingSolutionTableData().catch((error) => {
          throw new Error(`handleClickConfirmOnlineButton, ${error}`);
        });
      }, 300);
    },
    // 点击待评价按钮操作
    handleClickEvaluateButton(row) {
      this.$emit("update:currentRow", row);
      this.justFinishedOnlineMessageVisible = false;
      this.evaluateDialogVisible = true;
    },
    // 判断评价对话框表单项意见输入框可见性
    judgeEvaluateDialogFormItemContentVisible(rate) {
      return rate > 0 && rate < 3.5;
    },
    // 点击评价提交按钮操作
    handleClickEvaluateSubmitButton() {
      clearTimeout(this.evaluateDebounceTimer);
      this.evaluateDebounceTimer = setTimeout(async () => {
        this.evaluateSubmitLoading = true;
        await this.submitUserSatisfactionRecord().catch((error) => {
          this.evaluateSubmitLoading = false;
          throw new Error(
            `handleClickEvaluateSubmitButton submitUserSatisfactionRecord, ${error}`
          );
        });
        this.evaluateSubmitLoading = false;
        this.evaluateDialogVisible = false;
        this.$message.success(this.$t("app.appOfOpenBiz.5ix7qv4tlks0"));
        await this.handleSearchDockingSolutionTableData().catch((error) => {
          throw new Error(`handleClickEvaluateSubmitButton, ${error}`);
        });
      }, 300);
    },
    handleCloseEvaluateDialog() {
      const { justFinishedOnlineMessageVisible } = this;
      justFinishedOnlineMessageVisible &&
        this.$refs.evaluateDialogClose.click();
      this.$refs.evaluateForm.resetFields();
      this.evaluateFormData.dockingExperienceContent = "";
      this.evaluateFormData.usingPlatformContent = "";
      this.evaluateFormData.operationsQualityContent = "";
    },
    async handleClickNotice(row) {
      row.popoverVisible = false;
      const { id } = row;
      const bizOrderId = id;
      const params = { bizOrderId };
      await lcp.bizunit.updateOnlineSign(params).catch((error) => {
        throw new Error("handleClickNotice" + error);
      });
    },
  },
  async created() {
    await this.handleGetBusinessTypeList().catch((error) => {
      throw new Error(`created, ${error}`);
    });
    await this.handleSearchPopoverTableData().catch((error) => {
      throw new Error(`created, ${error}`);
    });
  },
};
</script>

<style lang="scss" scoped>
.table-list {
  .table-list__table {
    .used-quantity-class {
      color: #e53737;
    }

    .table__badge {
      vertical-align: baseline;

      ::v-deep .el-badge__content {
        top: 4px;
      }
    }
  }

  .evaluate-dialog {
    ::v-deep .el-dialog__body {
      max-height: 65vh;
      overflow: auto;

      .evaluate-dialog__subtitle {
        text-align: center;

        .el-icon-success {
          font-size: 32px;
          color: #26a872;
        }

        .subtitle__tip {
          font-size: 18px;
          color: #333;
        }
      }

      .evaluate-dialog__tip {
        margin: 32px 0;
        text-align: center;
        color: #333;
      }

      .evaluate-dialog__form {
        margin: 32px auto;
        width: 520px;

        .el-form-item {
          margin-bottom: 8px;

          .el-rate {
            line-height: 2;
          }
        }
      }
    }
  }
}
</style>
