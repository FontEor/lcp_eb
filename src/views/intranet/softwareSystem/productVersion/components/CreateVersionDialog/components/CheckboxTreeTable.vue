<template>
  <div class="check-table-tree" :class="{ 'full-screen': fullScreen }">
    <div v-if="fullScreen" style="margin-top: 20px">
      <span style="font-size: 20px; margin-left: 100px">选择版本资源</span>
      <el-button
        size="medium"
        icon="el-icon-full-screen"
        style="float: right; margin-right: 100px"
        class="exit-full-btn"
        @click="onClickToggleFullScreenButton"
        >退出全屏</el-button
      >
      <el-divider></el-divider>
    </div>
    <el-tooltip
      v-if="fullScreen == false"
      effect="dark"
      content="列表全屏展示"
      placement="top"
      class="item"
    >
      <i
        :style="styleTop"
        class="el-icon-full-screen el-icon-right"
        @click="onClickToggleFullScreenButton"
      />
    </el-tooltip>
    <u-table
      :use-virtual="true"
      :height="fullScreen ? fullScreenHeight : noEditHeight"
      :select-on-indeterminate="false"
      :big-data-checkbox="true"
      :tree-config="treeConfig"
      :style="{ 'margin-left': getMarginLeft(), width: getWidth() }"
      row-id="id"
      ref="table"
      :border="true"
      :stripe="true"
      :beautify-table="true"
      :row-height="57"
      :header-row-style="{ color: '#666' }"
      :cell-style="{ color: '#333' }"
      @select="onSelect"
      @select-all="onSelectAll"
      @selection-change="onSelectionChange"
      @toggle-tree-expand="onToggleTreeExpand"
    >
      <u-table-column type="selection" width="55" />
      <u-table-column
        v-for="(item, index) in tableColumnList"
        :key="index"
        :tree-node="index === 0"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="{ row, column }">
          <span
            v-if="column.property === 'resourceType'"
            :class="formatResourceTypeClass(row[column.property])"
          >
            {{ formatResourceTypeText(row[column.property]) }}
          </span>
          <template v-else>{{ row[column.property] }}</template>
        </template>
      </u-table-column>
      <!-- 扩展字段列表 -->
      <u-table-column
        v-for="(item, index) in extendedList"
        :key="index + 'extended'"
        :prop="'ext' + (index + 1)"
        :label="item.key"
        :formatter="formatterExtensionField"
        :show-overflow-tooltip="true"
      />
    </u-table>
  </div>
</template>

