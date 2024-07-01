<template>
  <div class="param-table">
    <!-- 非编辑态 -->
    <el-table
      v-show="!editable"
      :data="paramTableData"
      :tree-props="{ children: 'children' }"
      :hide-empty-img="true"
      :default-expand-all="false"
      row-key="id"
      style="width: 100%"
      stripe
    >
      <el-table-column
        v-for="item in paramTableList"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :min-width="item.minWidth"
        :formatter="item.formatter"
        :class-name="item.className"
      >
        <template slot-scope="scope">
          <div
            v-if="item.label === '描述'"
            v-html="formatTableColumnDescriptionInnerHtml(scope.row[item.prop])"
            class="wb-doc-title"
          ></div>
          <div v-else-if="item.label === '是否必填'">
            {{ formatterRequired(scope.row[item.prop]) }}
          </div>
          <div v-else>
            {{ scope.row[item.prop] }}
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑态 -->
    <div v-show="editable" class="param-table__table-wrapper--editable">
      <el-table
        class="table__edit"
        :data="paramTableEditedData"
        :tree-props="{ children: 'children' }"
        :hide-empty-img="true"
        :default-expand-all="false"
        :expand-row-keys="expandRowIdList"
        @expand-change="handleExpandChange"
        row-key="id"
        ref="paramTable"
        style="width: 100%"
        stripe
      >
        <el-table-column
          v-for="item in paramTableList"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :min-width="item.minWidth"
          :class-name="item.className"
        >
          <template
            slot-scope="{ row: { type }, row, column: { property, label } }"
          >
            <template v-if="['name'].includes(property)">
              <el-form :model="row" :rules="paramTableFormRules" ref="form">
                <el-form-item :prop="property">
                  <el-input
                    v-model.trim="row[property]"
                    :placeholder="item.placeholder"
                    style="width: 100%"
                  ></el-input>
                </el-form-item>
              </el-form>
            </template>
            <template v-else-if="['type'].includes(property)">
              <el-form :model="row" :rules="paramTableFormRules" ref="form">
                <el-form-item :prop="property">
                  <el-select
                    :value="row[property]"
                    :placeholder="item.placeholder"
                    filterable
                    clearable
                    allow-create
                    default-first-option
                    style="width: 100%"
                    ref="form-select"
                    @change="
                      (newVal) => handleTypeChange(newVal, row, property)
                    "
                  >
                    <el-option
                      v-for="optionItem in item.optionList"
                      :key="optionItem.value"
                      :label="optionItem.value"
                      :value="optionItem.value"
                      :disabled="optionItem.disabled"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </template>
            <template v-else-if="['required'].includes(property)">
              <el-form :model="row" :rules="paramTableFormRules" ref="form">
                <el-form-item :prop="property">
                  <el-select
                    v-model="row[property]"
                    placeholder="请选择"
                    @change="
                      (newVal) => handleRequiredChange(newVal, row, property)
                    "
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                  <!-- <el-switch
                    v-model="row[property]"
                    size="big"
                    :active-value="(switchValueType === 'String' && '1') || 1"
                    :inactive-value="(switchValueType === 'String' && '0') || 0"
                    active-inner-text="是"
                    inactive-inner-text="否"
                    @change="
                      (newVal) => handleRequiredChange(newVal, row, property)
                    "
                  >
                  </el-switch> -->
                </el-form-item>
              </el-form>
            </template>
            <template v-else-if="['exampleValue'].includes(property)">
              <template v-if="includeParamsTypeList.includes(type)">
                <el-form :model="row" :rules="paramTableFormRules" ref="form">
                  <el-form-item :prop="property">
                    <el-input
                      v-model="row[property]"
                      :placeholder="item.placeholder"
                      :rows="1"
                      resize="none"
                      type="textarea"
                      style="width: 100%"
                    ></el-input>
                  </el-form-item>
                </el-form>
              </template>
            </template>
            <template v-else-if="['remark'].includes(property)">
              <el-form :model="row" :rules="paramTableFormRules" ref="form">
                <el-form-item :prop="property">
                  <InputTextareaDescription
                    v-if="label === '描述'"
                    :value.sync="row[property]"
                    :placeholder="item.placeholder"
                  />
                  <el-input
                    v-else
                    v-model="row[property]"
                    :placeholder="item.placeholder"
                    :rows="1"
                    resize="none"
                    type="textarea"
                    style="width: 100%"
                  ></el-input>
                </el-form-item>
              </el-form>
            </template>
            <template v-else>
              <span>{{ row[property] }}</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column width="90">
          <template slot-scope="{ row: { id, type, parentId, required } }">
            <div class="cell-icon-group">
              <i
                class="el-icon-clear cell__icon"
                @click="handleClickDelete(id, parentId, required)"
              />
              <el-dropdown trigger="click" @command="handleCommandDropdownItem">
                <i class="el-icon-circle-plus cell__icon" />
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :command="{ mode: 'parameter', id, parentId }"
                    >添加参数</el-dropdown-item
                  >
                  <el-tooltip
                    v-if="includeParamsTypeList.includes(type)"
                    effect="dark"
                    content="此参数类型不允许添加子参数"
                    placement="left-end"
                  >
                    <span>
                      <el-dropdown-item
                        :command="{ mode: 'subparameter', id, parentId }"
                        :disabled="true"
                        >添加子参数</el-dropdown-item
                      >
                    </span>
                  </el-tooltip>
                  <el-dropdown-item
                    v-else
                    :command="{ mode: 'subparameter', id, parentId }"
                    >添加子参数</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
              <!-- 一级参数不展示排序按钮 -->
              <span v-if="parentId > 0" class="operation-icon"></span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        v-if="paramTableEditedData.length === 0"
        icon="el-icon-plus"
        style="margin-top: 8px; width: 100%"
        plain
        @click="checkBeforeCreateParam('push', null, -1)"
        >添 加</el-button
      >
    </div>
  </div>
