<template>
  <div class="interface-list">
    <!-- 顶部tag信息 -->
    <TagTip :closable="false">
      {{ $t("interfaceList.index.5izjfq2p8y80") }}
      <a
        class="anchor initColor"
        :href="toBlankAccessGuideDoc"
        target="_blank"
        >{{ $t("interfaceList.index.5izjfq2p9qw0") }}</a
      >
      {{ $t("interfaceList.index.5izjfq2p9qw1") }}
    </TagTip>
    <!-- 接口列表表格 -->
    <div class="interface-list__table">
      <el-table
        :empty-text="$t('interfaceList.index.5izjfq2pa0s1')"
        :data="tableData"
        :show-overflow-tooltip="true"
        align="left"
      >
        <el-table-column
          type="index"
          :label="$t('interfaceList.index.5izjfq2p9wc0')"
        ></el-table-column>
        <el-table-column
          :label="$t('interfaceList.index.5izjfq2pa0s0')"
          prop="apiName"
        >
          <template slot-scope="scope"
            ><a :href="toApiDoc(scope.row)" target="_blank">{{
              scope.row.apiName
            }}</a></template
          >
        </el-table-column>
        <el-table-column label="URI" prop="apiUrl"></el-table-column>
        <el-table-column
          :label="$t('interfaceList.index.5izjfq2pa400')"
          prop="apiRemark"
        ></el-table-column>
        <el-table-column
          :label="$t('interfaceList.index.5izjfq2pa840')"
          prop="subscribeStatus"
        >
          <template slot-scope="scope">
            <span :class="formatStatusClass(scope.row.subscribeStatus)">
              {{ formatStatusType(scope.row.subscribeStatus) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('interfaceList.index.5izjfq2pab40')">
          <template slot-scope="scope">
            <!-- 未订阅状态只展示订阅按钮 -->
            <template v-if="scope.row.subscribeStatus === 0">
              <el-button
                :loading="subscribeButtonLoading"
                type="text"
                @click="onClickSubscribeButton(scope.row)"
                >{{ $t("interfaceList.index.5izjfq2paek0") }}</el-button
              >
            </template>
            <!--审核中状态，无操作展示“-”  -->
            <template v-else-if="scope.row.subscribeStatus === 1">
              <span>-</span>
            </template>
            <!-- 已订阅状态展示配置及取消订阅按钮 -->
            <template v-else-if="scope.row.subscribeStatus === 2">
              <el-button type="text" @click="handleConfiguration(scope.row)">{{
                $t("interfaceList.index.5izjfq2pahw0")
              }}</el-button>
              <el-button
                :loading="unsubscribeButtonLoading"
                type="text"
                @click="onClickUnsubscribeButton(scope.row)"
                >{{ $t("interfaceList.index.5izjfq2pakw0") }}</el-button
              >
            </template>
            <!-- 已驳回状态展示订阅按钮 -->
            <template v-else-if="scope.row.subscribeStatus === 3">
              <el-button
                :loading="subscribeButtonLoading"
                type="text"
                @click="onClickSubscribeButton(scope.row)"
                >{{ $t("interfaceList.index.5izjfq2paek0") }}</el-button
              >
            </template>
          </template>
        </el-table-column>
      </el-table>
      <!-- 配置对话框 -->
      <el-dialog
        :title="$t('interfaceList.index.5izjfq2pahw0')"
        :visible.sync="dialogVisible"
        width="420px"
        :before-close="beforeClose"
        :close-on-click-modal="false"
      >
        <el-form
          v-loading="formConfigurationLoading"
          :model="formConfiguration"
          ref="formConfiguration"
          :rules="formConfigurationRules"
          label-width="140px"
        >
          <el-form-item prop="callBackUrl">
            <template #label>
              <span>{{ formatFormConfigurationCallBackUrlLabel(env) }}</span>
            </template>
            <el-input
              v-model.trim="formConfiguration.callBackUrl"
              :placeholder="$t('interfaceList.index.5izjfq2park0')"
            />
          </el-form-item>
          <el-form-item
            v-if="(env === 'uat' || env === 'prod') && formConfiguration.hasUat"
            :label="$t('interfaceList.index.5izjfq2pao41')"
            prop="shadowboxCallbackUrl"
          >
            <el-input
              v-model.trim="formConfiguration.shadowboxCallbackUrl"
              :placeholder="$t('interfaceList.index.5izjfq2park0')"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCancle">{{
            $t("interfaceList.index.5izjfq2pauo0")
          }}</el-button>
          <el-button type="primary" @click="handleConfirm">{{
            $t("interfaceList.index.5izjfq2paxw0")
          }}</el-button>
        </div>
      </el-dialog>
      <!-- 分页 -->
      <Pagination
        v-if="total > 0"
        :currentPage.sync="pageNumb"
        :pageSize.sync="pageSize"
        :total.sync="total"
        :reloadTableData="queryApiList"
      />
    </div>
  </div>