<script>
export default {
  name: "CheckboxTreeTable",
  props: {
    fullScreenHeight: {
      type: Number,
      required: true,
    },
    styleTop: {
      type: String,
      default: "top: 184px",
    },
    noEditHeight: {
      type: Number,
      default: 240,
    },
    tableColumnList: {
      type: Array,
      default: [],
    },
    extendedList: {
      type: Array,
      default() {
        return [];
      },
    },
    treeConfig: {
      type: Object,
      default() {
        return {
          children: "childNodes",
          iconClose: "el-icon-arrow-right",
          iconOpen: "el-icon-arrow-down",
          indent: 10,
          expandAll: true,
        };
      },
    },
  },
  data() {
    return {
      fullScreen: false,
      flatChildren: [],
      flatParentList: [],
      selection: [],
    };
  },
  methods: {
    formatResourceTypeClass(resourceType) {
      const resourceTypeClassTable = [
        "normalColor",
        "updateColor",
        "deadColor",
      ];
      return resourceTypeClassTable[resourceType];
    },
    formatResourceTypeText(resourceType) {
      const resourceTypeTextTable = ["菜单", "按钮", "其它"];
      return resourceTypeTextTable[resourceType];
    },
    // 格式化资源类型文本
    formatResourceTypeText(resourceType) {
      const resourceTypeTextTable = ["菜单", "按钮", "其它"];
      return resourceTypeTextTable[resourceType];
    },
    // 格式化扩展字段枚举值
    formatterExtensionField(row, column, cellValue) {
      // 表格中是否包含扩展字段数据
      if (Object.keys(row).includes(column.property)) {
        const extIndex = parseInt(column.property.replace("ext", "")) - 1;
        const { enumValue } = this.extendedList[extIndex];
        if (enumValue) {
          if (enumValue.indexOf(",") > -1) {
            const hashMap = {};
            enumValue.split(",").forEach((item) => {
              const label = item.split(":")[0];
              const value = item.split(":")[1];
              hashMap[value] = label;
            });
            return Object.keys(hashMap).includes(cellValue)
              ? hashMap[cellValue]
              : cellValue;
          } else {
            const label = enumValue.split(":")[0];
            const value = enumValue.split(":")[1];
            return cellValue === value ? label : cellValue;
          }
        }
        return cellValue;
      } else {
        return cellValue;
      }
    },

    getWidth() {
      if (this.fullScreen) {
        return "90%";
      } else {
        return "100%";
      }
    },
    getMarginLeft() {
      if (this.fullScreen) {
        return "100px";
      } else {
        return "0px";
      }
    },
    flattenChildren(row) {
      this.flatChildren.push(row);
      const { children } = this.treeConfig;
      if (Array.isArray(row[children]) && row[children].length > 0) {
        row[children].forEach((child) => {
          this.flattenChildren(child);
        });
      }
    },
    flattenParentList(row, targetId, originTableData) {
      const { children } = this.treeConfig;
      const { id, parentId } = row;
      if (id === targetId) {
        this.flatParentList.push(row);
        if (parentId) {
          this.flattenParentList(originTableData, parentId, originTableData);
        }
        return;
      }
      if (Array.isArray(row[children]) && row[children].length > 0) {
        row[children].forEach((child) => {
          this.flattenParentList(child, targetId, originTableData);
        });
      }
    },
    echoSelection() {
      const [root] = this.$refs.table.getUTreeData();
      this.flatChildren = [];
      this.flattenChildren(root);
      const selected = true;
      this.selection = [];
      this.flatChildren.forEach((row) => {
        const { isPick } = row;
        if (isPick) {
          this.$refs.table.toggleRowSelection([{ row, selected }]);
          this.selection.push(row);
        }
      });
      this.flatParentList = [];
    },

    onClickToggleFullScreenButton() {
      this.fullScreen = !this.fullScreen;
      this.$nextTick(() => {
        this.$refs.table.doLayout();
      });
    },
    onSelectionChange(value) {
      //对外提供可勾选树形表格组件选中节点方法
      value = this.$refs.table.getCheckboxRecords();
      this.$emit("selectionChange", value);
    },
    onSelect(selection, row) {
      //判断当前行是选中还是取消勾选
      const selected = selection.some((item) => item === row);
      // // 处理所有子级以及父级节点逻辑
      // // 勾选子节点，父节点也会被勾选
      // // 勾选父节点时，子节点会被全部选中
      // // 取消勾选父节点时，子节点也会被取消勾选
      // // 取消所有子节点时，父节点可以单独勾选
      row = this.$refs.table.getUTreeData().find((item) => item.id === row.id);
      this.flatChildren = [];
      this.flattenChildren(row);
      this.flatChildren.forEach((row) => {
        this.$refs.table.toggleRowSelection([{ row, selected }]);
      });
      this.flatParentList = [];
      if (selected) {
        const [root] = this.$refs.table.getUTreeData();
        const { parentId } = row;
        this.flattenParentList(root, parentId, root);
        this.flatParentList.forEach((row) => {
          this.$refs.table.toggleRowSelection([{ row, selected }]);
        });
        this.selection = Array.from(
          new Set([
            ...this.selection,
            ...this.flatChildren,
            ...this.flatParentList,
          ])
        );
      } else {
        this.selection = this.selection.filter((item) => {
          return !this.flatChildren.includes(item);
        });
      }
    },
    onSelectAll(selection) {
      //全选以及全不选
      //当最外层节点有一个节点被勾选，则全不选，否则全选
      const [root] = this.$refs.table.getUTreeData();
      if (Array.isArray(selection) && selection.length > 0) {
        this.onSelect([root], root);
      } else {
        this.onSelect([], root);
      }
    },
    onToggleTreeExpand() {
      const { selection } = this;
      const rows = selection;
      const selected = true;
      rows.forEach((row) => {
        this.$refs.table.toggleRowSelection([{ row, selected }]);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-table--border th:first-child .cell {
  padding-left: 6px;
}
.full-screen {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  z-index: 999;
  height: 100% !important;
  width: 100%;
}

.el-icon-full-screen.el-icon-right {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  right: 64px;
  // top: 230px;
  width: 35px;
  height: 30px;
  border-radius: 10% 60% 60% 10%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  cursor: pointer;
}
</style>