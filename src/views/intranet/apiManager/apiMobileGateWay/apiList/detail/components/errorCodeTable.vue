<template>
  <div class="error-code-table">
    <!-- 非编辑态 -->
    <el-table
      v-show="!editable"
      :data="errorCodeTableData"
      :hide-empty-img="true"
      style="width: 100%"
      stripe
    >
      <el-table-column
        v-for="item in errorCodeTableList"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :min-width="item.minWidth"
        :show-overflow-tooltip="true"
        :class-name="item.className"
      />
    </el-table>

    <!-- 编辑态 -->
    <div v-show="editable" class="error-code-table__table-wrapper--editable">
      <el-table
        :data="errorCodeTableEditedData"
        :hide-empty-img="true"
        style="width: 100%"
        stripe
      >
        <el-table-column
          v-for="item in errorCodeTableList"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :min-width="item.minWidth"
        >
          <template slot-scope="{ row, column: { property } }">
            <template
              v-if="['errorCode', 'errorMsg', 'solution'].includes(property)"
            >
              <el-form :model="row" :rules="errorCodeTableFormRules" ref="form">
                <el-form-item v-if="property === 'errorCode'" :prop="property">
                  <el-input
                    v-model="row[property]"
                    :placeholder="item.placeholder"
                    style="width: 100%"
                  ></el-input>
                </el-form-item>
                <el-form-item v-else :prop="property">
                  <el-input
                    v-model="row[property]"
                    type="textarea"
                    :rows="1"
                    :placeholder="item.placeholder"
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
        <el-table-column width="80">
          <template slot-scope="{ $index }">
            <i
              class="el-icon-clear cell__icon"
              @click="handleClickDelete($index)"
            />
            <i
              class="el-icon-circle-plus cell__icon"
              @click="handleClickCreate($index + 1)"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-button
        v-if="errorCodeTableEditedData.length === 0"
        icon="el-icon-plus"
        style="margin-top: 8px; width: 100%"
        plain
        @click="handleClickCreate(errorCodeTableEditedData.length)"
        >添 加</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "ErrorCodeTable",
  props: {
    editable: {
      type: Boolean,
      default: true,
    },
    errorCodeTableData: {
      type: Array,
      default: () => [],
    },
    errorCodeTableEditedData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      errorCodeTableList: [
        {
          prop: "errorCode",
          label: "错误码",
          width: "200",
          placeholder: "请输入错误码",
        },
        {
          prop: "errorMsg",
          label: "错误消息",
          minWidth: "200",
          placeholder: "请输入错误消息",
          className: 'line-feed'
        },
        {
          prop: "solution",
          label: "处理建议",
          minWidth: "200",
          placeholder: "请输入处理建议",
        },
      ],
      errorCodeTableFormRules: {
        errorCode: [
          { required: true, message: "请输入错误码" },
          {
            min: 1,
            max: 10,
            message: "请输入 1 到 10 个字符",
          },
        ],
        errorMsg: [
          { required: true, message: "请输入错误消息" },
          {
            min: 2,
            max: 200,
            message: "请输入 2 到 200 个字符",
          },
        ],
        solution: [
          {
            min: 0,
            max: 200,
            message: "请输入 0 到 200 个字符",
          },
        ],
      },
    };
  },
  methods: {
    // 点击删除图标操作，删除当前行数据
    handleClickDelete(index) {
      this.errorCodeTableEditedData.splice(index, 1);
    },
    // 点击添加图标或添加按钮操作，在当前行后添加一行空数据
    handleClickCreate(index) {
      const errorCode = "";
      const errorMsg = "";
      const solution = "";
      const id = -new Date().getTime();
      const row = { errorCode, errorMsg, solution, id };
      this.errorCodeTableEditedData.splice(index, 0, row);
    },
    // 校验表格中所有表单
    async validateTable() {
      const condition = this.$refs.form && this.$refs.form.length > 0;
      return condition
        ? Promise.all(this.$refs.form.map((item) => item.validate()))
        : true;
    },
  },
};
</script>

<style lang="scss" scoped>
.error-code-table {
  .error-code-table__table-wrapper--editable {
    .el-table {
      .cell__icon {
        margin-right: 8px;
        margin-bottom: 22px;
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
    }
  }
}
::v-deep .line-feed .cell{
  white-space: pre-wrap;
  word-break: break-all
}
</style>
