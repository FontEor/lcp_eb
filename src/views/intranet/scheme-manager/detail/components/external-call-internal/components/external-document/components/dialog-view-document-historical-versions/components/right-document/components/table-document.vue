<template>
  <section class="table-document">
    <p class="table-document__title">{{ title }}</p>
    <el-table
      :data="tableData"
      :row-class-name="formatTableRowClassName"
      :hide-empty-img="true"
      :stripe="true"
      row-key="id"
      style="width: 100%"
      class="table-document__table"
    >
      <el-table-column
        v-for="{ label, prop, width, showOverflowTooltip } in tableColumnList"
        :key="label"
        :label="label"
        :prop="prop"
        :width="width"
        :show-overflow-tooltip="showOverflowTooltip"
      >
        <template #default="{ row, column: { property, label } }">
          <template v-if="['required'].includes(property)">
            <span>{{ row[property] | formatTableColumnRequiredText }}</span>
          </template>
          <template v-else-if="label === '描述'">
            <el-tooltip
              :disabled="
                judgeTableColumnDescriptionToolTipDisable(row[property])
              "
              effect="dark"
              placement="top"
            >
              <template #content>
                <p
                  v-html="formatTableColumnDescriptionInnerHtml(row[property])"
                  style="
                     {
                      width: 480px;
                      max-height: 160px;
                      overflow: auto;
                      white-space: pre-wrap;
                      word-break: break-all;
                    }
                  "
                >
                  {{ row[property] }}
                </p>
              </template>
              <div
                v-html="formatTableColumnDescriptionInnerHtml(row[property])"
                class="remark-text"
              ></div>
            </el-tooltip>
          </template>
          <template v-else>
            <span>{{ row[property] }}</span>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
export default {
  name: "TableDocument",
  props: {
    title: { type: String, default: "" },
    tableData: { type: Array, default: () => [] },
    tableColumnList: { type: Array, required: true },
  },
  filters: {
    formatTableColumnRequiredText(value) {
      const hashMap = new Map().set("0", "否").set("1", "是").set("2", "条件");
      return hashMap.get(value) || "";
    },
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
    formatTableRowClassName({ row }) {
      const { visible } = row;
      const hashMap = new Map().set(0, "hidden-row").set(1, "");
      return hashMap.get(visible) || "";
    },
  },
};
</script>

<style lang="scss" scoped>
.table-document {
  margin-bottom: 16px;

  .table-document__title {
    margin-bottom: 16px;
    font-weight: 600;
    color: #666;
  }

  .table-document__table {
    .remark-text {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }

    ::v-deep .el-table__row {
      &.hidden-row {
        color: #999;
      }
    }
  }
}
</style>
