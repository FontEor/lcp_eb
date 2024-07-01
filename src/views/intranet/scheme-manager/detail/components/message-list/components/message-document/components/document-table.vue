<template>
  <div class="document-table">
    <p class="document-table__title">消息体</p>

    <el-table
      v-if="editable"
      :data="editedTableData"
      :hide-empty-img="true"
      row-key="id"
      style="width: 100%"
      class="document-table__edited-table"
    >
      <el-table-column
        v-for="{ label, prop, showOverflowTooltip } in tableColumnList"
        :key="prop"
        :label="label"
        :prop="prop"
        :show-overflow-tooltip="showOverflowTooltip"
      >
        <template #default="{ row, column: { property } }">
          <template v-if="['required'].includes(property)">
            <span>{{ row[property] | formatTableColumnRequiredText }}</span>
          </template>
          <template v-else-if="['exampleValue'].includes(property)">
            <el-form
              :model="row"
              :rules="exampleValueTableColumnFormRules"
              :show-message="false"
              ref="exampleValueTableColumnForm"
            >
              <el-form-item :prop="property" style="margin-bottom: 0">
                <el-input v-model.trim="row[property]" style="width: 100%" />
              </el-form-item>
            </el-form>
          </template>
          <template v-else-if="['descr'].includes(property)">
            <el-form
              :model="row"
              :rules="descriptionTableColumnFormRules"
              :show-message="false"
              ref="descriptionTableColumnForm"
            >
              <el-form-item :prop="property" style="margin-bottom: 0">
                <el-input
                  v-model="row[property]"
                  :rows="1"
                  type="textarea"
                  resize="none"
                  style="width: 100%"
                />
              </el-form-item>
            </el-form>
          </template>
          <template v-else>
            <span>{{ row[property] }}</span>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <el-table
      v-else
      :data="tableData"
      :hide-empty-img="true"
      row-key="id"
      style="width: 100%"
      class="document-table__table"
    >
      <el-table-column
        v-for="{ label, prop,width } in tableColumnList"
        :key="prop"
        :label="label"
        :prop="prop"
        :min-width="width"
      >
        <template #default="{ row, column: { property } }">
          <template v-if="['required'].includes(property)">
            <span>{{ row[property] | formatTableColumnRequiredText }}</span>
          </template>
          <template v-else-if="['descr'].includes(property)">
            <span class="cell__ellipsis" v-html="formatTableColumnDescriptionInnerHtml(row[property])"></span>
          </template>
          <template v-else>
            <span>{{ row[property] }}</span>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "DocumentTable",
  props: {
    editable: { type: Boolean, required: true },
    tableData: { type: Array, required: true },
    editedTableData: { type: Array, required: true },
  },
  data() {
    const validateExampleValue = (rule, value, callback) => {
      value = value || "";
      if (value.length > 50) {
        this.$message.warning("示例值长度至多为 50 个字符");
        callback(new Error("长度至多为 50 个字符"));
      } else {
        callback();
      }
    };
    const validateDescription = (rule, value, callback) => {
      value = value || "";
      if (value.length > 1000) {
        this.$message.warning("描述长度至多为 1000 个字符");
        callback(new Error("长度至多为 1000 个字符"));
      } else {
        callback();
      }
    };

    return {
      tableColumnList: [
        { label: "名称", prop: "name",width:"20%" },
        { label: "类型", prop: "type",width:"20%" },
        { label: "是否必选", prop: "required",width:"5%" },
        { label: "示例值", prop: "exampleValue", showOverflowTooltip: true ,width:"20%"},
        { label: "描述", prop: "descr", width:"35%" },
      ],
      exampleValueTableColumnFormRules: {
        exampleValue: [{ validator: validateExampleValue }],
      },
      descriptionTableColumnFormRules: {
        descr: [{ validator: validateDescription }],
      },
      exampleValueMessageInstance: null,
      descriptionMessageInstance: null,
    };
  },
  filters: {
    formatTableColumnRequiredText(value) {
      const hashMapRequired = new Map().set(0, "否").set(1, "是").set(2,"条件");
      return hashMapRequired.get(value) || "";
    },
  },
  watch: {
    editable: {
      handler(value) {
        if (value) {
          const { tableData } = this;
          const editedTableData = JSON.parse(JSON.stringify(tableData));
          this.$emit("update:editedTableData", editedTableData);
        } else {
          const editedTableData = [];
          this.$emit("update:editedTableData", editedTableData);
        }
      },
    },
  },
  methods: {
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
    async validate() {
      const exampleValueTableColumnFormValidateList = this.$refs[
        "exampleValueTableColumnForm"
      ]
        ? this.$refs["exampleValueTableColumnForm"].length > 0
          ? this.$refs["exampleValueTableColumnForm"].map((item) =>
              item.validate()
            )
          : [this.$refs["exampleValueTableColumnForm"].validate()]
        : [];
      const descriptionTableColumnFormValidateList = this.$refs[
        "descriptionTableColumnForm"
      ]
        ? this.$refs["descriptionTableColumnForm"].length > 0
          ? this.$refs["descriptionTableColumnForm"].map((item) =>
              item.validate()
            )
          : [this.$refs["descriptionTableColumnForm"].validate()]
        : [];
      return await Promise.all([
        ...exampleValueTableColumnFormValidateList,
        ...descriptionTableColumnFormValidateList,
      ]);
    },
  },
};
</script>

<style lang="scss" scoped>
.document-table {
  .document-table__title {
    margin-left: 26px;
    margin-bottom: 16px;
    color: #666;
  }

  // .document-table__table {
  //   .cell__ellipsis {
  //     overflow: hidden;
  //     white-space: nowrap;
  //     text-overflow: ellipsis;
  //   }
  // }
}
</style>
