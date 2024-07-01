<template>
  <div class="config-extension-point">
    <el-table
      v-loading="tableDataLoading"
      :data="tableData"
      style="width: 100%"
      align="left"
    >
      <el-table-column type="expand">
        <template
          slot-scope="{
            row: {
              id,
              spiIsOnline,
              spiUatIsOnline,
              spiInstanceIsEnable,
              uatSpiInstanceIsEnable,
              spiInstanceIsOnLine,
              uatSpiInstanceIsOnLine,
            },
          }"
        >
          <!-- 当前环境 -->
          <p
            :class="[
              'expand-row__title',
              judgeSpiIsOffline(spiIsOnline) ? 'is-offline' : '',
            ]"
          >
            {{ computeCurrentEnvTitleText }}
            <span v-show="judgeSpiIsOffline(spiIsOnline)"
              >（该扩展点已下线）</span
            >
          </p>
          <el-form
            :class="[
              'expand-row__form',
              judgeSpiIsOffline(spiIsOnline) ? 'is-offline' : '',
            ]"
            label-position="left"
            :model="{}"
            :inline="true"
          >
            <el-form-item label="启用状态：" style="width: 280px">
              <span>
                {{
                  formatSpiInstanceIsEnableText(
                    spiInstanceIsEnable,
                    "spiInstanceIsEnable"
                  )
                }}
              </span>
              <template
                v-if="
                  judgeSpiInstanceIsEnableButtonVisible(spiInstanceIsEnable)
                "
              >
                <el-popconfirm
                  v-if="spiInstanceIsEnable"
                  width="200"
                  title="停用后将影响功能使用，是否仍要继续？"
                  confirm-button-text="停用"
                  @onConfirm="handleEnableOrDisable(id, spiInstanceIsEnable)"
                >
                  <el-button
                    slot="reference"
                    type="text"
                    style="margin-left: 16px"
                    :disabled="judgeSpiIsOffline(spiIsOnline)"
                  >
                    停用
                  </el-button>
                </el-popconfirm>
                <el-button
                  v-else
                  type="text"
                  style="margin-left: 16px"
                  :disabled="judgeSpiIsOffline(spiIsOnline)"
                  @click="handleEnableOrDisable(id, spiInstanceIsEnable)"
                >
                  启用
                </el-button>
              </template>
            </el-form-item>
            <el-form-item label="部署状态：">
              <span v-if="spiInstanceIsOnLine">已部署</span>
              <span v-else
                >未部署
                <el-button
                  class="el-icon-info-empty"
                  type="text"
                  @click="dialogVisible = true"
                />
              </span>
            </el-form-item>
          </el-form>
          <!-- 影盒环境 -->
          <template v-if="computeSandboxEnvVisible">
            <p
              :class="[
                'expand-row__title',
                judgeSpiIsOffline(spiUatIsOnline) ? 'is-offline' : '',
              ]"
            >
              {{ computeSandboxEnvTitleText }}
              <span v-show="judgeSpiIsOffline(spiUatIsOnline)"
                >（该扩展点已下线）</span
              >
            </p>
            <el-form
              :class="[
                'expand-row__form',
                judgeSpiIsOffline(spiUatIsOnline) ? 'is-offline' : '',
              ]"
              label-position="left"
              :model="{}"
              :inline="true"
            >
              <el-form-item label="启用状态：" style="width: 280px">
                <span>
                  {{
                    formatSpiInstanceIsEnableText(
                      uatSpiInstanceIsEnable,
                      "uatSpiInstanceIsEnable"
                    )
                  }}
                </span>
                <template
                  v-if="
                    judgeSpiInstanceIsEnableButtonVisible(
                      uatSpiInstanceIsEnable
                    )
                  "
                >
                  <el-popconfirm
                    v-if="uatSpiInstanceIsEnable"
                    width="200"
                    title="停用后将影响功能使用，是否仍要继续？"
                    confirm-button-text="停用"
                    @onConfirm="
                      handleEnableOrDisable(id, uatSpiInstanceIsEnable, 'uat')
                    "
                  >
                    <el-button
                      slot="reference"
                      type="text"
                      style="margin-left: 16px"
                      :disabled="judgeSpiIsOffline(spiUatIsOnline)"
                    >
                      停用
                    </el-button>
                  </el-popconfirm>
                  <el-button
                    v-else
                    type="text"
                    style="margin-left: 16px"
                    :disabled="judgeSpiIsOffline(spiUatIsOnline)"
                    @click="
                      handleEnableOrDisable(id, uatSpiInstanceIsEnable, 'uat')
                    "
                  >
                    启用
                  </el-button>
                </template>
              </el-form-item>
              <el-form-item label="部署状态：">
                <span v-if="uatSpiInstanceIsOnLine">已部署</span>
                <span v-else
                  >未部署
                  <el-button
                    class="el-icon-info-empty"
                    type="text"
                    @click="dialogVisible = true"
                  />
                </span>
              </el-form-item>
            </el-form>
          </template>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" width="80"> </el-table-column>
      <el-table-column
        :show-tooltip-when-overflow="true"
        prop="cnName"
        label="中文名称"
      >
      </el-table-column>
      <el-table-column
        :show-tooltip-when-overflow="true"
        prop="url"
        label="URL"
      >
        <template slot-scope="{ row: { url } }">
          <div class="table-cell__url">
            <p class="url__text">
              {{ url }}
            </p>
            <a
              v-clipboard:copy="url"
              v-clipboard:success="onCopySuccess"
              v-clipboard:error="onCopyError"
            >
              <i class="el-icon-document-copy" />
            </a>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :show-tooltip-when-overflow="true"
        prop="groupName"
        label="所属分类"
      >
      </el-table-column>
      <el-table-column prop="isHide" width="160" align="center">
        <template slot-scope="{ row }">
          <el-tag
            v-if="judgeIsHideTagVisible(row)"
            type="info"
            effect="lightBorder"
            style="color: #999"
            >该扩展点即将下线</el-tag
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <Pagination
      v-if="total > 0"
      :currentPage.sync="pageNum"
      :pageSize.sync="pageSize"
      :total.sync="total"
      :reloadTableData="reloadTableData"
    />

    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      class="extension-dialog"
      width="600px"
    >
      <!-- 对话框内容区 -->
      <div class="dialog-wrapper">
        <div>
          <i class="el-icon-warning"></i>
        </div>
        <h1 class="dialog-subtitle">未检测到扩展点的实现</h1>
        <p class="dialog-content">
          请按
          <a
            :href="computeExtensionPointManualHref"
            target="_blank"
            style="color: #3c6ef0"
            >扩展点使用手册</a
          >
          实现扩展点，并按手册内容部署应用，部署成功后，平台即可检测到扩展点的实现。
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination.vue";
import appManager from "@/api/intranet/appManager/index.js";

