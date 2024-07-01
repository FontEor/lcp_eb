<template>
  <el-dialog
    class="classification-dialog"
    width="670px"
    title="管理扩展点所属分类"
    :visible="showClassificationDialog"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="dialog__header">
      <p class="header__desc">
        创建扩展点分类，便于使用方在扩展点文档中根据分类快速找到目标扩展点。
      </p>
      <el-tooltip
        v-if="tableData.length >= 50"
        class="item"
        effect="dark"
        content="最多可添加50个分类"
        placement="top"
      >
        <el-button style="color: #7f7f7f" type="text">+ 新增分类</el-button>
      </el-tooltip>
      <el-button v-else type="text" @click="newClassification"
        >+ 新增分类</el-button
      >
    </div>
    <el-table class="dialog__table" :data="tableData" height="350">
      <el-table-column prop="cnName" label="分类名称">
        <template slot-scope="scope">
          <span v-if="!scope.row.editNameState">{{ scope.row.cnName }}</span>
          <el-input v-else v-model.trim="scope.row.cnName"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="enName" label="分类编码">
        <template slot-scope="scope">
          <span v-if="!scope.row.editCodeState">{{ scope.row.enName }}</span>
          <el-input v-else v-model.trim="scope.row.enName"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row, $index }">
          <el-button
            type="text"
            v-if="!row.editNameState"
            @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-button
            type="text"
            class="table__delete"
            @click="handleDelete(row, $index)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关闭</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import openExtensionPoint from "@/api/intranet/softwareSystem/developerResource/openExtensionPoint.js";
import _ from "lodash";

export default {
  name: "ClassificationDialog",
  props: {
    showClassificationDialog: {
      type: Boolean,
      required: true,
    },
    productCode: {
      type: String,
      required: true,
    },
    tableData: {
      type: Array,
      default: [],
    },
    queryTableList: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      type: 3,
    };
  },
  methods: {
    // 关闭弹窗
    handleClose() {
      this.$emit("update:showClassificationDialog", false);
    },
    // 新增
    newClassification() {
      this.tableData.push({
        cnName: "",
        enName: "",
        editNameState: true,
        editCodeState: true,
      });
    },
    // 编辑
    async handleEdit(row) {
      row.editNameState = true;
      row.editCodeState = false;
    },
    // 删除
    async handleDelete(row, index) {
      const { id } = row;
      if (id) {
        // id存在则通过后端接口删除
        await openExtensionPoint.deleteSysGroup(id).catch((error) => {
          throw new Error("handleDelete Error");
        });
        await this.queryTableList();
      } else {
        // id不存在，则前端手动删除当前行数据
        this.tableData.splice(index, 1);
      }
    },
    // 保存
    handleSave: _.debounce(async function () {
      const { productCode, type } = this;
      let groupList = [];
      this.tableData.forEach((item) => {
        groupList.push({
          id: item.id,
          cnName: item.cnName,
          enName: item.enName,
        });
      });
      const data = { productCode, type, groupList };
      await this.saveSysGroup(data).catch((error) => {
        throw new Error("saveSysGroup Error");
      });
      this.handleClose();
    }, 300),
    // 保存接口
    async saveSysGroup(data) {
      await openExtensionPoint.saveSysGroup(data);
    },
  },
};
</script>

<style lang="scss" scoped>
.classification-dialog {
  .dialog__header {
    .header__desc {
      line-height: 32px;
    }
    display: flex;
    justify-content: space-between;
  }
  .dialog__table {
    .table__delete {
      color: #e1251b;
    }
  }
  ::v-deep .el-dialog__body {
    padding: 8px 16px;
  }
}
</style>
