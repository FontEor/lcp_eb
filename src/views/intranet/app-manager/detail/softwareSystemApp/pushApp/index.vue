<template>
  <div class="push-app">
    <!-- 顶部tag信息 -->
    <TagTip :closable="false">
      您可将应用主动推送给客户使用，推送成功后，客户端将自动加载该应用的个性化逻辑。
    </TagTip>

    <div class="search-wrapper">
      <div></div>
      <div class="button-wrapper"   v-show="!disabled">
         <el-button type="primary" @click="dialogVisible = true">新建推送</el-button>
      </div>
      <div class="button-wrapper"  v-show="disabled">
         <el-tooltip  class="item" effect="dark" content="最多支持推送5个租户" placement="top">
            <el-button type="info">新建推送</el-button>
         </el-tooltip>
      </div>     
    </div>

    <!-- 新增推送对话框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      title="新增推送"
      width="480px"
      @close="closeDialog"
    >
      <div class="dialog-content">
        <el-form
          :model="createPushFormData"
          :rules="createPushFormRules"
          label-width="80px"
          ref="createPushForm"
          class="create-push-form"
        >
          <el-form-item label="租户名称" prop="tenantName">
            <el-input
              v-model.trim="createPushFormData.tenantName"
              placeholder="请输入租户名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="租户编码" prop="tenantCode">
            <el-input
              v-model.trim="createPushFormData.tenantCode"
              placeholder="请输入租户编码"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model.trim="createPushFormData.remark"
              placeholder="请输入备注"
              type="textarea"
              resize="none"
              :rows="4"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirmCreatePush"
          >确认新建</el-button
        >
      </div>
    </el-dialog>

    <!-- 推送表格 -->
    <el-table
      v-loading="tableDataLoading"
      :data="tableData"
      :hideEmptyImg="true"
      style="width: 100%"
    >
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
      </el-table-column>
      <el-table-column prop="handle" label="操作" min-width="100" fixed="right">
        <template slot-scope="{ row }">
          <el-popconfirm
            width="200"
            title="撤销后该租户将无法继续使用扩展功能，是否仍要继续？"
            :hideIcon="true"
            @onConfirm="handleRepeal(row)"
          >
            <el-button slot="reference" type="text">撤销</el-button>
          </el-popconfirm>
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
  </div>
</template>

<script>
import TagTip from "@/components/common/TagTip.vue";
import Pagination from "@/components/Pagination.vue";
import appManager from "@/api/intranet/appManager/index.js";

export default {
  name: "PushApp",
  components: { TagTip, Pagination },
  props: {
    appCode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      // 新建推送
      dialogVisible: false,
      createPushFormData: { tenantName: "", tenantCode: "", remark: "" },
      createPushFormRules: {
        tenantName: [{ required: true, message: "请输入租户名称" }],
        tenantCode: [{ required: true, message: "请输入租户编码" }],
      },
      // 扩展点列表
      tableDataLoading: true,
      tableData: [],
      tableList: [
        {
          prop: "tenantName",
          label: "租户名称",
          "min-width": "180",
        },
        { prop: "tenantCode", label: "租户编码", "min-width": "180" },
        { prop: "remark", label: "备注", "min-width": "300" },
        { prop: "updateUser", label: "操作人", "min-width": "180" },
        { prop: "updateTime", label: "推送时间", "min-width": "180" },
      ],
      // 分页器
      currentPage: 1,
      pageSize: 10,
      total: 0,
      disabled:false
    };
  },
  methods: {
    // 推送应用列表查询
    async pushTenantList() {
      const { appCode, currentPage, pageSize } = this;
      const pageNum = currentPage;
      const params = { pageNum, pageSize };
      return await appManager.pushTenantList(params, appCode).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("pushTenantList");
      });
    },
    // 应用租户推送新建
    async pushTenant() {
      const { appCode, createPushFormData } = this;
      const { tenantName, tenantCode, remark } = createPushFormData;
      const data = { appCode, tenantName, tenantCode, remark };
      return await appManager.pushTenant(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("pushTenant");
      });
    },
    // 推送应用列表撤销
    async pushTenantRevoke(id) {
      return await appManager.pushTenantRevoke(id).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("pushTenantRevoke");
      });
    },

    // 加载推送表格
    async reloadTableData() {
      this.tableDataLoading = true;
      const response = await this.pushTenantList().catch(() => {
        throw new Error("reloadTableData");
      });
      const { data } = response.data;
      if(data.total>=5){
        this.disabled=true
      }else if(data.total<5){
        this.disabled=false
      }
      const { total, list } = data;
      this.total = total;
      this.tableData = list;
      this.tableDataLoading = false;
    },
    // 关闭对话框时清空新增推送表单
    closeDialog() {
      this.$refs.createPushForm.resetFields();
    },
    // 确认新增推送操作
    handleConfirmCreatePush() {
      this.$refs.createPushForm.validate(async (valid) => {
        if (valid) {
          await this.pushTenant().catch(() => {
            throw new Error("handleConfirmCreatePush");
          });
          this.$message.success("新建推送成功！");
          this.$emit("updateAppStatus");
          this.reloadTableData();
          this.dialogVisible = false;
        } else {
          return false;
        }
      });
    },
    // 撤销推送操作
    async handleRepeal(row) {
      const { id } = row;
      await this.pushTenantRevoke(id).catch(() => {
        throw new Error("handleRepeal");
      });
      this.$message.success("撤销推送成功！");
      this.$emit("updateAppStatus");
      this.reloadTableData();
    },
  },
  created() {
    this.reloadTableData();
  },
};
</script>

<style lang="scss" scoped>
.push-app {
  .search-wrapper {
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>