export default {
  name: "ConfigExtensionPoint",
  components: { Pagination },
  props: {
    basicInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      env: window.env.buildEnv,
      tableData: [],
      tableDataLoading: true,
      dialogVisible: false,
      // 分页器
      pageNum: 1,
      pageSize: 10,
      total: 0,
    };
  },
  computed: {
    // 计算扩展点使用手册文档跳转链接
    computeExtensionPointManualHref() {
      const { dictionary } = this.$store.state.tools;
      try {
        return dictionary.docLink["spiDevelopProjectSpecific"].value;
      } catch (error) {
        return "";
      }
    },
    // 计算当前环境展开行标题文案
    computeCurrentEnvTitleText() {
      const hashMap = {
        local: "开发环境：",
        devtest: "开发环境：",
        publictest: "测试环境：",
        uat: "生产环境：",
        prod: "生产环境：",
      };
      return hashMap[this.env] || "";
    },
    // 计预发环境展开行标题文案
    computeSandboxEnvTitleText() {
      const hashMap = {
        publictest: "开发环境：",
        uat: "预发环境：",
        prod: "预发环境：",
      };
      return hashMap[this.env] || "";
    },
    // 计算预发环境信息是否显示
    computeSandboxEnvVisible() {
      const envList = ["publictest", "uat", "prod"];
      return envList.includes(this.env);
    },
  },
  methods: {
    // 扩展点探活
    async survivalCheck() {
      const appCode = this.basicInfo.code;
      return await appManager.survivalCheck(appCode).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("survivalCheck");
      });
    },
    // 软件系统应用管理查询扩展点列表
    async queryList() {
      const appCode = this.basicInfo.code;
      const { pageSize, pageNum } = this;
      const params = { appCode, pageSize, pageNum };
      return await appManager.queryList(params).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("queryList");
      });
    },
    // 扩展点启用/停用
    async enable(id, spiInstanceIsEnable, envMark) {
      spiInstanceIsEnable = !spiInstanceIsEnable;
      const data = { id, spiInstanceIsEnable, envMark };
      envMark !== "uat" && delete data.envMark;
      return await appManager.enable(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("enable");
      });
    },

    // 判断扩展点实例是否已下线
    judgeSpiIsOffline(spiIsOnline) {
      return spiIsOnline === 0;
    },
    // 判断扩展点即将下线提示是否显示
    judgeIsHideTagVisible(row) {
      const { env } = this;
      const { isHide, spiIsOnline, spiUatIsOnline } = row;
      const envHashMap = {
        local: () => !this.judgeSpiIsOffline(spiIsOnline),
        devtest() {
          return this.local();
        },
        publictest: () =>
          !this.judgeSpiIsOffline(spiIsOnline) &&
          !this.judgeSpiIsOffline(spiUatIsOnline),
        uat: () =>
          !this.judgeSpiIsOffline(spiIsOnline) &&
          !this.judgeSpiIsOffline(spiUatIsOnline),
        prod: () =>
          !this.judgeSpiIsOffline(spiIsOnline) &&
          !this.judgeSpiIsOffline(spiUatIsOnline),
      };
      return isHide === 1 && envHashMap[env]();
    },
    // 格式化扩展点实例启用状态文案
    formatSpiInstanceIsEnableText(
      spiInstanceIsEnable,
      spiInstanceIsEnableString
    ) {
      const { dictionary } = this.$store.state.tools;
      try {
        return dictionary[spiInstanceIsEnableString][spiInstanceIsEnable].value;
      } catch (error) {
        return spiInstanceIsEnable || "";
      }
    },
    // 判断扩展点实例启用状态按钮是否显示
    judgeSpiInstanceIsEnableButtonVisible(isEnable) {
      const displayedIsEnableList = [true, false];
      return displayedIsEnableList.includes(isEnable);
    },
    // 加载扩展点实例表格数据
    async reloadTableData() {
      this.$emit("updateAppStatus");
      this.tableDataLoading = true;
      const response = await this.queryList().catch(() => {
        throw new Error("reloadTableData");
      });
      const { list, total } = response.data.data;
      this.tableData = list || [];
      this.total = total || 0;
      this.tableDataLoading = false;
    },
    // 启用/停用操作
    async handleEnableOrDisable(spiInstanceId, spiInstanceIsEnable, envMark) {
      await this.enable(spiInstanceId, spiInstanceIsEnable, envMark).catch(
        () => {
          throw new Error("handleEnableOrDisable");
        }
      );
      this.$message.success("操作成功！");
      this.reloadTableData();
    },
    // URL复制操作成功
    onCopySuccess(e) {
      this.$message.success("复制成功");
    },
    // URL复制操作失败
    onCopyError(e) {
      this.$message.error("复制失败");
    },
  },
  async created() {
    await this.survivalCheck();
    this.reloadTableData();
  },
};
</script>

<style lang="scss" scoped>
.config-extension-point {
  .el-table {
    ::v-deep .el-table__expanded-cell {
      padding-top: 12px;
      padding-bottom: 12px;
      padding-left: 58px;
      background-color: #f5f5f5;
      &:hover {
        background-color: #f5f5f5 !important;
      }
      .expand-row__title {
        font-weight: bolder;
      }
      .el-form-item {
        margin-bottom: 0;
      }
      .el-icon-info-empty {
        color: #333;
      }

      .is-offline {
        color: #999;
        .el-form-item__label {
          color: #999;
        }
        .el-icon-info-empty {
          color: #999;
        }
      }
    }
    .table-cell__url {
      display: flex;
      .url__text {
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .el-icon-document-copy {
      color: #999;
    }
  }

  ::v-deep .el-dialog__header {
    border-bottom: 1px solid transparent;
  }
  .dialog-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .el-icon-warning {
      font-size: 36px;
      color: #ea7308;
    }
    .dialog-subtitle {
      font-size: 18px;
      text-align: center;
    }
    .dialog-content {
      padding: 10px 30px 30px;
    }
  }
}
</style>