<template>
  <div class="extension-point-list">
    <div class="search-wrapper">
      <div></div>
      <div class="button-wrapper">
        <!-- <el-button type="primary" @click="configMavenDialogVisible = true"
          >配置Maven坐标</el-button
        > -->
        <!-- <el-button type="primary">下载扩展点SDK</el-button> -->
        <el-button
          type="primary"
          @click="
            $emit(
              'update:currentDisplayComponentName',
              'RegisterExtensionPoint'
            )
          "
          >注册扩展点</el-button
        >
      </div>
    </div>

    <!-- 配置扩展点Maven坐标对话框 -->
    <el-dialog
      :visible.sync="configMavenDialogVisible"
      :close-on-click-modal="false"
      title="配置扩展点Maven坐标"
      width="560px"
      class="config-maven-dialog"
      @open="openConfigMavenDialog"
      @close="closeConfigMavenDialog"
    >
      <div class="dialog-content">
        <p>请填写Maven坐标：</p>
        <el-input
          v-model="maven"
          type="textarea"
          resize="none"
          style="width: 100%"
          :rows="7"
          :placeholder="mavenPlaceholder"
        ></el-input>
      </div>
      <div slot="footer">
        <el-button @click="configMavenDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSaveMavenConfig"
          >保 存</el-button
        >
      </div>
    </el-dialog>

    <!-- 开放扩展点表格 -->
    <el-table
      v-loading="tableDataLoading"
      :data="tableData"
      :hideEmptyImg="true"
      style="width: 100%"
    >
      <el-table-column type="expand">
        <template
          slot-scope="{ row: { id, spiRunningStatus, spiUatRunningStatus } }"
        >
          <p class="expand-row__title">扩展点运行状态：</p>
          <el-form class="expand-row__form" label-position="left" :model="{}">
            <el-form-item :label="computeCurrentEnvFormItemLabel">
              <span>
                {{
                  formatSpiRunningStatusText(
                    spiRunningStatus,
                    "spiRunningStatus"
                  )
                }}
              </span>
              <el-button
                v-if="judgeSpiRunningStatusButtonVisible(spiRunningStatus)"
                type="text"
                style="margin-left: 16px"
                @click="toggleSpiRunningStatus(id, spiRunningStatus)"
              >
                {{ formatSpiRunningStatusButtonText(spiRunningStatus) }}
              </el-button>
            </el-form-item>
            <el-form-item
              v-if="computeUatEnvFormItemVisible"
              :label="computeUatEnvFormItemLabel"
            >
              <span>
                {{
                  formatSpiRunningStatusText(
                    spiUatRunningStatus,
                    "spiUatRunningStatus"
                  )
                }}
              </span>
              <el-button
                v-if="judgeSpiRunningStatusButtonVisible(spiUatRunningStatus)"
                type="text"
                style="margin-left: 16px"
                @click="toggleSpiRunningStatus(id, spiUatRunningStatus, true)"
              >
                {{ formatSpiRunningStatusButtonText(spiUatRunningStatus) }}
              </el-button>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        min-width="80"
      ></el-table-column>
      <el-table-column
        v-for="(item, index) in tableList"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :min-width="item['min-width']"
        :show-tooltip-when-overflow="true"
      >
        <template slot-scope="{ row, column }">
          <template v-if="column.property === 'uri'">
            <div class="table-cell__uri">
              <p
                v-text="row[column.property]"
                class="table-cell__uri__text"
              ></p>
              <a
                v-clipboard:copy="row[column.property]"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
              >
                <i class="el-icon-document-copy" />
              </a>
            </div>
          </template>
          <template v-else-if="column.property === 'docJssKey'">
            <div class="table-cell__doc-jss-key">
              <p
                v-text="formatDocJssKeyText(row[column.property])"
                class="table-cell__doc-jss-key__text"
              ></p>
              <el-button type="text" @click="handleExpandDocJssKey(row)"
                >展开</el-button
              >
            </div>
          </template>
          <template v-else-if="column.property === 'spiStatus'">
            <span
              v-text="formatSpiStatusText(row[column.property])"
              :class="formatSpiStatusClassName(row[column.property])"
            ></span>
          </template>
          <template v-else-if="column.property === 'isHide'">
            <span v-text="formatIsHideText(row[column.property])"></span>
          </template>
          <template v-else>
            <span>{{ row[column.property] }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="handle" label="操作" min-width="180" fixed="right">
        <template slot-scope="{ row, row: { spiStatus, isHide } }">
          <el-button
            type="text"
            @click="handleEditExtensionPointDocumentButton(row)"
            >对外文档</el-button
          >
          <el-button
            type="text"
            @click="handleHideOrCancelHideExtensionPoint(row)"
          >
            {{ formatHideOrCancelHideButtonText(isHide) }}
          </el-button>
          <el-button
            v-if="judgeDeleteExtensionPointButtonVisible(spiStatus)"
            type="text"
            style="color: #e1251b"
            @click="handleDeleteExtensionPoint(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <Pagination
      v-if="total > 0"
      :currentPage.sync="currentPage"
      :pageSize.sync="pageSize"
      :total.sync="total"
      :reloadTableData="reloadTableData"
    />

    <!-- 扩展点触发场景对话框 -->
    <el-dialog
      v-if="docJssKeyDialogVisible"
      :visible.sync="docJssKeyDialogVisible"
      :close-on-click-modal="false"
      title="扩展点触发场景"
      width="640px"
      class="doc-jss-key-dialog"
      @close="closeDocJssKeyDialog"
    >
      <div class="dialog-content">
        <MarkdownEditor
          ref="MarkdownEditor"
          v-model="docJssKeyData.docJssKey"
          class="markdown-editor"
        />
      </div>
      <div slot="footer">
        <el-button @click="docJssKeyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSaveDocJssKey">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination.vue";
import MarkdownEditor from "@/components/MarkdownEditor/index.vue";
import openExtensionPoint from "@/api/intranet/softwareSystem/developerResource/openExtensionPoint.js";
import softwareSystem from "@/api/intranet/softwareSystem/index.js";

export default {
  name: "ExtensionPointList",
  components: { Pagination, MarkdownEditor },
  props: {
    currentDisplayComponentName: {
      type: String,
      required: true,
    },
    productCode: {
      type: String,
      required: true,
    },
    extensionPointId: {
      type: Number,
    },
    methodName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      env: window.env.buildEnv,
      // 查询表单
      productSysGroupId: undefined,
      keyWords: "",
      // 配置Maven坐标
      configMavenDialogVisible: false,
      maven: "",
      mavenPlaceholder: `示例：
<dependency>
  <groupId>com.jd.lcp.test</groupId>
  <artifactId>test-api</artifactId>
  <version>1.3.0-TEST</version>
</dependency>`,
      // 扩展点列表
      tableDataLoading: true,
      tableData: [],
      tableList: [
        {
          prop: "productSysGroupCnName",
          label: "所属分类",
          "min-width": "180",
        },
        { prop: "cnName", label: "中文名称", "min-width": "180" },
        { prop: "uri", label: "URI", "min-width": "300" },
        { prop: "spiStatus", label: "状态", "min-width": "80" },
        { prop: "supportedVersions", label: "支持的版本", "min-width": "180" },
        { prop: "docJssKey", label: "触发场景", "min-width": "280" },
        { prop: "isHide", label: "显示/隐藏", "min-width": "100" },
      ],
      // 扩展点触发场景
      docJssKeyDialogVisible: false,
      docJssKeyData: {
        id: null,
        docJssKey: "",
      },
      // 分页器
      currentPage: 1,
      pageSize: 10,
      total: 0,
    };
  },
  computed: {
    // 计算表格展开行中当前环境表单项标签
    computeCurrentEnvFormItemLabel() {
      const hashMap = {
        local: "开发环境：",
        devtest: "开发环境：",
        publictest: "测试环境：",
        uat: "生产环境：",
        prod: "生产环境：",
      };
      return hashMap[this.env] || "";
    },
    // 计算表格展开行中预发（开发、预发）环境表单项标签
    computeUatEnvFormItemLabel() {
      const hashMap = {
        publictest: "开发环境：",
        uat: "预发环境：",
        prod: "预发环境：",
      };
      return hashMap[this.env] || "";
    },
    // 计算预发环境表单项是否显示
    computeUatEnvFormItemVisible() {
      const envList = ["publictest", "uat", "prod"];
      return envList.includes(this.env);
    },
  },
  methods: {
    // 查询扩展点列表
    async list() {
      const {
        productCode,
        productSysGroupId,
        keyWords,
        currentPage,
        pageSize,
      } = this;
      const pageNum = currentPage;
      const data = {
        productCode,
        productSysGroupId,
        keyWords,
        pageNum,
        pageSize,
      };
      return await openExtensionPoint.list(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("list");
      });
    },
    // 软件系统-详情 查看详情信息
    async product() {
      const { id } = this.$route.params;
      const params = { id };
      return softwareSystem.product(params).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("product");
      });
    },
    // 软件系统详情-开发者资源-开放扩展点-保存Maven配置
    async SaveMaven() {
      const productId = parseInt(this.$route.params.id);
      const { maven } = this;
      const data = { productId, maven };
      return await softwareSystem.maven(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("SaveMaven");
      });
    },
    // 删除开放扩展点
    async delete(id) {
      const params = { id };
      return await openExtensionPoint.delete(params).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("delete");
      });
    },
    // 软件系统详情-开发者资源-开放扩展点-更新触发场景描述
    async update(id, docJssKey) {
      const data = { id, docJssKey };
      return await openExtensionPoint.update(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("update");
      });
    },
    // 软件系统详情-开发者资源-开放扩展点-当前运行环境扩展点上下线
    async settingIsOnline(id, spiIsOnline) {
      const data = { id, spiIsOnline };
      return await openExtensionPoint.settingIsOnline(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("settingIsOnline");
      });
    },
    // 软件系统详情-开发者资源-开放扩展点-预发运行环境扩展点上下线
    async settingUatIsOnline(id, spiUatIsOnline) {
      const data = { id, spiUatIsOnline };
      return await openExtensionPoint
        .settingUatIsOnline(data)
        .catch((error) => {
          const { message } = error.data;
          message && this.$message.error(message);
          throw new Error("settingUatIsOnline");
        });
    },
    // 软件系统详情-开发者资源-开放扩展点-当前运行环境扩展点取消上下线
    async cancelOnlineState(id) {
      return await openExtensionPoint.cancelOnlineState(id).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("cancelOnlineState");
      });
    },
    // 软件系统详情-开发者资源-开放扩展点-预发运行环境扩展点取消上下线
    async cancelUatOnlineState(id) {
      return await openExtensionPoint
        .cancelUatOnlineState(id)
        .catch((error) => {
          const { message } = error.data;
          message && this.$message.error(message);
          throw new Error("cancelUatOnlineState");
        });
    },
    // 软件系统详情-开发者资源-隐藏扩展点
    async hide(id) {
      return await openExtensionPoint.hide(id).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("hide");
      });
    },
    // 软件系统详情-开发者资源-取消隐藏扩展点
    async show(id) {
      return await openExtensionPoint.show(id).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("show");
      });
    },

    // 格式化触发场景描述
    formatDocJssKeyText(text) {
      const maxLength = 20;
      return text && text.length > maxLength
        ? `${text.slice(0, maxLength)}...`
        : text || "";
    },
    // 格式化扩展点状态文案
    formatSpiStatusText(spiStatus) {
      const { dictionary } = this.$store.state.tools;
      try {
        return dictionary.spiStatus[spiStatus].value;
      } catch (error) {
        return spiStatus || "";
      }
    },
    // 格式化扩展点状态类名
    formatSpiStatusClassName(spiStatus) {
      const classNameHashMap = {
        0: "initColor",
        1: "normalColor",
        2: "updateColor",
      };
      return classNameHashMap[spiStatus] || "";
    },
    // 格式化显示/隐藏文案
    formatIsHideText(isHide) {
      const { dictionary } = this.$store.state.tools;
      try {
        return dictionary.isHide[isHide].value;
      } catch (error) {
        return spiStatus || "";
      }
    },
    // 判断删除扩展点按钮是否显示
    judgeDeleteExtensionPointButtonVisible(spiStatus) {
      const statusList = [0];
      return statusList.includes(spiStatus);
    },
    // 判断扩展点运行状态按钮是否显示
    judgeSpiRunningStatusButtonVisible(runningStatus) {
      const displayedRunningStatusList = [0, 1, 2, 3];
      return displayedRunningStatusList.includes(runningStatus);
    },
    // 格式化扩展点运行状态文案
    formatSpiRunningStatusText(runningStatus, runningStatusString) {
      const { dictionary } = this.$store.state.tools;
      try {
        return dictionary[runningStatusString][runningStatus].value;
      } catch (error) {
        return runningStatus || "-";
      }
    },
    // 格式化扩展点运行状态按钮文案
    formatSpiRunningStatusButtonText(runningStatus) {
      const hashMap = { 0: "上线", 1: "下线", 2: "取消上线", 3: "取消下线" };
      return hashMap[runningStatus] || "";
    },
    // 格式化隐藏/取消隐藏扩展点按钮文案
    formatHideOrCancelHideButtonText(isHide) {
      const hashMap = { 0: "隐藏", 1: "取消隐藏" };
      return hashMap[isHide] || "";
    },
    // 隐藏/取消隐藏扩展点操作
    async handleHideOrCancelHideExtensionPoint(row) {
      const { id, isHide } = row;
      const hashMap = {
        0: () => {
          this.$confirm(
            "隐藏后，前台扩展点文档以及之后创建的扩展点应用中将隐藏该扩展点，历史创建的应用将提示该扩展点即将下线。是否仍要隐藏？",
            {
              confirmButtonText: "隐 藏",
              cancelButtonText: "取 消",
              type: "warning",
              showClose: false,
              closeOnClickModal: false,
            }
          ).then(async () => {
            await this.hide(id).catch(() => {
              throw new Error("handleHideOrCancelHideExtensionPoint hide");
            });
            this.$message.success("操作成功！");
            this.reloadTableData();
          });
        },
        1: async () => {
          await this.show(id).catch(() => {
            throw new Error("handleHideOrCancelHideExtensionPoint show");
          });
          this.$message.success("操作成功！");
          this.reloadTableData();
        },
      };
      hashMap[isHide] && hashMap[isHide]();
    },
    // 切换扩展点运行状态操作
    toggleSpiRunningStatus(id, runningStatus, isUatSandbox = false) {
      const hashMap = {
        // 上线操作
        0() {
          return this[1]();
        },
        // 下线操作
        1: () =>
          this.handleSpiRunningStatusOnlineOrOffline(
            id,
            runningStatus,
            isUatSandbox
          ),
        // 取消上线
        2() {
          return this[3]();
        },
        // 取消下线
        3: () =>
          this.handleSpiRunningStatusCancelOnlineOrOffline(id, isUatSandbox),
      };
      hashMap[runningStatus] && hashMap[runningStatus]();
    },
    // 扩展点运行状态上下线操作
    async handleSpiRunningStatusOnlineOrOffline(
      id,
      runningStatus,
      isUatSandbox
    ) {
      const spiIsOnline = Number(!Boolean(runningStatus));
      isUatSandbox
        ? await this.settingUatIsOnline(id, spiIsOnline).catch(() => {
            throw new Error(
              "handleSpiRunningStatusOnlineOrOffline settingUatIsOnline"
            );
          })
        : await this.settingIsOnline(id, spiIsOnline).catch(() => {
            throw new Error(
              "handleSpiRunningStatusOnlineOrOffline settingIsOnline"
            );
          });
      this.$message.success("操作成功！");
      this.reloadTableData();
    },
    // 扩展点运行状态取消上下线操作
    async handleSpiRunningStatusCancelOnlineOrOffline(id, isUatSandbox) {
      isUatSandbox
        ? await this.cancelUatOnlineState(id).catch(() => {
            throw new Error(
              "handleSpiRunningStatusCancelOnlineOrOffline cancelUatOnlineState"
            );
          })
        : await this.cancelOnlineState(id).catch(() => {
            throw new Error(
              "handleSpiRunningStatusCancelOnlineOrOffline cancelOnlineState"
            );
          });
      this.$message.success("操作成功！");
      this.reloadTableData();
    },
    // 加载扩展点表格
    async reloadTableData() {
      this.$emit("updateStatus");
      this.tableDataLoading = true;
      const response = await this.list().catch(() => {
        throw new Error("reloadTableData");
      });
      const { total, list } = response.data.data;
      this.total = total || 0;
      this.tableData = list || [];
      this.tableDataLoading = false;
    },
    // 打开对话框时获取Maven坐标
    async openConfigMavenDialog() {
      const response = await this.product().catch(() => {
        throw new Error("openConfigMavenDialog");
      });
      const { data } = response.data;
      const { maven } = data;
      this.maven = maven;
    },
    // 关闭对话框时清空Maven坐标
    closeConfigMavenDialog() {
      this.maven = "";
    },
    // 保存Maven配置操作
    async handleSaveMavenConfig() {
      await this.SaveMaven().catch(() => {
        throw new Error("handleSaveMavenConfig");
      });
      this.$message.success("保存Maven配置成功！");
      this.configMavenDialogVisible = false;
    },

    // 展开触发场景描述操作
    handleExpandDocJssKey(row) {
      this.docJssKeyDialogVisible = true;
      const { id, docJssKey } = row;
      this.docJssKeyData = { id, docJssKey };
    },
    // 关闭对话框时清空当前出发场景Markdown
    closeDocJssKeyDialog() {
      const id = null;
      const docJssKey = "";
      this.docJssKeyData = { id, docJssKey };
    },
    // 保存触发场景
    async handleSaveDocJssKey() {
      this.docJssKeyData.docJssKey = this.$refs.MarkdownEditor.getValue();
      const { id, docJssKey } = this.docJssKeyData;
      await this.update(id, docJssKey).catch(() => {
        throw new Error("handleSaveDocJssKey");
      });
      this.$message.success("保存触发场景成功！");
      this.docJssKeyDialogVisible = false;
      this.reloadTableData();
    },
    // 点击编辑扩展点按钮
    handleEditExtensionPointDocumentButton(row) {
      const { id, methodName } = row;
      this.$emit("update:extensionPointId", id);
      this.$emit("update:methodName", methodName);
      this.$emit(
        "update:currentDisplayComponentName",
        "EditExtensionPointDocument"
      );
    },
    // 删除扩展点操作
    async handleDeleteExtensionPoint(row) {
      const { id } = row;
      await this.delete(id).catch(() => {
        throw new Error("handleDeleteExtensionPoint");
      });
      this.$message.success("删除扩展点成功！");
      this.reloadTableData();
    },
    onCopy(e) {
      this.$message.success("复制成功");
    },
    onError(e) {
      this.$message.error("复制失败");
    },
  },
  mounted() {
    this.reloadTableData();
  },
};
</script>

<style lang="scss" scoped>
.extension-point-list {
  .search-wrapper {
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .el-table {
    .el-icon-document-copy {
      color: #999999;
    }
    .table-cell__uri {
      display: flex;
      .table-cell__uri__text {
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .table-cell__doc-jss-key {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .table-cell__doc-jss-key__text {
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
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
    }
  }
  .config-maven-dialog {
    .dialog-content {
      padding: 0 16px;
    }
  }
  .doc-jss-key-dialog {
    .dialog-content {
      max-height: 400px;
    }
  }
}
</style>