<template>
  <el-table
    :data="tableData"
    class="my-table mb2 tree-table"
    style="margin-bottom: 22px"
    row-key="id"
    :row-class-name="tableRowClassName"
    stripe
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
  >
    <slot name="customColumn">
      <template v-for="(item, index) of tableColumnInfo">
        <el-table-column
          :key="`${item.prop}-${index}`"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :min-width="item.min_width"
          :align="item.align || 'left'"
          v-if="!item.modify"
          :show-tooltip-when-overflow="editer"
        >
        </el-table-column>
        <el-table-column
          :key="`${item.prop}-${index}`"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :min-width="item.min_width"
          :align="item.align || 'left'"
          v-if="item.modify && item.type == 'input'"
        >
          <template slot-scope="scope">
            <div v-if="scope.column.property == 'exampleValue'">
              <div
                v-if="
                  scope.row['oldtype'] == 'Long' ||
                  scope.row['type'] == 'long' ||
                  scope.row['oldtype'] == 'Integer' ||
                  scope.row['type'] == 'int' ||
                  scope.row['type'] == 'java.math.BigInteger'
                "
              >
                <el-input-number
                  v-model="scope.row[scope.column.property]"
                  v-if="!editer && !scope.row['juageChildren']"
                  :placeholder="scope.column.label"
                  size="medium"
                  :precision="0"
                  :step="1"
                  style="width: 100%"
                ></el-input-number>
              </div>
              <div
                v-else-if="
                  scope.row['oldtype'] == 'Double' ||
                  scope.row['type'] == 'double' ||
                  scope.row['oldtype'] == 'Float' ||
                  scope.row['type'] == 'float' ||
                  scope.row['type'] == 'java.math.BigDecimal'
                "
              >
                <el-input-number
                  v-model="scope.row[scope.column.property]"
                  v-if="!editer && !scope.row['juageChildren']"
                  :placeholder="scope.column.label"
                  size="medium"
                  :step="0.1"
                  style="width: 100%"
                ></el-input-number>
              </div>
              <div
                v-else-if="
                  scope.row['type'] == 'java.util.Date' ||
                  scope.row['type'] == 'java.sql.Timestamp'
                "
              >
                <el-date-picker
                  v-model="scope.row[scope.column.property]"
                  v-if="!editer && !scope.row['juageChildren']"
                  type="datetime"
                  :placeholder="scope.column.label"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width: 100%"
                ></el-date-picker>
              </div>
              <div
                v-else-if="
                  scope.row['type'] == 'java.lang.Boolean' ||
                  scope.row['type'] == 'boolean'
                "
              >
                <el-select
                  v-model="scope.row[scope.column.property]"
                  v-if="!editer && !scope.row['juageChildren']"
                  :placeholder="scope.column.label"
                >
                  <el-option :value="'true'" />
                  <el-option :value="'false'" />
                </el-select>
              </div>
              <div v-else>
                <el-input
                  v-model.trim="scope.row[scope.column.property]"
                  v-if="!editer && !scope.row['juageChildren']"
                  maxlength="100"
                  :placeholder="scope.column.label"
                ></el-input>
              </div>
            </div>
            <div v-else>
              <el-input
                v-model.trim="scope.row[scope.column.property]"
                v-if="!editer"
                maxlength="100"
                :placeholder="scope.column.label"
              ></el-input>
            </div>
            <div v-if="editer">{{ scope.row[scope.column.property] }}</div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="item.modify && item.type == 'textarea'"
          :key="`${item.prop}-${index}`"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :min-width="item.min_width"
          :align="item.align || 'left'"
        >
          <template #default="{ row, column: { property, label } }">
            <template v-if="editer">
              <el-tooltip
                :disabled="
                  judgeTableColumnDescriptionToolTipDisable(row[property])
                "
                effect="dark"
                placement="top"
              >
                <template #content>
                  <p
                    v-html="
                      formatTableColumnDescriptionInnerHtml(row[property])
                    "
                    style="
                       {
                        width: 480px;
                        max-height: 160px;
                        overflow: auto;
                        white-space: pre-wrap;
                        word-break: break-all;
                      }
                    "
                  ></p>
                </template>
                <div
                  v-html="formatTableColumnDescriptionInnerHtml(row[property])"
                  class="wb-doc-title"
                ></div>
              </el-tooltip>
            </template>
            <template v-else>
              <InputTextareaDescription
                v-if="label === '描述'"
                :value.sync="row[property]"
                :placeholder="label"
              />
              <el-input
                v-else
                v-model="row[property]"
                type="textarea"
                :rows="1"
                :placeholder="
                  label === '错误消息' ? '错误消息，长度不超过255' : label
                "
                resize="none"
                maxlength="255"
              ></el-input>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          :key="`${item.prop}-${index}`"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :min-width="item.min_width"
          :align="item.align || 'left'"
          v-if="item.modify && item.type == 'select'"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row[scope.column.property]"
              v-if="!editer && scope.row['enableEdit'] == '1'"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <div v-if="!editer && scope.row['enableEdit'] == '0'">
              <span v-if="scope.row[scope.column.property] === '0'">否</span>
              <span v-if="scope.row[scope.column.property] === '1'">是</span>
              <span v-if="scope.row[scope.column.property] === '2'">条件</span>
            </div>
            <div v-if="editer && scope.row['enableEdit'] == '0'">
              <span v-if="scope.row[scope.column.property] === '0'">否</span>
              <span v-if="scope.row[scope.column.property] === '1'">是</span>
              <span v-if="scope.row[scope.column.property] === '2'">条件</span>
            </div>
            <div v-if="editer && scope.row['enableEdit'] == '1'">
              <span v-if="scope.row[scope.column.property] === '0'">否</span>
              <span
                v-if="scope.row[scope.column.property] === '1'"
                :style="{ color: selcolor }"
                >是</span
              >
              <span v-if="scope.row[scope.column.property] === '2'">条件</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :key="`${item.prop}-${index}`"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :min-width="item.min_width"
          :align="item.align || 'left'"
          v-if="item.modify && item.type === 'button' && !editer"
        >
          <template slot-scope="scope">
            <el-popover
              placement="top"
              width="200"
              trigger="hover"
              content="源接口文档中该字段必填，不允许操作"
              :disabled="scope.row['enableEdit'] === 1"
            >
              <el-switch
                slot="reference"
                v-model="scope.row['visible']"
                :active-value="1"
                :inactive-value="0"
                @change="changeVisible(scope.row)"
                :disabled="scope.row['enableEdit'] === 0"
              ></el-switch>
            </el-popover>
          </template>
        </el-table-column>
      </template>
    </slot>
  </el-table>
