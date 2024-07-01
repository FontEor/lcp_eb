<template>
  <el-dialog
    class="classification-dialog"
    width="670px"
    title="管理消息所属分类"
    :visible="classificationDialogVisible"
    :close-on-click-modal="false"
    @opened="handleOpen"
    @close="handleClose"
  >
    <div class="dialog__header">
      <p class="header__desc">
        创建消息分类，便于使用方在消息文档中根据分类快速找到目标消息。
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
    <el-table class="dialog__table" :data="tableData" height="350" row-key="id">
      <el-table-column prop="name" label="分类名称">
        <template slot-scope="scope">
          <span v-if="!scope.row.editNameState">{{ scope.row.name }}</span>
          <el-input v-else v-model.trim="scope.row.name"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="code" label="分类编码">
        <template slot-scope="scope">
          <span v-if="!scope.row.editCodeState">{{ scope.row.code }}</span>
          <el-input v-else v-model.trim="scope.row.code"></el-input>
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
          <el-tooltip
            class="item"
            effect="dark"
            content="可拖动排序，前台消息文档分类将按照当前列表分类顺序展示"
            placement="top"
          >
            <span class="operation-icon"></span>
          </el-tooltip>
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
import _ from "lodash";
import Sortable from "sortablejs";
import bizmsg from "@/api/intranet/lcp/bizmsg.js";

export default {
  name: "ClassificationDialog",
  props: {
    classificationDialogVisible: {
      type: Boolean,
      required: true,
    },
    tableData: {
      type: Array,
      default: [],
    },
    getMessageCategoryByUnitId: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    async handleOpen() {
      await this.getMessageCategoryByUnitId();
      this.$nextTick(() => {
        this.initTableDrag();
      });
    },
    //   排序
    initTableDrag() {
      const that = this;
      const tbody = document.querySelector(
        ".dialog__table .el-table__body-wrapper tbody"
      );
      Sortable.create(tbody, {
        handle: ".operation-icon",
        onEnd(event) {
          const { oldIndex, newIndex } = event;
          const tableData = [...that.tableData];
          const currRow = tableData.splice(oldIndex, 1)[0];
          tableData.splice(newIndex, 0, currRow);
          that.$emit("update:tableData", tableData);
        },
        delay: 0,
      });
    },
    // 关闭弹窗
    handleClose() {
      this.$emit("update:classificationDialogVisible", false);
      this.$emit("update:getMessageCategoryByUnitId");
      this.getMessageCategoryByUnitId();
    },
    // 新增，新增列id需要唯一否则拖拽排序会出现混乱
    newClassification() {
      this.tableData.push({
        id: -new Date().getTime(),
        name: "",
        code: "",
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
      if (id && Math.sign(id) !== -1) {
        // id存在则通过后端接口删除
        await bizmsg.deleteMessageCategoryById({ id }).catch((error) => {
          throw new Error("handleDelete deleteMessageCategoryById");
        });
        this.$message.success("操作成功");
        await this.getMessageCategoryByUnitId();
      } else {
        // id不存在，则前端手动删除当前行数据
        this.tableData.splice(index, 1);
      }
    },
    // 保存
    handleSave: _.debounce(async function () {
      let groupList = this.tableData.map((item) => {
        item.id = Math.sign(item.id) === -1 ? null : item.id;
        const { id, name, code } = item;
        const unitId = parseInt(this.$route.params.id);
        return { id, name, code, unitId };
      });
      const unitId = parseInt(this.$route.params.id);
      const data = { unitId, categoryList: groupList };
      await this.saveMessageCategory(data).catch(() => {
        throw new Error("handleSave saveMessageCategory");
      });
      this.$message.success("操作成功");
      this.handleClose();
    }, 300),
    // 保存接口
    async saveMessageCategory(data) {
      return await bizmsg.saveMessageCategory(data);
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
  ::v-deep .cell {
    display: flex;
    align-items: center;
    .operation-icon {
      display: inline-block;
      height: 18px;
      width: 18px;
      margin: 0 20px;
      background: url("~@/assets/drag.svg");
      background-size: 100%;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
::v-deep .sortable-chosen {
  cursor: grabbing;
}
</style>
