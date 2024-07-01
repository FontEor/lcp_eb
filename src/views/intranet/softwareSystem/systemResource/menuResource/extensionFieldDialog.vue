<template>
  <!-- 扩展字段配置对话框 -->
  <el-dialog
    class="extension-field-dialog"
    title="扩展字段"
    width="900px"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @open="openDialog"
    @close="closeDialog"
  >
    <div class="content-wrapper">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column
          type="index"
          label="字段序号"
          width="80"
          align="center"
        >
        </el-table-column>
        <el-table-column
          v-for="(item, index) in tableList"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          align="center"
        >
          <template slot-scope="{ row, column, $index }">
            <template v-if="column.property === 'required'">
              <el-checkbox
                v-model="tableData[$index].required"
                :true-label="1"
                :false-label="0"
              ></el-checkbox>
            </template>
            <template v-else-if="column.property === 'key'">
              <el-input v-model.trim="tableData[$index].key"></el-input>
            </template>
            <template v-else-if="column.property === 'enumerable'">
              <el-checkbox
                v-model="tableData[$index].enumerable"
                @change="($event) => changeEnumerable($event, row)"
              ></el-checkbox>
            </template>
            <template v-else-if="column.property === 'enumValue'">
              <el-input
                v-model.trim="tableData[$index].enumValue"
                placeholder="显示值:存储值（多个枚举值请用英文逗号隔开）"
                :disabled="!tableData[$index].enumerable"
                @input="($event) => inputEnumValue($event, row)"
              ></el-input>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitExtensionFieldData"
        >保 存</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import menuResource from "@/api/intranet/softwareSystem/systemResource/menuResource.js";
import regExp from "@/constants/regExp.js";

