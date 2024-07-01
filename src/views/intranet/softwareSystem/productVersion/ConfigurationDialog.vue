<template>
  <el-dialog
    :visible.sync="showConfigurationDialog"
    :title="title"
    :close-on-click-modal="false"
    :before-close="handleClose"
    width="900px"
    top="5vh"
    @close="handleClose"
  >
    <!-- 对话框内容区 -->
    <div class="dialog-wrapper">
      <!-- 查询条件 -->
      <el-form :inline="true" :model="queryForm">
        <el-form-item>
          <el-select
            v-model="queryForm.productSysGroupId"
            placeholder="请选择分类"
          >
            <el-option
              v-for="item in classificationOptions"
              :key="item.id"
              :label="item.cnName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
          <el-input
            style="width: 300px"
            v-model="queryForm.keyWords"
            placeholder="请输入编码/名称/描述以搜索"
          ></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-button
            type="primary"
            @click="queryOpenApiList"
            icon="el-icon-search"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
      <!-- 表格内容 -->
      <el-table
        ref="multipleTable"
        v-loading="loading"
        element-loading-background="#ffffff"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <template v-for="(item, key) in tableCloumnList">
          <el-table-column
            :key="key"
            :prop="item.prop"
            :label="item.label"
            show-overflow-tooltip
          >
          </el-table-column>
        </template>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelConfiguration">取 消</el-button>
      <el-button type="primary" @click="saveConfigurationData">保 存</el-button>
    </span>
  </el-dialog>
</template>


<script>
import productVersionApi from "@/api/intranet/softwareSystem/productVersion/index.js";

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    showConfigurationDialog: {
      type: Boolean,
      required: true,
    },
    configureType: {
      type: Number,
      required: true,
    },
    productInfo: {
      type: Object,
      required: true,
    },
    associateIdList: {
      type: Array,
      required: true,
    },
    currentRow: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      queryForm: {
        productSysGroupId: null,
      },
      tableCloumnList: [],
      tableData: [],
      classificationOptions: [],
      rids: [],
      multipleSelection: [],
      loading: true,
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleClose() {
      this.$emit("update:showConfigurationDialog", false);
    },
    cancelConfiguration() {
      this.$emit("update:showConfigurationDialog", false);
    },
    async saveConfigurationData() {
      this.rids = [];
      this.multipleSelection.forEach((item) => {
        this.rids.push(item.id);
      });
      //id去重,获取选中的id数组
      this.rids = Array.from(new Set(this.rids));
      const rids = this.rids;
      const sysVersionRefType = this.configureType;
      const versionId = this.currentRow.id;
      const productCode = this.productInfo.code;
      const data = { rids, sysVersionRefType, versionId, productCode };
      const response = await productVersionApi.packageSysVersion(data);
      if (response) {
        this.$message.success("保存成功");
        this.$emit("update:showConfigurationDialog", false);
        // 触发更新软件系统状态事件
        this.$emit("updateStatus");
      }
    },
    //查询分类
    async queryProductSysgroupList() {
      const productCode = this.productInfo.code;
      const type = this.configureType;
      const data = { productCode, type };
      const response = await productVersionApi.queryProductSysgroupList(data);
      this.classificationOptions = response.data;
    },
    //查询配置API列表数据
    async queryOpenApiList() {
      this.loading = true;
      const productCode = this.productInfo.code;
      const productSysGroupId = this.queryForm.productSysGroupId;
      const pageNumb = 1;
      const pageSize = 1000;
      const data = { productCode, productSysGroupId, pageNumb, pageSize };
      const response = await productVersionApi.queryOpenApiList(data);
      this.tableData = response.data.list;
      if (this.associateIdList) {
        this.echoSelection();
      } else {
        this.$refs.multipleTable.clearSelection();
        this.loading = false;
      }
    },

    //查询配置扩展点列表数据
    async querySpiList() {
      this.loading = true;
      const productCode = this.productInfo.code;
      const productSysGroupId = this.queryForm.productSysGroupId;
      const pageNumb = 1;
      const pageSize = 1000;
      const data = { productCode, productSysGroupId, pageNumb, pageSize };
      const response = await productVersionApi.querySpiList(data);
      this.tableData = response.data.list;
      if (this.associateIdList) {
        this.echoSelection();
      } else {
        this.$refs.multipleTable.clearSelection();
        this.loading = false;
      }
    },

    //回显选中节点
    echoSelection() {
      this.tableData.forEach((item) => {
        this.associateIdList.forEach((val) => {
          if (item.id === val) {
            this.$nextTick(() => {
              this.$refs.multipleTable.toggleRowSelection(item, true);
            });
          }
        });
      });
      this.loading = false;
    },
  },
  watch: {
    showConfigurationDialog(val) {
      if (val) {
        const columnList = [
          [],
          [],
          [
            { label: "接口名称", prop: "methodName" },
            { label: "中文名称", prop: "cnName" },
            { label: "接口描述", prop: "remark" },
            { label: "别名", prop: "alias" },
            { label: "所属分类", prop: "productSysGroupCnName" },
          ],
          [
            { label: "所属分类", prop: "productSysGroupCnName" },
            { label: "中文名称", prop: "cnName" },
            { label: "触发场景", prop: "docJssKey" },
            { label: "URL", prop: "uri" },
          ],
          [
            { label: "TOPIC", prop: "" },
            { label: "消息名称", prop: "" },
            { label: "描述", prop: "" },
            { label: "所属分类", prop: "" },
          ],
        ];
        this.tableCloumnList = columnList[this.configureType];
        if (this.configureType === 2) {
          this.queryOpenApiList();
        } else if (this.configureType === 3) {
          this.querySpiList();
        }
        this.queryProductSysgroupList();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-wrapper {
  height: 400px;
  overflow: auto;
}
</style> 
