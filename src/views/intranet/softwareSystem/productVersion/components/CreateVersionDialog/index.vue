<template>
  <el-dialog
    :visible="dialogVisible"
    :close-on-click-modal="false"
    title="创建版本"
    width="900px"
    top="5vh"
    class="create-version-dialog"
    @opened="onOpenedDialog"
    @close="onCloseDialog"
    @closed="onClosedDialog"
  >
    <div class="dialog-content">
      <Steps
        :active="active"
        :titleList="['填写版本信息', '选择资源', '完成']"
      />
      <!-- 填写版本信息 -->
      <el-form
        v-show="active === 0"
        :model="versionInfoFormData"
        :rules="versionInfoFormRules"
        label-width="100px"
        ref="versionInfoForm"
        class="version-info-form"
      >
        <el-form-item
          v-for="{ label, prop, placeholder } in versionInfoFormItemList"
          :key="prop"
          :label="label"
          :prop="prop"
        >
          <template v-if="['detail', 'remark'].includes(prop)">
            <el-input
              v-model="versionInfoFormData[prop]"
              :placeholder="placeholder"
              :rows="1"
              type="textarea"
              style="width: 100%"
            />
          </template>
          <template v-else-if="prop === 'price'">
            <el-input-number
              v-model="versionInfoFormData[prop]"
              :controls="false"
              :precision="2"
              :min="0"
              style="width: 80%"
            />
            <span style="margin-left: 16px">/ 年</span>
          </template>
          <template v-else>
            <el-input
              v-model.trim="versionInfoFormData[prop]"
              :placeholder="placeholder"
              style="width: 100%"
            />
          </template>
        </el-form-item>
      </el-form>
      <!-- 选择资源 -->
      <div v-show="active === 1" class="checkbox-tree-table">
        <div class="revisions-select-wrapper">
          <p>历史版本模板参考（可选）：</p>
          <el-select
            v-model="lopResourceId"
            :clearable="true"
            style="width: 50%"
            @change="onChangeLopResourceId"
          >
            <el-option
              v-for="item in lopResourceIdList"
              :key="item.lopResourceId"
              :label="item.versionName"
              :value="item.lopResourceId"
            >
              <span style="float: left">{{ item.versionName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.versionCode
              }}</span>
            </el-option>
          </el-select>
        </div>
        <CheckboxTreeTable
          v-loading="loading"
          :fullScreenHeight="fullScreenHeight"
          :tableColumnList="tableColumnList"
          :extendedList="extendedList"
          ref="checkboxTreeTable"
          @selectionChange="onSelectionChange"
        />
      </div>
      <!-- 完成 -->
      <p v-if="active === 2" class="success-step">
        创建成功！您可前往【订阅】为租户开通版本。
      </p>
    </div>
    <template #footer>
      <el-button
        v-if="active === 0"
        @click="$emit('update:dialogVisible', false)"
        >取 消</el-button
      >
      <el-button
        type="primary"
        v-if="active === 0"
        @click="onClickNextRuleStepButton('versionInfoForm')"
        >下一步</el-button
      >

      <el-button v-if="active === 1" @click="onClickPreviousStepButton"
        >上一步</el-button
      >
      <el-button
        type="primary"
        v-if="active === 1"
        @click="onClickNextAddStepButton"
        >下一步</el-button
      >

      <el-button type="primary" @click="onClickISeeButton" v-if="active === 2"
        >我知道了</el-button
      >
    </template>
  </el-dialog>
</template>

<script>
import Steps from "@/components/Steps.vue";
import CheckboxTreeTable from "./components/CheckboxTreeTable.vue";
import sysVersion from "@/api/intranet/lcp/sysVersion.js";
import systemResource from "@/api/intranet/lcp/sysResources.js";
import regExp from "@/constants/regExp.js";