</template>

<script>
import InputTextareaDescription from "@/views/intranet/scheme-manager/components/input-textarea-description.vue";

export default {
  name: "TreeTable",
  components: { InputTextareaDescription },
  props: {
    tableColumnInfo: {
      type: Array,
      default: [],
    },
    tableData: {
      type: Array,
      default: [],
    },
    treeNodeList: {
      type: Array,
      default: () => [],
    },
    editer: {
      type: Boolean,
      default: true,
    },
    selcolor: {
      type: String,
      default: "red",
    },
  },
  data() {
    return {
      options: [
        {
          value: "0",
          label: "否",
        },
        {
          value: "1",
          label: "是",
        },
        {
          value: "2",
          label: "条件",
        },
      ],
    };
  },
  methods: {
    judgeTableColumnDescriptionToolTipDisable(value) {
      value = value || "";
      value = value.replace(/<a data-selection="[^"]+">|<\/a>/g, "");
      return !(value && value.length > 10);
    },
    formatTableColumnDescriptionInnerHtml(value) {
      value = value || "";
      value = value
        .split("\n")
        .map((item) =>
          item
            ? `<div>${item
                .replace(/\s/g, "&nbsp;")
                .replace(
                  /<a&nbsp;data-selection/g,
                  `<a class="remark-anchor" target='__blank' href`
                )}</div>`
            : "<div><br></div>"
        )
        .join("");
      return value;
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.modify) {
        if (row.modify == 1) {
          //删除
          return "api_update_del";
        } else if (row.modify == 2) {
          //修改
          return "api_update_modify";
        } else if (row.modify == 3) {
          //添加
          return "api_update_add";
        }
      }
      return "";
    },

    //更新数据操作
    changeTreeElement(treeNodeList, id, updateList) {
      if (!treeNodeList || !treeNodeList.length) {
        return;
      }
      for (let i = 0; i < treeNodeList.length; i++) {
        if (treeNodeList[i].id === id) {
          treeNodeList.splice(i, 1, updateList);
        } else {
          this.changeTreeElement(treeNodeList[i].children, id, updateList);
        }
      }
      //子组件传值通知更新父组件
    },

    diaplayParentNode(treeNodeList, parentId, originNodeList) {
      if (!treeNodeList || !treeNodeList.length) {
        return;
      }
      for (let i = 0; i < treeNodeList.length; i++) {
        if (treeNodeList[i].id === parentId) {
          treeNodeList[i].visible = 1;
          this.diaplayParentNode(
            originNodeList,
            treeNodeList[i].parentId,
            originNodeList
          );
        }
        if (treeNodeList[i].children) {
          this.diaplayParentNode(
            treeNodeList[i].children,
            parentId,
            originNodeList
          );
        }
      }
    },

    changeVisible(row) {
      const id = row.id;
      const parentId = row.parentId;
      const newRow = JSON.parse(`[${JSON.stringify(row)}]`);
      if (row.visible === 1) {
        console.log("visible变为1，显示");
        //对子节点做处理，都显示
        this.displayNode(newRow);
        this.changeTreeElement(this.treeNodeList, id, ...newRow);
        //子节点显示，父节点也显示
        this.diaplayParentNode(this.treeNodeList, parentId, this.treeNodeList);
      } else {
        console.log("visible变为0，隐藏");
        this.hideNode(newRow);
        this.changeTreeElement(this.treeNodeList, id, ...newRow);
      }
      this.$emit("changeUpdateStatus", row);
    },

    hideNode(row) {
      if (!row || !row.length) {
        return;
      }
      for (let i = 0; i < row.length; i++) {
        if (row[i].visible === 1) {
          row[i].visible = 0;
        }
        if (row[i].children && row[i].children.length > 0) {
          this.hideNode(row[i].children);
        }
      }
    },

    displayNode(row) {
      const id = row.id;
      if (!row || !row.length) {
        return;
      }
      for (let i = 0; i < row.length; i++) {
        if (row[i].visible === 0) {
          row[i].visible = 1;
        }
        if (row[i].children && row[i].children.length > 0) {
          this.displayNode(row[i].children);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.tree-table {
  .wb-doc-title {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  // 设置是否对外显示开关颜色时，若使用组件属性会有默认颜色闪烁，故使用样式穿透
  ::v-deep .el-switch.is-checked .el-switch__core {
    border-color: #13ce66;
    background-color: #13ce66;
  }
}
</style>