export default {
  name: "ExtensionFieldDialog",
  props: {
    category: {
      type: String,
      required: true,
    },
    extensionFieldDialogVisible: {
      type: Boolean,
      required: true,
    },
    // 查询系统资源扩展字段配置
    queryConfig: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      productId: this.$route.params.id,
      dialogVisible: false,
      tableData: Array.from({ length: 18 }, () => ({
        required: 0,
        key: "",
        enumerable: false,
        enumValue: "",
      })),
      tableList: [
        {
          prop: "required",
          label: "是否必填",
          width: 80,
        },
        {
          prop: "key",
          label: "字段名称",
          width: 240,
        },
        {
          prop: "enumerable",
          label: "是否枚举类型",
          width: 120,
        },
        {
          prop: "enumValue",
          label: "枚举值",
        },
      ],
    };
  },
  watch: {
    extensionFieldDialogVisible: {
      handler(newValue) {
        this.dialogVisible = newValue;
      },
    },
  },
  methods: {
    // 保存系统资源扩展字段配置
    async saveConfig(configs) {
      const { category, productId } = this;
      const data = { category, productId, configs };
      return await menuResource.saveConfig(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("saveConfig");
      });
    },

    // 打开对话框时，初始化扩展字段
    async openDialog() {
      const response = await this.queryConfig();
      const { data } = response.data;
      if (data && data.length > 0) {
        this.initConfig(data);
      }
    },
    // 关闭对话框时，还原表格数据
    closeDialog() {
      this.tableData = Array.from({ length: 18 }, () => ({
        required: 0,
        key: "",
        enumerable: false,
        enumValue: "",
      }));
      this.$emit("update:extensionFieldDialogVisible", false);
    },
    // 改变是否枚举类型值时，枚举类型为否，清除已填写枚举值内容
    changeEnumerable(enumerable, row) {
      if (!enumerable) {
        row.enumValue = "";
      }
    },
    // 输入枚举值时，去除空格
    inputEnumValue(enumValue, row) {
      row.enumValue = enumValue.replaceAll(" ", "");
    },

    // 初始化扩展字段配置
    initConfig(data) {
      const initializedData = data.map((item) => {
        const { required, key, enumValue } = item;
        return {
          required,
          key,
          enumValue,
          enumerable: Boolean(item.enumValue),
        };
      });
      this.tableData.splice(0, initializedData.length);
      this.tableData = initializedData.concat(this.tableData);
    },
    // 检查扩展字段配置
    checkConfig() {
      // 过滤掉表格末尾未填写的行
      let filteredTableData = [];
      let theLastIndex = -1;
      this.tableData.forEach((item, index) => {
        const { required, key, enumerable, enumValue } = item;
        const condition = required || key || enumerable || enumValue;
        if (condition) theLastIndex = index;
      });
      if (theLastIndex > -1) {
        filteredTableData = this.tableData.slice(0, theLastIndex + 1);
      } else {
        // this.$message.error("请至少填写一个扩展字段！");
        // return;
      }
      // 至少一个必填字段
      // if (!filteredTableData.some((item) => item.required === 1)) {
      //   this.$message.error("扩展字段中必须包含一个必填字段！");
      //   return;
      // }
      // 依次填写扩展字段不得空行
      if (
        filteredTableData.some((item, index) => {
          if (!index) return;
          const { required, key, enumerable, enumValue } = item;
          const condition = required || key || enumerable || enumValue;
          const lastItem = filteredTableData[index - 1];
          const lastCondition =
            lastItem.required ||
            lastItem.key ||
            lastItem.enumerable ||
            lastItem.enumValue;
          if (condition && !lastCondition) return true;
        })
      ) {
        this.$message.error("请依次填写扩展字段！");
        return;
      }
      // 字段名称校验
      if (
        filteredTableData.some((item, index) => {
          const { key } = item;
          const maxlength = 10;
          if (!key) {
            this.$message.error("请填写字段名称！");
            return true;
          } else if (key.length > maxlength) {
            this.$message.error(
              `请检查字段序号${
                index + 1
              }的字段名称，最多可输入${maxlength}个字符！`
            );
            return true;
          } else if (!regExp.zhEngNumUnder.test(key)) {
            this.$message.error(
              `请检查字段序号${
                index + 1
              }的字段名称，只能包含中文、英文字母、数字、下划线！`
            );
            return true;
          }
        })
      ) {
        return;
      }
      // 枚举值校验
      if (
        filteredTableData.some((item, index) => {
          const { enumerable, enumValue } = item;
          const maxlength = 500;
          if (enumerable && !enumValue) {
            this.$message.error("枚举类型字段的枚举值不允许为空");
            return true;
          }
          if (enumValue.length > maxlength) {
            this.$message.error(
              `请检查字段序号${
                index + 1
              }的枚举值，最多可输入${maxlength}个字符！`
            );
            return true;
          }
          if (enumValue) {
            if (!regExp.enumValue.test(enumValue)) {
              this.$message.error(
                `请检查字段序号${
                  index + 1
                }的枚举值，格式应为"值内容:值"，枚举值间以英文逗号分隔，值内容、值以英文冒号分隔，并只能包含中文、英文字母、数字、下划线！`
              );
              return true;
            }
            if (enumValue.indexOf(",") > -1) {
              const keys = [];
              const values = [];
              return enumValue.split(",").some((valueKeyItem) => {
                const [value, key] = valueKeyItem.split(":");
                if (keys.includes(key)) {
                  this.$message.error(
                    `请检查字段序号${index + 1}的枚举值，值${key}当前不唯一！`
                  );
                  return true;
                } else if (values.includes(value)) {
                  this.$message.error(
                    `请检查字段序号${
                      index + 1
                    }的枚举值，值内容${key}当前不唯一！`
                  );
                  return true;
                } else {
                  keys.push(key);
                  values.push(value);
                }
              });
            }
          }
        })
      ) {
        return;
      }
      // 提交前重构扩展字段配置
      return filteredTableData.map((item) => {
        const { required, key, enumValue } = item;
        return { required, key, enumValue };
      });
    },
    // 提交保存扩展字段配置
    async submitExtensionFieldData() {
      const checkedData = this.checkConfig();
      if (checkedData) {
        await this.saveConfig(checkedData);
        this.$message.success("保存成功！");
        this.dialogVisible = false;
        this.$emit("update:afterSubmitExtensionFieldData");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.extension-field-dialog {
  .content-wrapper {
    max-height: 50vh;
    overflow: auto;
  }
}
</style>