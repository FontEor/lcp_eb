<template>
  <div class="dialog-auto-configure-business-code">
    <el-dialog
      :visible="dialogConfigVisible"
      :close-on-click-modal="false"
      title="业务编码自动配置"
      width="880px"
      class="dialog-auto-configure-business-code__config"
      @open="onOpenConfigDialog"
      @close="onCloseConfigDialog"
    >
      <TagTip :closable="false">
        自动配置开启前，回传API提供方需要根据
        <Link :href="callbackApiPlatformDescriptionHref">回调API平台说明</Link>
        开发业务编码回调API；自动配置开启后，开放平台将自动配置业务编码。
      </TagTip>

      <el-form
        :model="formModel"
        :rules="formRules"
        label-width="240px"
        ref="form"
      >
        <el-form-item label="业务编码自动配置" prop="autoCodeConfig">
          <el-switch
            v-model="formModel.autoCodeConfig"
            :active-value="1"
            :inactive-value="0"
            active-inner-text="开"
            inactive-inner-text="关"
          />
        </el-form-item>
        <el-form-item label="业务编码回调API JSF别名" prop="codeConfigAlias">
          <el-input
            v-model.trim="formModel.codeConfigAlias"
            :disabled="codeConfigAliasInputDisabled"
            placeholder="手动输入，精准匹配"
            style="width: 60%"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="onClickConfigCancelButton">取消</el-button>
        <el-button
          :loading="saveButtonLoading"
          type="primary"
          @click="onClickConfigSaveButton"
          >保存</el-button
        >
      </template>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogAliasTipVisible"
      :close-on-click-modal="false"
      title="API JSF别名重复提示"
      top="5vh"
      width="880px"
      class="dialog-auto-configure-business-code__alias-tip"
    >
      <p>
        您所选择的JSF别名已经应用于下列对接方案的URL中，请确认是否继续使用此JSF别名？
      </p>
      <el-table v-loading="tableLoading" :data="tableData" height="320">
        <el-table-column type="index" width="80" />
        <el-table-column
          v-for="({ label, prop }, index) in tableColumnList"
          :key="index"
          :prop="prop"
          :label="label"
        />
      </el-table>

      <Pagination
        :currentPage.sync="pageNumb"
        :pageSize.sync="pageSize"
        :total.sync="total"
        :reloadTableData="handleQueryWithPage"
      />
      <template #footer>
        <el-button @click="onClickAliasTipCancelButton">取消</el-button>
        <el-button
          :loading="confirmButtonLoading"
          type="primary"
          @click="onClickAliasTipConfirmButton"
          >确认</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script>
import TagTip from "@/components/common/TagTip.vue";
import Link from "@/components/Link.vue";
import Pagination from "@/components/Pagination.vue";
import lcp from "@/api/intranet/lcp/index.js";
import { debounce } from "lodash";