</template>

<script>
import TagTip from "@/components/common/TagTip.vue";
import Pagination from "@/components/Pagination.vue";
import appManager from "@/api/extranet/appManager/index.js";
import lcp from "@/api/extranet/lcp/index.js";
import { debounce } from "lodash";

export default {
  name: "InterfaceList",
  components: {
    TagTip,
    Pagination,
  },
  props: {
    currentRow: {
      type: Object,
      default() {
        return {};
      },
    },
    appKey: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      env: window.env.baseEnv,
      tableData: [],
      dialogVisible: false,
      formConfiguration: {},
      formConfigurationRules: {
        callBackUrl: [
          {
            required: true,
            message: this.$t("interfaceList.index.5izjfq2pb100"),
          },
        ],
      },
      row: {},
      pageNumb: 1,
      pageSize: 10,
      total: 0,
      subscribeButtonLoading: false,
      unsubscribeButtonLoading: false,
      formConfigurationLoading: false,
    };
  },
  computed: {
    toBlankAccessGuideDoc() {
      const url = `${window.location.origin}/#/open-business-document/access-guide/${this.currentRow.unitId}`;
      return url;
    },
  },
  methods: {
    // 外网-应用-对接方案-配置-回传API-配置接口
    async select() {
      const { subCode } = this.row;
      const params = { subCode };
      return await lcp.bizapinterface.callOutConfig.select(params);
    },

    // 外网-应用-对接方案-配置-回传API-配置接口调用
    async handleSelect() {
      let {
        data: { callBackUrl, shadowboxCallbackUrl },
      } = await this.select().catch((error) => {
        console.error("handleSelect");
        throw error;
      });
      callBackUrl = callBackUrl || "";
      shadowboxCallbackUrl = shadowboxCallbackUrl || "";
      this.row = { ...this.row, callBackUrl, shadowboxCallbackUrl };
    },

    formatFormConfigurationCallBackUrlLabel(env) {
      const hashMap = new Map()
        .set("test", this.$t("interfaceList.index.5izjfq2pao40"))
        .set("uat", this.$t("interfaceList.index.5izjfq2pao42"))
        .set("prod", this.$t("interfaceList.index.5izjfq2pao42"));
      return hashMap.get(env) || "-";
    },
    //转换状态值
    formatStatusType(subscribeStatus) {
      const receiveStatusMap = [
        this.$t("interfaceList.index.5izjfq2pb700"),
        this.$t("interfaceList.index.5izjfq2pba80"),
        this.$t("interfaceList.index.5izjfq2pbd40"),
        this.$t("interfaceList.index.5izjfq2pbgs0"),
      ];
      return receiveStatusMap[subscribeStatus];
    },

    // 转换状态class值
    formatStatusClass(subscribeStatus) {
      const statusClassTable = [
        "initColor",
        "updateColor",
        "normalColor",
        "deadColor",
      ];
      return statusClassTable[subscribeStatus];
    },
    //跳转的API文档链接
    toApiDoc(row) {
      const url = `${window.location.origin}/#/open-business-document/api-doc/${row.unitId}/${row.id}`;
      return url;
    },
    //查询接口列表
    async queryApiList() {
      const { unitCode } = this.currentRow;
      const callDirection = 2;
      const appCode = this.appKey;
      const pageNumb = this.pageNumb;
      const pageSize = this.pageSize;
      // 传参为formData对象
      const data = new URLSearchParams();
      data.append("unitCode", unitCode);
      data.append("callDirection", callDirection);
      data.append("appCode", appCode);
      data.append("pageNumb", pageNumb);
      data.append("pageSize", pageSize);
      const response = await appManager.configuration.queryApiList(data);
      this.tableData = response.data.list;
      this.total = response.data.total;
    },
    // 订阅接口
    async submitAPISubscribe(row) {
      const appCode = this.appKey;
      const { unitCode } = this.currentRow;
      const { domainOfGateway, id } = row;
      const params = { appCode, unitCode, id, domainOfGateway };
      const response = await appManager.configuration.submitAPISubscribe(
        params
      );
      return response;
    },
    // 取消订阅接口
    async cancelSub(row) {
      const { subCode } = row;
      const params = { subCode };
      const response = await appManager.configuration.cancelSub(params);
      return response;
    },
    //订阅成功的配置URL
    async saveCallBackUrl() {
      const { subCode } = this.row;
      const { callBackUrl, shadowboxCallbackUrl } = this.formConfiguration;
      const data = { subCode, callBackUrl, shadowboxCallbackUrl };
      return await appManager.configuration.saveCallBackUrl(data);
    },
    //订阅
    async handleSubscribe(row) {
      await this.submitAPISubscribe(row).catch((error) => {
        console.error("handleSubscribe");
        throw error;
      });
      this.$message.success(this.$t("interfaceList.index.5izjfq2pblc0"));
      this.queryApiList();
    },
    //取消订阅
    async handleUnSubscribe(row) {
      await this.cancelSub(row).catch((error) => {
        console.error("handleUnSubscribe");
        throw error;
      });
      this.$message.success(this.$t("interfaceList.index.5izjfq2pboc0"));
      this.queryApiList();
    },
    //配置
    async handleConfiguration(row) {
      this.dialogVisible = true;
      this.row = JSON.parse(JSON.stringify(row));
      await this.handleSelect().catch((error) => {
        console.error("handleConfiguration");
        throw error;
      });
      this.formConfiguration = this.row;
      await this.$nextTick();
      this.$refs["formConfiguration"].clearValidate();
    },
    //保存配置
    async handleConfirm() {
      this.$refs["formConfiguration"].validate(async (valid) => {
        if (valid) {
          await this.saveCallBackUrl().catch((error) => {
            throw new Error("saveCallBackUrl Error");
          });
          this.resetForm();
          this.dialogVisible = false;
          this.$message.success(this.$t("interfaceList.index.5izjfq2pbrk0"));
          this.queryApiList();
        } else {
          return false;
        }
      });
    },
    // 取消配置
    handleCancle() {
      this.dialogVisible = false;
      this.resetForm();
    },
    //重置表单
    resetForm() {
      this.$nextTick(() => {
        this.$refs["formConfiguration"].resetFields();
      });
    },
    beforeClose(done) {
      this.resetForm();
      done();
    },
    onClickSubscribeButton: debounce(async function (row) {
      this.subscribeButtonLoading = true;
      await this.handleSubscribe(row).catch((error) => {
        this.subscribeButtonLoading = false;
        console.error("onClickSubscribeButton");
        throw error;
      });
      this.subscribeButtonLoading = false;
    }, 300),
    onClickUnsubscribeButton: debounce(async function (row) {
      this.unsubscribeButtonLoading = true;
      await this.handleUnSubscribe(row).catch((error) => {
        this.unsubscribeButtonLoading = false;
        console.error("onClickUnsubscribeButton");
        throw error;
      });
      this.unsubscribeButtonLoading = false;
    }, 300),
  },
  created() {
    this.queryApiList();
  },
};
</script>

<style lang="scss" scoped></style>
