<template>
  <section class="comparison-table">
    <Title :text="title" />
    <el-table
      :data="tableData"
      :row-class-name="formatTableRowClassName"
      :hide-empty-img="true"
      row-key="id"
      style="width: 100%"
      class="comparison-table__table"
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
            <span :class="formatTableColumnClassName(row, property)">{{
              row[property] | formatTableColumnRequiredText
            }}</span>
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
                ></p>
              </template>
              <div
                v-html="formatTableColumnDescriptionInnerHtml(row[property])"
                :class="formatTableColumnDescriptionClassName(row, property)"
              ></div>
            </el-tooltip>
          </template>
          <template v-else>
            <span :class="formatTableColumnClassName(row, property)">{{
              row[property]
            }}</span>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
import Title from "@/components/Title.vue";

export default {
  name: "ComparisonTable",
  components: { Title },
  props: {
    title: { type: String, default: "" },
    tableData: { type: Array, default: () => [] },
    tableColumnList: { type: Array, required: true },
    hashMapMutationAttributes: { type: Map, required: true },
  },
  filters: {
    formatTableColumnRequiredText(value) {
      const hashMap = new Map().set("0", "否").set("1", "是").set("2", "条件");
      return hashMap.get(value) || "";
    },
  },
  methods: {
    formatTableColumnClassName(row, property) {
      const { hashMapMutationAttributes } = this;
      let { mutationAttributes } = row;
      mutationAttributes = Array.isArray(mutationAttributes)
        ? mutationAttributes
        : [];
      return mutationAttributes.includes(
        hashMapMutationAttributes.get(property) || null
      )
        ? "update-column"
        : "";
    },
    formatTableColumnDescriptionClassName(row, property) {
      const { hashMapMutationAttributes } = this;
      let { mutationAttributes } = row;
      mutationAttributes = Array.isArray(mutationAttributes)
        ? mutationAttributes
        : [];
      return mutationAttributes.includes(
        hashMapMutationAttributes.get(property) || null
      )
        ? "update-column remark-text"
        : "remark-text";
    },
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
      const { status } = row;
      const hashMap = new Map()
        .set(0, "")
        .set(1, "create-row")
        .set(2, "delete-row")
        .set(3, "update-row");
      return hashMap.get(status) || "";
    },
  },
};
</script>

<style lang="scss" scoped>
.comparison-table {
  .title {
    margin-bottom: 8px;
    width: 88px;

    ::v-deep .title__text {
      margin-right: 4px;
      font-size: 14px;
      color: #333;
    }
  }

  .comparison-table__table {
    margin-bottom: 8px;

    .remark-text {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }

    ::v-deep .el-table__row {
      &.create-row {
        color: #26a872;
        background-color: #e9f6f1;
      }

      &.delete-row {
        text-decoration: line-through;
        color: #e1251b;
        background-color: #fce9e8;
      }

      &.update-row {
        background-color: #fdf1e6;

        .update-column {
          color: #ff7700;
        }
      }
    }
  }
}
</style>
