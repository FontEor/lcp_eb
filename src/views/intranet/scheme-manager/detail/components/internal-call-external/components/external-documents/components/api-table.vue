<template>
  <el-table
    :data="tableData"
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    class="api-table"
    style="margin-bottom: 24px"
    row-key="id"
    :row-class-name="tableRowClassName"
    stripe
    default-expand-all
    :hide-empty-img="hideEmptyImg"
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
          <template slot-scope="scope">
            <span
              v-if="
                scope.column.property == 'modify' &&
                scope.row[scope.column.property] == 1
              "
              >删除参数</span
            >
            <span
              v-if="
                scope.column.property == 'modify' &&
                scope.row[scope.column.property] == 2
              "
              >变更参数类型</span
            >
            <span
              v-if="
                scope.column.property == 'modify' &&
                scope.row[scope.column.property] == 3
              "
              >增加参数</span
            >
            <span v-if="scope.column.property != 'modify'">{{
              scope.row[scope.column.property]
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :key="`${item.prop}-${index}`"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :min-width="item.min_width"
          :align="item.align || 'left'"
          v-if="item.modify && item.type == 'input'"
          :show-tooltip-when-overflow="editer"
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
                  v-if="!editer && !scope.row['jugeChildren']"
                  :placeholder="scope.column.label"
                  size="medium"
                  :precision="0"
                  :step="1"
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
                  v-if="!editer && !scope.row['jugeChildren']"
                  :placeholder="scope.column.label"
                  size="medium"
                  :step="0.1"
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
                  v-if="!editer && !scope.row['jugeChildren']"
                  type="datetime"
                  :placeholder="scope.column.label"
                  value-format="yyyy-MM-dd HH:mm:ss"
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
                  v-if="!editer && !scope.row['jugeChildren']"
                  :placeholder="scope.column.label"
                >
                  <el-option :value="true" />
                  <el-option :value="false" />
                </el-select>
              </div>
              <div v-else>
                <el-input
                  v-model.trim="scope.row[scope.column.property]"
                  v-if="!editer && !scope.row['jugeChildren']"
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
            <div v-if="editer">
              <span v-if="scope.row[scope.column.property] === '0'">否</span
              ><span
                style="color: red"
                v-else-if="scope.row[scope.column.property] === '1'"
                >是</span
              >
              <span v-else-if="scope.row[scope.column.property] === '2'"
                >条件</span
              >
            </div>
            <el-select
              v-model="scope.row[scope.column.property]"
              v-if="!editer"
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
          </template>
        </el-table-column>
      </template>
    </slot>
  </el-table>
</template>

<script>
import InputTextareaDescription from "@/views/intranet/scheme-manager/components/input-textarea-description.vue";

export default {
  name: "ApiTable",
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
    showOperation: {
      type: Boolean,
      default: false,
    },
    editer: {
      type: Boolean,
      default: true,
    },
    inputMaxL: 50,
    hideEmptyImg: {
      type: Boolean,
      default: false,
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
  },
};
</script>

<style lang="scss" scoped>
.api-table {
  .wb-doc-title {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
}
</style>
