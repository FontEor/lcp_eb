<template>
  <!-- 菜单资源表格 -->
  <u-table
    v-loading="loading"
    class="menu-resource-table"
    ref="menuResourceTable"
    row-id="id"
    :use-virtual="true"
    :tree-config="treeConfig"
    :fixed-columns-roll="true"
    :border="true"
    :stripe="true"
    :beautify-table="true"
    :row-height="57"
    :height="height"
    :header-row-style="{ color: '#666' }"
    :cell-style="{ color: '#333' }"
    :show-header-overflow="true"
    :data-changes-scroll-top="false"
    @table-body-scroll="onTableBodyScroll"
  >
    <!-- 固定字段 -->
    <u-table-column
      v-for="(item, index) in tableList"
      :key="index"
      :tree-node="index === 0"
      :label="item.label"
      :prop="item.prop"
      :min-width="item['min-width']"
      :show-overflow-tooltip="true"
    >
      <template slot-scope="{ row, column }">
        <!-- 类型 -->
        <template v-if="column.property === 'resourceType'">
          <span :class="formatResourceTypeClass(row[column.property])">
            {{ formatResourceTypeText(row[column.property]) }}
          </span>
        </template>
        <template v-else>{{ row[column.property] }}</template>
      </template>
    </u-table-column>

    <!-- 扩展字段 -->
    <u-table-column
      v-for="(item, index) in extensionFieldList"
      :key="item.key"
      :label="item.key"
      :prop="`ext${index + 1}`"
      :show-overflow-tooltip="true"
      :formatter="formatterExtensionField"
      min-width="120"
    >
    </u-table-column>

    <!-- 操作 -->
    <u-table-column label="操作" prop="handle" fixed="right" min-width="180">
      <template slot="header" slot-scope="{ column }">
        <div class="menu-resource-table__handle-header">
          <span>{{ column.label }}</span>
          <i class="el-icon-setting" @click="handleExtensionField"></i>
        </div>
      </template>
      <template slot-scope="{ row }">
        <el-button
          v-if="row.parentId || row.parentId === 0"
          type="text"
          @click="handleAddSubResource(row)"
          >添加子资源</el-button
        >
        <el-button
          v-if="row.parentId && row.parentId !== 0"
          type="text"
          @click="handleEdit(row)"
          >编辑</el-button
        >
        <el-button
          v-if="row.parentId && row.parentId !== 0"
          type="text"
          style="color: #e1251b"
          @click="handleDelete(row)"
          >删除</el-button
        >
      </template>
    </u-table-column>
  </u-table>
</template>

<script>
import menuResource from "@/api/intranet/softwareSystem/systemResource/menuResource.js";