</template>

<script>
import Sortable from "sortablejs";
import InputTextareaDescription from "@/views/intranet/scheme-manager/components/input-textarea-description.vue";

export default {
  name: "ParamTable",
  components: { InputTextareaDescription },
  props: {
    status: {
      type: Number,
      required: true,
    },
    editable: {
      type: Boolean,
      default: true,
    },
    isRequest: {
      type: Boolean,
      default: true,
    },
    paramTableData: {
      type: Array,
      default: () => [],
    },
    paramTableEditedData: {
      type: Array,
      default: () => [],
    },
    switchValueType: {
      type: String,
      default: "String",
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
      expandRowIdList: [],
      expandRowKeyEditedList: [],
      paramTableList: [],
      flatTreeList: [],
      requestParamTableList: [
        {
          prop: "name",
          label: "名称",
          width: "200",
          placeholder: "请输入名称",
          className: "column--name",
        },
        {
          prop: "type",
          label: "类型",
          width: "200",
          placeholder: "请选择类型",
          optionList: [
            { value: "支持自定义输入", disabled: true },
            { value: "java.lang.String" },
            { value: "java.lang.Integer" },
            { value: "java.lang.Long" },
            { value: "java.lang.Float" },
            { value: "java.lang.Double" },
            { value: "java.lang.Boolean" },
            { value: "java.util.Date" },
            { value: "java.math.BigDecimal" },
            { value: "java.lang.Character" },
            { value: "java.lang.Byte" },
            { value: "java.math.BigInteger" },
            { value: "java.sql.Date" },
            { value: "java.time.LocalDate" },
            { value: "java.time.LocalTime" },
            { value: "java.time.LocalDateTime" },
            { value: "java.lang.Object" },
            { value: "java.util.List" },
            { value: "java.util.Set" },
            { value: "java.util.Map" },
          ],
        },
        {
          prop: "required",
          label: "是否必填",
          width: "100",
          formatter: (_, __, cellValue) => {
            const hashMap = { 0: "否", 1: "是", 2: "条件" };
            return hashMap[cellValue] || "";
          },
        },
        {
          prop: "exampleValue",
          label: "示例值",
          width: "140",
        },
        {
          prop: "remark",
          label: "描述",
          minWidth: "200",
          className: "line-feed",
        },
      ],
      responseParamTableList: [
        {
          prop: "name",
          label: "名称",
          width: "200",
          placeholder: "请输入名称",
          className: "column--name",
        },
        {
          prop: "type",
          label: "类型",
          width: "200",
          placeholder: "请选择类型",
          optionList: [
            { value: "支持自定义输入", disabled: true },
            { value: "java.lang.String" },
            { value: "java.lang.Integer" },
            { value: "java.lang.Long" },
            { value: "java.lang.Float" },
            { value: "java.lang.Double" },
            { value: "java.lang.Boolean" },
            { value: "java.util.Date" },
            { value: "java.math.BigDecimal" },
            { value: "java.lang.Character" },
            { value: "java.lang.Byte" },
            { value: "java.math.BigInteger" },
            { value: "java.sql.Date" },
            { value: "java.time.LocalDate" },
            { value: "java.time.LocalTime" },
            { value: "java.time.LocalDateTime" },
            { value: "java.lang.Object" },
            { value: "java.util.List" },
            { value: "java.util.Set" },
            { value: "java.util.Map" },
          ],
        },
        {
          prop: "exampleValue",
          label: "示例值",
          width: "140",
        },
        {
          prop: "remark",
          label: "描述",
          minWidth: "200",
          className: "line-feed",
        },
      ],
      includeParamsTypeList: [
        "java.lang.Character",
        "java.lang.Byte",
        "java.lang.Integer",
        "java.lang.Long",
        "java.lang.Float",
        "java.lang.Double",
        "java.lang.Boolean",
        "java.lang.String",
        "java.math.BigInteger",
        "java.math.BigDecimal",
        "java.util.Date",
        "java.sql.Date",
        "java.time.LocalDate",
        "java.time.LocalTime",
        "java.time.LocalDateTime",
      ],
      paramTableFormRules: {
        name: [
          { required: true, message: "请输入名称" },
          { pattern: /^\S*$/, message: "名称不能包含空格" },
        ],
        type: [
          { required: true, message: "请选择类型", trigger: "change" },
          { pattern: /^\S*$/, message: "类型不能包含空格", trigger: "change" },
        ],
        required: [{ required: true, message: "请选择是否必填" }],
        exampleValue: [
          { pattern: /^[^\n]*$/, message: "示例值不能包含换行符" },
        ],
      },
    };
  },
  watch: {
    isRequest: {
      handler(newValue) {
        this.paramTableList = newValue
          ? this.requestParamTableList
          : this.responseParamTableList;
        this.$emit("update:paramTableData", [...this.paramTableData]);
        this.$emit("update:paramTableEditedData", [
          ...this.paramTableEditedData,
        ]);
      },
      immediate: true,
    },
  },
  created() {
    // 初始化拖拽表格
    this.$nextTick(() => {
      this.initializeTableDrag();
    });
  },
  methods: {
    formatterRequired(value) {
      const hashMap = { 0: "否", 1: "是", 2: "条件" };
      return hashMap[value] || "";
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
    // 记录展开节点，视图更新后展示
    handleExpandChange(row, expanded) {
      if (!expanded) {
        const index = this.expandRowIdList.indexOf(row.id.toString());
        if (index > -1) {
          this.expandRowIdList.splice(index, 1);
        }
        return;
      }
      this.expandRowIdList.push(row.id.toString());
      this.expandRowIdList = Array.from(new Set(this.expandRowIdList));
    },
    // 树形结构铺平为List
    flatTreeData(tree) {
      for (let i in tree) {
        this.flatTreeList.push(tree[i]);
        if (tree[i].children && tree[i].children.length > 0) {
          this.flatTreeData(tree[i].children);
        }
      }
    },
    buildTree(arr, parentId, childrenArray) {
      arr.forEach((item) => {
        if (item.parentId === parentId) {
          item.children = [];
          this.buildTree(arr, item.id, item.children);
          childrenArray.push(item);
        }
      });
    },
    // 数组list转树形结构
    listToTree(list, parentId) {
      const array = [];
      this.buildTree(list, parentId, array);
      return array.length > 0 ? (array.length > 1 ? array : [array[0]]) : [];
    },
    // 拖拽表格排序
    initializeTableDrag() {
      const paramTable = this.$refs.paramTable;
      const el = paramTable.$el.querySelector(
        ".table__edit .el-table__body-wrapper tbody"
      );
      const that = this;
      Sortable.create(el, {
        handle: ".operation-icon",
        sort: true,
        animation: 150,
        setData(dataTransfer) {
          dataTransfer.setData("Text", "");
        },
        onMove(evt, originalEvent) {
          const paramTableEditedData = JSON.parse(
            JSON.stringify(that.paramTableEditedData)
          );
          that.flatTreeList = [];
          that.flatTreeData(paramTableEditedData);
          // 获取拖拽元素index
          const draggedIndex = evt.dragged.rowIndex;
          // 获取交换后目标元素target
          const targetIndex = evt.related.rowIndex;
          const draggedNode = that.flatTreeList[draggedIndex];
          const targetNode = that.flatTreeList[targetIndex];
          if (draggedNode.parentId !== targetNode.parentId) {
            return false;
          } else {
            return true;
          }
        },
        onEnd(evt) {
          //拖拽结束发生该事件
          const { oldIndex, newIndex } = evt;
          if (oldIndex === newIndex) {
            return;
          }
          const currRow = that.flatTreeList.splice(oldIndex, 1)[0];
          that.flatTreeList.splice(newIndex, 0, currRow);
          const listToTreeData = that.listToTree(that.flatTreeList, -1);
          // 解决数据更新，视图不更新问题，强制重新渲染视图
          that.$emit("update:paramTableEditedData", []);
          that.$nextTick(() => {
            that.$emit("update:paramTableEditedData", listToTreeData);
          });
        },
      });
    },
    // 点击删除图标操作，删除一级参数前增加校验提示
    handleClickDelete(id, parentId, required) {
      if (this.status === 4 && this.paramTableData.length > 0) {
        if (parentId === -1) {
          // 一级参数
          this.$confirm(
            "删除一级参数会导致已使用开放API的用户调用失败",
            "是否确认删除参数？",
            {
              confirmButtonText: "删除",
              cancelButtonText: "取消",
              type: "warning",
            }
          )
            .then(() => {
              this.deleteRowTableData(id, this.paramTableEditedData);
            })
            .catch(() => {
              return;
            });
        } else if (+required === 1) {
          // 必填参数
          this.$confirm(
            "删除必填参数会导致已使用开放API的用户调用失败",
            "是否确认删除必填参数？",
            {
              type: "warning",
              confirmButtonText: "删除",
              cancelButtonText: "取消",
            }
          )
            .then(() => {
              this.deleteRowTableData(id, this.paramTableEditedData);
            })
            .catch();
        } else {
          this.deleteRowTableData(id, this.paramTableEditedData);
        }
      } else {
        this.deleteRowTableData(id, this.paramTableEditedData);
      }
    },
    // 删除当前行数据
    deleteRowTableData(targetId, tableData) {
      return tableData.some((item, index, array) => {
        const { id, children } = item;
        return id === targetId
          ? array.splice(index, 1)
          : children && children.length > 0
          ? this.deleteRowTableData(targetId, children)
          : false;
      });
    },
    // 点击添加图标下拉菜单项操作
    handleCommandDropdownItem(command) {
      const { mode, id, parentId } = command;
      this.checkBeforeCreateParam(mode, id, parentId);
    },
    // API已发布过且维护了文档，添加一级参数增加校验
    checkBeforeCreateParam(mode, targetId = null, parentId) {
      if (
        this.status === 4 &&
        this.paramTableData.length > 0 &&
        parentId === -1 &&
        mode !== "subparameter"
      ) {
        this.$confirm(
          "新增一级参数会导致已使用开放API的用户调用失败",
          "是否确认新增参数？",
          {
            confirmButtonText: "添加",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            this.handleClickCreateParam(mode, targetId, parentId);
          })
          .catch(() => {
            return;
          });
      } else {
        this.handleClickCreateParam(mode, targetId, parentId);
      }
    },
    // 点击添加图标或添加按钮操作，添加一行空数据
    handleClickCreateParam(mode, targetId = null, parentId) {
      const id = -new Date().getTime();
      const name = "";
      const type = "";
      const required = "0";
      const exampleValue = "";
      const remark = "";
      const children = [];
      const newRow = {
        id,
        parentId,
        name,
        type,
        required,
        exampleValue,
        remark,
        children,
      };
      const newSubRow = {
        id,
        parentId: targetId,
        name,
        type,
        required,
        exampleValue,
        remark,
        children,
      };
      const modeHashMap = {
        // 添加参数
        parameter: () =>
          this.createParameterRowTableData(
            targetId,
            this.paramTableEditedData,
            newRow
          ),
        // 添加子参数
        subparameter: () =>
          this.createSubparameterRowTableData(
            targetId,
            this.paramTableEditedData,
            newSubRow
          ),
        // 末尾添加
        push: () => this.paramTableEditedData.push(newRow),
      };
      modeHashMap[mode]();
    },
    // 添加参数，在当前行下方添加一行空数据
    createParameterRowTableData(targetId, tableData, newRow) {
      return tableData.some((item, index, array) => {
        const { id, children } = item;
        return id === targetId
          ? array.splice(index + 1, 0, newRow)
          : children && children.length > 0
          ? this.createParameterRowTableData(targetId, children, newRow)
          : false;
      });
    },
    // 添加子参数，在当前行子节点数组末尾添加一行空数据
    createSubparameterRowTableData(targetId, tableData, newRow) {
      return tableData.some((item) => {
        const { id, children } = item;
        const createChildrenItem = () => {
          item.children.push(newRow);
          this.$nextTick(() => {
            this.$refs.paramTable.toggleRowExpansion(item, true);
          });
          return true;
        };
        return id === targetId
          ? createChildrenItem()
          : children && children.length > 0
          ? this.createSubparameterRowTableData(targetId, children, newRow)
          : false;
      });
    },
    // 校验表格中所有表单
    async validateTable() {
      const condition = this.$refs.form && this.$refs.form.length > 0;
      return condition
        ? Promise.all(this.$refs.form.map((item) => item.validate()))
        : true;
    },
    handleRequiredChange(newVal, row, property) {
      if (
        this.status === 4 &&
        this.paramTableData.length > 0 &&
        +newVal === 1 &&
        +row.id > 0
      ) {
        //已发布 && 维护了文档）&& 非新增 的API 将非必填参数改为必填
        this.$confirm(
          "非必填改为必填会导致已使用开放API的用户调用失败",
          "是否确认将此参数从非必填改为必填？",
          {
            type: "warning",
          }
        )
          .then(() => {
            row[property] = newVal;
          })
          .catch(() => {
            row[property] = "0";
          });
      }
    },
    handleTypeChange(newVal, row, property) {
      const preValue = row[property];
      if (this.status === 4 && this.paramTableData.length > 0 && +row.id > 0) {
        // （已发布 && 维护了文档）&& 非新增 的API 修改参数类型，
        this.$confirm(
          "修改参数类型会导致已使用开放API的用户调用失败",
          "是否确认修改此参数的参数类型？",
          {
            type: "warning",
          }
        )
          .then(() => {
            row[property] = newVal;
            this.$refs["form-select"].forEach((dom) => dom.blur());
          })
          .catch(() => {
            row[property] = preValue;
            this.$refs["form-select"].forEach((dom) => dom.blur());
          });
      } else {
        row[property] = newVal;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.param-table {
  .param-table__table-wrapper--editable {
    .el-table {
      ::v-deep .column--name {
        .cell {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
        }
      }
      .cell-icon-group {
        position: absolute;
        bottom: 30px;
      }
      .cell__icon {
        margin-right: 6px;
        font-size: 16px;
        color: #d9d9d9;
        cursor: pointer;
        transition: color 0.1s linear;
        &.el-icon-clear:hover {
          color: #e1251b;
        }
        &.el-icon-circle-plus:hover {
          color: #3c6ef0;
        }
      }
      .operation-icon {
        position: absolute;
        top: 1px;
        display: inline-block;
        height: 18px;
        width: 18px;
        background: url("~@/assets/drag.svg");
        background-size: 100%;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
}
::v-deep .line-feed .cell {
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