export default {
  name: "DialogAutoConfigureBusinessCode",
  components: { TagTip, Link, Pagination },
  props: {
    dialogConfigVisible: { type: Boolean, required: true },
    currentRow: { type: Object, required: true },
  },
  data() {
    const validateCodeConfigAlias = (rule, value, callback) => {
      const { autoCodeConfig } = this.formModel;
      if (!autoCodeConfig) {
        return callback();
      }
      if (!value) {
        return callback(new Error("请输入JSF别名"));
      }
      this.handleCheckAliasExist(value)
        .then((existing) => {
          if (!existing) {
            return callback(new Error("请输入正确的JSF别名"));
          }
          callback();
        })
        .catch(() => {
          console.error("validateCodeConfigAlias");
          return callback(new Error("校验失败"));
        });
    };

    return {
      callbackApiPlatformDescriptionHref: "//lcp.jdl.com/#/apiNewHand/54720",
      id: 0,
      formModel: {
        autoCodeConfig: 0,
        codeConfigAlias: "",
      },
      formRules: {
        codeConfigAlias: [
          { validator: debounce(validateCodeConfigAlias, 300) },
        ],
      },
      saveButtonLoading: false,

      dialogAliasTipVisible: false,
      pageNumb: 1,
      pageSize: 10,
      total: 0,
      tableLoading: false,
      tableData: [],
      tableColumnList: [
        { prop: "unitName", label: "对接方案名称" },
        { prop: "unitCode", label: "对接方案编码" },
        { prop: "apiUrl", label: "URL" },
        { prop: "domainOfGateway", label: "API所属分组编码" },
      ],
      confirmButtonLoading: false,
    };
  },
  computed: {
    codeConfigAliasInputDisabled() {
      const { autoCodeConfig } = this.formModel;
      return !Boolean(autoCodeConfig);
    },
  },
  methods: {
    // 根据接口名称与别名校验接口下别名是否存在接口
    async checkAliasExist(alias) {
      const qualifiedName =
        "cn.jdl.lcp.outer.service.spi.BizUnitCallOutService";
      const params = { qualifiedName, alias };
      return await lcp.jsf.checkAliasExist(params);
    },
    // 保存回传API自动配置接口调用
    async saveAutoCodeConfig() {
      const { id } = this;
      const { autoCodeConfig, codeConfigAlias } = this.formModel;
      const data = { id, autoCodeConfig, codeConfigAlias };
      return await lcp.bizapinterface.saveAutoCodeConfig(data);
    },
    // 根据别名查询此别名是否有调用API接口调用
    async queryWithPage() {
      const { pageNumb, pageSize } = this;
      const { codeConfigAlias } = this.formModel;
      const params = { pageNumb, pageSize, codeConfigAlias };
      return await lcp.bizapinterface.queryWithPage(params);
    },

    // 根据接口名称与别名校验接口下别名是否存在接口操作
    async handleCheckAliasExist(alias) {
      const { data } = await this.checkAliasExist(alias).catch((error) => {
        console.error("handleCheckAliasExist");
        throw error;
      });
      return data;
    },
    // 保存回传API自动配置接口操作
    async handleSaveAutoCodeConfig() {
      await this.saveAutoCodeConfig().catch((error) => {
        console.error("handleSaveAutoCodeConfig");
        throw error;
      });
      this.$message.success("操作成功");
      this.onCloseConfigDialog();
    },
    // 根据别名查询此别名是否有调用API接口操作
    async handleQueryWithPage(pageNumb = 0) {
      if (pageNumb) {
        this.pageNumb = pageNumb;
      }
      this.tableLoading = true;
      const {
        data: { list, total },
      } = await this.queryWithPage().catch((error) => {
        console.error("handleQueryWithPage");
        throw error;
      });
      this.tableData = Array.isArray(list) ? list : [];
      this.total = total || 0;
      this.tableLoading = false;
    },

    onOpenConfigDialog() {
      const { id, autoCodeConfig, codeConfigAlias } = this.currentRow;
      this.id = id;
      this.formModel = { autoCodeConfig, codeConfigAlias };
    },
    onCloseConfigDialog() {
      this.$emit("update:dialogConfigVisible", false);
      this.$emit("closeConfigDialog");
    },
    onClickConfigCancelButton() {
      this.onCloseConfigDialog();
    },
    onClickConfigSaveButton: debounce(async function () {
      await this.$refs.form.validate().catch(() => {
        throw new Error("未通过表单校验");
      });
      const { autoCodeConfig } = this.formModel;
      // 未开启自动配置
      if (!autoCodeConfig) {
        this.saveButtonLoading = true;
        await this.handleSaveAutoCodeConfig().catch((error) => {
          this.saveButtonLoading = false;
          console.error("onClickConfigSaveButton");
          throw error;
        });
        this.saveButtonLoading = false;
        return;
      }
      this.saveButtonLoading = true;
      await this.handleQueryWithPage(1).catch((error) => {
        this.saveButtonLoading = false;
        console.error("onClickConfigSaveButton");
        throw error;
      });
      this.saveButtonLoading = false;
      const { total } = this;
      // 开启自动配置，但无重复别名
      if (!total) {
        this.saveButtonLoading = true;
        await this.handleSaveAutoCodeConfig().catch((error) => {
          this.saveButtonLoading = false;
          console.error("onClickConfigSaveButton");
          throw error;
        });
        this.saveButtonLoading = false;
        return;
      }
      this.dialogAliasTipVisible = true;
    }, 300),
    onClickAliasTipCancelButton() {
      this.dialogAliasTipVisible = false;
    },
    onClickAliasTipConfirmButton: debounce(async function () {
      this.confirmButtonLoading = true;
      await this.handleSaveAutoCodeConfig().catch((error) => {
        this.confirmButtonLoading = false;
        console.error("onClickConfigSaveButton");
        throw error;
      });
      this.onClickAliasTipCancelButton();
      this.confirmButtonLoading = false;
      this.onClickConfigCancelButton();
    }, 300),
  },
};
</script>

<style lang="scss" scoped>
// .dialog-auto-configure-business-code {
// }
</style>