export default {
  name: "MenuResourceTable",
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
    refTable: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    // 查询资源列表
    queryResourcesList: {
      type: Function,
      required: true,
    },
    extensionFieldList: {
      type: Array,
      required: true,
    },
    // 查询系统资源扩展字段配置
    queryConfig: {
      type: Function,
      required: true,
    },
    scrollTop: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      resizeTimeout: null,
      height: 228,
      offsetTop: 350,
      treeConfig: {
        children: "childNodes",
        iconClose: "el-icon-arrow-right",
        iconOpen: "el-icon-arrow-down",
        indent: 10,
      },
      tableList: [
        { label: "资源名称", prop: "resourceName", "min-width": "200" },
        { label: "资源编码", prop: "resourceCode", "min-width": "200" },
        { label: "类型", prop: "resourceType", "min-width": "80" },
        { label: "URL", prop: "resourceUrl", "min-width": "120" },
        { label: "ICON", prop: "icon", "min-width": "120" },
      ],
    };
  },
  methods: {
    // 删除资源节点
    async deleteNode(row) {
      const { category } = this;
      const { id, lopResourceId } = row;
      const data = {
        category,
        id,
        lopResourceId,
      };
      return await menuResource.deleteNode(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("deleteNode");
      });
    },

    // 格式化资源类型类名
    formatResourceTypeClass(resourceType) {
      const resourceTypeClassTable = [
        "normalColor",
        "updateColor",
        "deadColor",
      ];
      return resourceTypeClassTable[resourceType];
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
        const { enumValue } = this.extensionFieldList[extIndex];
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
    // 尺寸调整时改变虚拟表格高度防抖
    resizeThrottler() {
      if (!this.resizeTimeout) {
        this.resizeTimeout = setTimeout(() => {
          this.resizeTimeout = null;
          this.height = document.body.offsetHeight - this.offsetTop;
          this.$refs[this.refTable].doLayout();
        }, 100);
      }
    },

    onTableBodyScroll({ scrollTop, judgeFlse }) {
      this.$emit("update:scrollTop", judgeFlse ? -1 : scrollTop || 0);
    },
    // 配置扩展字段操作
    handleExtensionField() {
      this.$emit("update:handleExtensionField");
    },
    // 添加子资源操作
    handleAddSubResource(row) {
      this.$emit("update:handleAddSubResource", row);
    },
    // 编辑操作
    handleEdit(row) {
      this.$emit("update:handleEdit", row);
    },
    // 删除操作
    handleDelete(row) {
      const h = this.$createElement;
      const title = "删除子资源";
      const message = h("p", null, [
        "删除后，资源将从其所属的版本中一并删除，下次开通版本时将不会包含此资源，但已开通的租户不会受到影响，依然可以使用此资源。",
        h("span", { style: "color: #e1251b" }, "谨慎操作！"),
      ]);
      const customClass = "delete-message-box";
      const type = "warning";
      const showCancelButton = true;
      const confirmButtonText = "确定";
      const cancelButtonText = "取消";
      const option = {
        title,
        message,
        customClass,
        type,
        showCancelButton,
        confirmButtonText,
        cancelButtonText,
      };
      this.$msgbox(option)
        .then(async () => {
          await this.deleteNode(row);
          this.$message.success("删除子资源成功！");
          this.$emit("update:loading", true);
          (async () => {
            const response = await this.queryConfig();
            const { data } = response.data;
            this.$emit("update:extensionFieldList", data);
          })();
          const expansionRowList =
            this.$refs[this.refTable].getTreeExpandRecords();
          const { data } = await this.queryResourcesList();
          await this.$refs[this.refTable].reloadData([data.data]);
          expansionRowList.forEach((item) => {
            this.$refs[this.refTable].setTreeExpansion(item, true);
          });
          this.scrollTop > -1
            ? this.$refs[this.refTable].pagingScrollTopLeft(this.scrollTop, 0)
            : this.$refs[this.refTable].scrollBottom();
          this.$emit("update:loading", false);
        })
        .catch(() => {});
    },
  },
  mounted() {
    // 添加尺寸调整事件监听
    window.addEventListener("resize", this.resizeThrottler, false);
    // 查询资源列表，渲染虚拟表格
    (async () => {
      this.$emit("update:loading", true);
      (async () => {
        const response = await this.queryConfig();
        const { data } = response.data;
        this.$emit("update:extensionFieldList", data);
      })();
      const { data } = await this.queryResourcesList();
      await this.$refs[this.refTable].reloadData([data.data]);
      const [root] = this.$refs[this.refTable].getUTreeData();
      const expansionRowList = [root];
      expansionRowList.forEach((item) => {
        this.$refs[this.refTable].setTreeExpansion(item, true);
      });
      this.height = document.body.offsetHeight - this.offsetTop;
      this.$emit("update:loading", false);
    })();
  },
  beforeDestroy() {
    // 移除尺寸调整事件监听
    window.removeEventListener("resize", this.resizeThrottler, false);
  },
};
</script>

<style lang="scss" scoped>
.menu-resource-table {
  .menu-resource-table__handle-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-icon-setting {
      cursor: pointer;
    }
  }
  ::v-deep .el-table .el-table__header th {
    background-color: #f1f4f9;
  }
  ::v-deep .tree--btn-wrapper {
    color: #666 !important;
    i {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 12px;
    }
  }
}
</style>

<style lang="scss">
// 修改msgbox使用::v-deep未生效
.el-message-box.delete-message-box {
  width: 554px;
}
</style>