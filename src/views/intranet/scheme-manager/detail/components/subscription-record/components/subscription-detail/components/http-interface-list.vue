<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="apiName" label="中文名称"> </el-table-column>
      <el-table-column prop="apiUri" label="URI"> </el-table-column>
      <el-table-column prop="apiRemark" label="描述"> </el-table-column>
      <el-table-column prop="callDirection" label="调用方向">
        <template slot-scope="scope">
          {{ formatCallDirection(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column prop="callBackUrl" min-width="200">
        <template #header>
          <span>{{ env | formatInternalCallExternalCallBackUrlHeader }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="(env === 'uat' || env === 'prod') && hasUat"
        prop="shadowboxCallbackUrl"
        label="预发环境回调URL"
        min-width="200"
      >
        <template #default="{ row: { shadowboxCallbackUrl } }">
          <span>{{ shadowboxCallbackUrl || "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="订阅时间">
        <template slot-scope="scope">
          {{ formatParseTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="configurationBusinessCode(scope.row)"
            >配置业务编码</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      v-if="total > 0"
      :currentPage.sync="pageNum"
      :pageSize.sync="pageSize"
      :total.sync="total"
      :reloadTableData="queryCallOutSubApiList"
    />
    <!-- 配置业务编码对话框 -->
    <el-dialog
      title="配置业务编码"
      width="400px"
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="formRules">
        <el-form-item prop="customerCode">
          <el-input
            v-model="form.customerCode"
            placeholder="青龙业主号/事业部编码/渠道编码等业务唯一标识码"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancle">取 消</el-button>
        <el-button type="primary" @click="saveCustomerCode">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination.vue";
import openBusinese from "@/api/intranet/openBusinese/index.js";
import parseTime from "@/utils/parseTime.js";

export default {
  name: "HttpInterfaceList",
  components: {
    Pagination,
  },
  props: {
    currentRowData: {
      type: Object,
      default: {},
    },
    hasUat: { type: Number, required: true },
  },
  data() {
    return {
      env: window.env.baseEnv,
      tableData: [],
      dialogFormVisible: false,
      form: {},
      pageNum: 1,
      pageSize: 10,
      total: 0,
      formRules: {
        customerCode: [{ required: true, message: "请输入内容" }],
      },
      row: {},
    };
  },
  filters: {
    formatInternalCallExternalCallBackUrlHeader(env) {
      const hashMap = new Map()
        .set("test", "测试环境回调URL")
        .set("uat", "生产环境回调URL")
        .set("prod", "生产环境回调URL");
      return hashMap.get(env) || "-";
    },
  },
  methods: {
    // 查询
    async queryCallOutSubApiList() {
      const appCode = this.currentRowData.appKey;
      const { unitCode, supplierCode } = this.currentRowData;
      const data = {
        appCode,
        unitCode,
        supplierCode,
      };
      const response =
        await openBusinese.subscriptionRecord.queryCallOutSubApiList(data);
      this.tableData = response.data.list;
      this.total = response.data.total;
    },
    //打开配置弹窗
    configurationBusinessCode(row) {
      this.dialogFormVisible = true;
      this.row = JSON.parse(JSON.stringify(row));
      this.form = this.row;
    },
    // 保存
    async saveCustomerCode() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          await this.addCustomerCode().catch((error) => {
            const { code, message } = error.data;
            if (code === 1001) {
              this.$message({
                type: "error",
                showClose: true,
                duration: 0,
                message,
              });
            } else {
              this.$message.error(message);
            }
            throw new Error(error);
          });
          this.$message.success("保存成功");
          this.dialogFormVisible = false;
          this.resetForm();
          this.queryCallOutSubApiList();
        } else {
          return false;
        }
      });
    },
    async addCustomerCode() {
      const { subCode } = this.row;
      const { customerCode } = this.form;
      const params = { subCode, customerCode };
      const response = await openBusinese.subscriptionRecord.addCustomerCode(
        params
      );
      return response;
    },
    //转换调用方向
    formatCallDirection(row) {
      const callDirectionMap = [, "外部调用京东物流", "京东物流调用外部"];
      return row.callDirection ? callDirectionMap[row.callDirection] : "-";
    },
    //转换时间戳
    formatParseTime(time) {
      return parseTime.timeInTable(time);
    },
    // 重置表单
    resetForm() {
      this.$nextTick(() => {
        this.$refs["form"].resetFields();
        //置空
        this.form = {};
      });
    },
    //关闭弹窗
    handleClose(done) {
      this.resetForm();
      done();
    },
    //取消按钮
    handleCancle() {
      this.dialogFormVisible = false;
      this.resetForm();
    },
  },
  created() {
    this.queryCallOutSubApiList();
  },
};
</script>

<style lang="scss" scoped>
</style>