export default {
  name: "CreateVersionDialog",
  components: { Steps, CheckboxTreeTable },
  props: {
    dialogVisible: { type: Boolean, required: true },
    extendedList: { type: Array, required: true },
  },
  data() {
    return {
      productId: parseInt(this.$route.params.id),

      active: 0,
      versionInfoFormData: {
        versionName: "",
        versionCode: "",
        detail: "",
        price: 0,
        remark: "",
      },
      versionInfoFormItemList: [
        {
          label: "版本名称",
          prop: "versionName",
          placeholder: "请输入版本名称",
        },
        {
          label: "版本编码",
          prop: "versionCode",
          placeholder: "版本编码唯一，不允许重复创建",
        },
        {
          label: "版本描述",
          prop: "detail",
          placeholder: "请输入版本描述",
        },
        {
          label: "版本金额",
          prop: "price",
        },
        {
          label: "备注",
          prop: "remark",
          placeholder: "请输入备注",
        },
      ],
      versionInfoFormRules: {
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
        remark: [
          { max: 120, message: "备注最大长度为120个字符" },
          { pattern: regExp.normal, message: "备注不可输入特殊字符" },
        ],
      },

      lopResourceId: null,
      lopResourceIdList: [],
      loading: false,
      tableColumnList: [
        {
          prop: "resourceName",
          width: "300",
          label: "资源名称",
        },
        {
          prop: "resourceCode",
          width: "200",
          label: "资源编码",
        },
        {
          prop: "resourceType",
          label: "类型",
        },
      ],

      selectedId: [],
      resizeDebounceTimer: null,
      fullScreenHeight: 460,
    };
  },
  methods: {
    // 根据软件系统ID与资源类别查询软件系统版本列表
    async queryVersionList() {
      const { productId } = this;
      const category = "MENUTREE";
      const pageNum = 1;
      const pageSize = 500;
      const params = { productId, category, pageNum, pageSize };
      return await sysVersion.queryVersionList(params).catch((error) => {
        throw new Error(`queryVersionList, ${error}`);
      });
    },
    // 根据软件系统ID与资源类别创建资源根节点
    async initSysResources() {
      const { productId } = this;
      const category = "MENUTREE";
      const data = { productId, category };
      return await systemResource.initSysResources(data).catch((error) => {
        throw new Error(`initSysResources, ${error}`);
      });
    },
    // 根据软件系统ID与资源类别查询软件系统系统资源列表数据 常错误码10029表示列表中没有根节点
    async queryResourcesList() {
      const { productId } = this;
      const category = "MENUTREE";
      const params = { productId, category };
      return await systemResource
        .queryResourcesList(params)
        .catch(async ({ data }) => {
          const { code, message } = data;
          if (code === 10029) {
            throw new Error(`queryResourcesList, 10029`);
          } else {
            throw new Error(`queryResourcesList, ${message ? message : data}`);
          }
        });
    },
    // 根据资源标识ID与资源类别查询产品版本资源详情
    async queryVersionDetails() {
      const { lopResourceId } = this;
      const category = "MENUTREE";
      const params = { lopResourceId, category };
      return await sysVersion.queryVersionDetails(params).catch((error) => {
        throw new Error(`queryVersionDetails, ${error}`);
      });
    },
    // 根据软件系统ID与版本编码校验版本编码
    async checkVersionCode() {
      const { productId } = this;
      const { versionCode } = this.versionInfoFormData;
      const data = { productId, versionCode };
      return sysVersion.checkVersionCode(data).catch((error) => {
        throw new Error(`checkVersionCode, ${error}`);
      });
    },
    // 根据选中的资源ID、软件系统ID、资源类别、版本编码、版本名称与备注创建产品版本
    async createVersion() {
      const { selectedId, productId } = this;
      const ids = selectedId;
      const category = "MENUTREE";
      const { versionName, versionCode, remark, detail } =
        this.versionInfoFormData;
      //后端以分为单位存储数据，要求前端对金额*100做处理
      let { price } = this.versionInfoFormData;
      price *= 100;
      const sysVersionRefType = 1;
      const data = {
        ids,
        productId,
        category,
        versionName,
        versionCode,
        remark,
        detail,
        price,
        sysVersionRefType,
      };
      return await sysVersion.createVersion(data).catch((error) => {
        throw new Error(`createVersion, ${error}`);
      });
    },

    // 根据软件系统ID与资源类别查询软件系统版本列表
    async handleQueryVersionList() {
      const {
        data: { list },
      } = await this.queryVersionList().catch((error) => {
        throw new Error(`handleQueryVersionList, ${error}`);
      });
      this.lopResourceIdList = Array.isArray(list) ? list : [];
    },
    // 根据软件系统ID与资源类别创建资源根节点
    async handleInitSysResources() {
      await this.initSysResources().catch((error) => {
        throw new Error(`handleInitSysResources, ${error}`);
      });
    },
    // 根据软件系统ID与资源类别查询软件系统系统资源列表数据 常错误码10029表示列表中没有根节点
    async handleQueryResourcesList() {
      const {
        data: { data },
      } = await this.queryResourcesList().catch(async (error) => {
        if (`${error}`.indexOf(10029) > -1) {
          await this.handleInitSysResources().catch((error) => {
            throw new Error(`handleQueryResourcesList, ${error}`);
          });
          return await this.queryResourcesList().catch((error) => {
            throw new Error(`handleQueryResourcesList, ${error}`);
          });
        } else {
          throw new Error(`handleQueryResourcesList, ${error}`);
        }
      });
      await this.$refs["checkboxTreeTable"].$refs["table"].reloadData([
        data || {},
      ]);
    },
    // 根据资源标识ID与资源类别查询产品版本资源详情
    async handleQueryVersionDetails() {
      const { data } = await this.queryVersionDetails().catch((error) => {
        throw new Error(`handleQueryVersionDetails, ${error}`);
      });
      await this.$refs["checkboxTreeTable"].$refs["table"].reloadData([
        data || {},
      ]);
    },
    // 根据软件系统ID与版本编码校验版本编码
    async handleCheckVersionCode() {
      await this.checkVersionCode().catch((error) => {
        throw new Error(`handleCheckVersionCode, ${error}`);
      });
    },
    // 根据选中的资源ID、软件系统ID、资源类别、版本编码、版本名称与备注创建产品版本
    async handleCreateVersion() {
      await this.createVersion().catch((error) => {
        throw new Error(`handleCreateVersion, ${error}`);
      });
    },

    // 尺寸调整时改变虚拟表格高度防抖
    resizeThrottler() {
      clearTimeout(this.resizeDebounceTimer);
      this.resizeDebounceTimer = setTimeout(() => {
        this.fullScreenHeight = document.body.offsetHeight - 100;
        this.$refs["checkboxTreeTable"].$refs["table"].doLayout();
      }, 100);
    },

    async onOpenedDialog() {
      window.addEventListener("resize", this.resizeThrottler, false);
      this.resizeThrottler();
      await this.handleQueryVersionList().catch((error) => {
        throw new Error(`onOpenedDialog, ${error}`);
      });
      await this.handleQueryResourcesList().catch((error) => {
        throw new Error(`onOpenedDialog, ${error}`);
      });
      this.$nextTick(() => {
        const [root] =
          this.$refs["checkboxTreeTable"].$refs["table"].getUTreeData();
        const expansionRowList = [root];
        const allRowList =
          this.$refs["checkboxTreeTable"].$refs["table"].getUTreeData();
        allRowList.forEach((item) => {
          if (!expansionRowList.includes(item)) {
            this.$refs["checkboxTreeTable"].$refs["table"].setTreeExpansion(
              item,
              false
            );
          }
        });
      });
    },
    onCloseDialog() {
      window.removeEventListener("resize", this.resizeThrottler, false);
      this.$refs["versionInfoForm"].resetFields();
      this.$emit("update:dialogVisible", false);
    },
    onClosedDialog() {
      this.active = 0;
      this.lopResourceId = null;
    },
    onSelectionChange(data) {
      //树形表格勾选的值
      this.selectedId = Array.isArray(data) ? data.map((item) => item.id) : [];
      // //id去重,获取选中的id数组
      this.selectedId = Array.from(new Set(this.selectedId));
    },
    async onChangeLopResourceId(value) {
      this.selectedId = [];
      await this.$refs["checkboxTreeTable"].$refs["table"].reloadData([]);
      this.loading = true;
      if (value) {
        await this.handleQueryVersionDetails().catch((error) => {
          this.loading = false;
          throw new Error(`onChangeLopResourceId, ${error}`);
        });
        await this.$nextTick();
        this.$refs["checkboxTreeTable"].echoSelection();
      } else {
        await this.handleQueryResourcesList().catch((error) => {
          this.loading = false;
          throw new Error(`onChangeLopResourceId, ${error}`);
        });
      }
      await this.$nextTick();
      const [root] =
        this.$refs["checkboxTreeTable"].$refs["table"].getUTreeData();
      const expansionRowList = [root];
      const allRowList =
        this.$refs["checkboxTreeTable"].$refs["table"].getUTreeData();
      allRowList.forEach((item) => {
        if (!expansionRowList.includes(item)) {
          this.$refs["checkboxTreeTable"].$refs["table"].setTreeExpansion(
            item,
            false
          );
        }
      });
      this.loading = false;
    },
    onClickNextRuleStepButton(formName) {
      // 校验
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (formName === "versionInfoForm") {
            await this.handleCheckVersionCode().catch((error) => {
              throw new Error(`onClickNextRuleStepButton, ${error}`);
            });
            this.active += 1;
          }
        } else {
          return false;
        }
      });
    },
    onClickPreviousStepButton() {
      this.active -= 1;
    },
    //创建产品版本
    async onClickNextAddStepButton() {
      await this.handleCreateVersion().catch((error) => {
        throw new Error(`onClickNextAddStepButton, ${error}`);
      });
      this.active += 1;
      // 触发更新软件系统状态事件
      this.$emit("updateStatus");
    },
    async onClickISeeButton() {
      this.$emit("update:dialogVisible", false);
      this.$emit("clickISeeButton");
    },
  },
};
</script>

<style lang="scss" scoped>
.create-version-dialog {
  .dialog-content {
    height: 400px;
    overflow: auto;

    .version-info-form {
      margin: 0 auto;
      width: 400px;
    }

    .checkbox-tree-table {
      margin: 0 auto;
      width: 700px;

      .revisions-select-wrapper {
        margin-bottom: 8px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
    }

    .success-step {
      text-align: center;
      font-weight: 700;
    }
  }
}
</style>