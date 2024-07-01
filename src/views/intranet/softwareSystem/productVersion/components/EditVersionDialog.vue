<template>
  <div class="edit-version-dialog">
    <el-dialog
      title="编辑版本"
      width="700px"
      top="5vh"
      :close-on-click-modal="false"
      :before-close="closeEditVersionDialog"
      :visible="showEditVersionDialog"
    >
      <div class="dialog-wrapper">
        <el-form
          class="wrapper-form"
          :model="editVersionForm"
          :rules="editVersionRules"
          ref="editVersionForm"
        >
          <el-form-item
            label="版本名称:"
            prop="versionName"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="editVersionForm.versionName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="版本编码:"
            prop="versionCode"
            :label-width="formLabelWidth"
          >
            <el-input
              disabled
              v-model="editVersionForm.versionCode"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="detail"
            label="版本描述:"
            :label-width="formLabelWidth"
          >
            <el-input
              type="textarea"
              v-model="editVersionForm.detail"
              placeholder="请输入内容"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="price"
            label="版本金额:"
            :label-width="formLabelWidth"
          >
            <el-input-number
              v-model="editVersionForm.price"
              :min="0"
              :controls="false"
              :precision="2"
              placeholder="0.00"
              autocomplete="off"
              style="width: 70%"
            ></el-input-number>
            <span style="margin-left: 20px">/ 年</span>
          </el-form-item>
          <el-form-item
            prop="remark"
            label="备注:"
            :label-width="formLabelWidth"
          >
            <el-input
              type="textarea"
              v-model="editVersionForm.remark"
              placeholder="请输入内容"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="$emit('update:showEditVersionDialog', false)"
          >取 消</el-button
        >
        <el-button type="primary" @click="updateVersion('editVersionForm')"
          >完 成</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import regExp from "@/constants/regExp.js";
import productVersionApi from "@/api/intranet/softwareSystem/productVersion/index.js";

export default {
  name: "EditVersionDialog",
  data() {
    return {
      formLabelWidth: "100px",
      editVersionForm: {},
      editVersionRules: {
        versionName: [
          { required: true, message: "请输入版本名称", trigger: "blur" },
          { max: 30, message: "版本名称最大长度为30个字符" },
          { pattern: regExp.normal, message: "版本名称不可输入特殊字符" },
        ],
        versionCode: [
          { required: true, message: "请输入版本编码", trigger: "blur" },
          { max: 50, message: "版本编码最大长度为50个字符" },
          { pattern: regExp.normal, message: "版本编码不可输入特殊字符" },
        ],
        remark: [
          { max: 120, message: "备注最大长度为120个字符" },
          { pattern: regExp.normal, message: "备注不可输入特殊字符" },
        ],
        detail: [
          { required: true, message: "请输入版本描述", trigger: "blur" },
          { max: 120, message: "描述最大长度为120个字符" },
        ],
        price: [
          { required: true, message: "请输入版本金额", trigger: "blur" },
          {
            pattern: regExp.number,
            message: "版本金额只能输入数字及小数点后两位数",
          },
        ],
      },
    };
  },
  props: {
    showEditVersionDialog: {
      type: Boolean,
      default: false,
    },
    currentRow: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.getEditVersionDetail();
  },
  methods: {
    closeEditVersionDialog(done) {
      this.$refs["editVersionForm"] &&
        this.$refs["editVersionForm"].resetFields();
      this.$emit("update:showEditVersionDialog", false);
      done();
    },
    //查看产品版本详情
    async getEditVersionDetail() {
      this.editVersionForm = JSON.parse(JSON.stringify(this.currentRow));
      this.editVersionForm.price = this.editVersionForm.price / 100;
    },
    updateVersion(formName) {
      // 校验
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const category = "MENUTREE";
          const { lopResourceId, id } = this.currentRow;
          //后端以分为单位存储数据，要求前端对金额*100做处理
          const price = this.editVersionForm.price * 100;
          const { versionName, remark, detail } = this.editVersionForm;
          const data = {
            category,
            lopResourceId,
            versionName,
            remark,
            id,
            detail,
            price,
          };
          await productVersionApi.updateVersion(data).catch((error) => {
            throw new Error("updateVersion");
          });
          // 触发更新软件系统状态事件
          this.$emit("updateStatus");
          this.$emit("queryVersionList");
          this.$emit("update:showEditVersionDialog", false);
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.edit-version-dialog {
  .dialog-wrapper {
    height: 380px;
    overflow: auto;
    .wrapper-form {
      width: 400px;
      margin: 0 auto;
    }
  }
}
</style>