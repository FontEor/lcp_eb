<template>
  <div class="document-form">
    <el-form
      v-if="editable"
      :model="editedFormData"
      :rules="editedFormRules"
      label-width="100px"
      ref="editedForm"
      class="document-form__edited-form"
    >
      <el-form-item
        v-for="{ label, prop, placeholder } in formItemList"
        :key="prop"
        :label="label"
        :prop="prop"
      >
        <template v-if="['name'].includes(prop)">
          <p style="width: 50%">
            {{ editedFormData[prop] }}
          </p>
        </template>
        <template v-else-if="['chineseName'].includes(prop)">
          <el-input
            v-model.trim="editedFormData[prop]"
            :placeholder="placeholder"
            style="width: 50%"
          />
        </template>
        <template v-else-if="['descr'].includes(prop)">
          <el-input
            v-model="editedFormData[prop]"
            :placeholder="placeholder"
            type="textarea"
            resize="vertical"
            style="width: 50%"
          />
        </template>
        <template v-else-if="['messageCategoryCode'].includes(prop)">
          <span slot="label">
            所属分类
            <el-tooltip
              class="item"
              effect="dark"
              content="创建消息分类，便于使用方在消息文档中根据分类快速找到目标消息。"
              placement="top"
            >
              <i class="el-icon-help"></i>
            </el-tooltip>
          </span>
          <el-select
            v-model="editedFormData[prop]"
            placeholder="请选择所属分类"
            style="width: 50%"
          >
            <el-option
              v-for="item in categoryOptionList"
              :key="item.id"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
          <el-button
            type="text"
            style="margin-left: 12px"
            @click="$emit('update:classificationDialogVisible', true)"
            >管理分类</el-button
          >
        </template>
      </el-form-item>
    </el-form>

    <el-form
      v-else
      :model="formData"
      label-width="80px"
      class="document-form__form"
    >
      <el-form-item
        v-for="{ label, prop } in formItemList"
        :key="prop"
        :label="label"
        :prop="prop"
        style="margin-bottom: 8px"
      >
        <p style="width: 50%; white-space: pre-wrap">
          {{
            ["messageCategoryCode"].includes(prop)
              ? formatMessageCategoryName(formData[prop])
              : formData[prop]
          }}
        </p>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "DocumentForm",
  props: {
    editable: { type: Boolean, required: true },
    formData: { type: Object, required: true },
    editedFormData: { type: Object, required: true },
    categoryOptionList: { type: Array, required: true },
  },
  data() {
    return {
      formItemList: [
        {
          label: "中文名称",
          prop: "chineseName",
          placeholder: "请输入中文名称",
        },
        { label: "描述", prop: "descr", placeholder: "请输入描述" },
        { label: "所属分类", prop: "messageCategoryCode" },
      ],
      editedFormRules: {
        chineseName: [
          { required: true, message: "请输入中文名称" },
          { max: 30, message: "长度至多为 30 个字符" },
          {
            pattern: /^[\u4e00-\u9fa5A-z0-9\-_]*$/,
            message: "仅支持输入中文、英文、数字、“-”和下划线",
          },
        ],
        descr: [
          { required: true, message: "请输入描述" },
          { min: 5, max: 500, message: "长度在 5 到 500 个字符" },
        ],
        messageCategoryCode: [{ required: true, message: "请选择所属分类" }],
      },
    };
  },
  watch: {
    editable: {
      handler(value) {
        if (value) {
          const { formData } = this;
          const editedFormData = JSON.parse(JSON.stringify(formData));
          this.$emit("update:editedFormData", editedFormData);
        } else {
          const editedFormData = {
            name: "",
            chineseName: "",
            descr: "",
            messageCategoryCode: "default",
          };
          this.$emit("update:editedFormData", editedFormData);
        }
      },
    },
  },
  methods: {
    async validate() {
      return await this.$refs["editedForm"].validate();
    },
    formatMessageCategoryName(messageCategoryCode) {
      let name = "";
      if (this.categoryOptionList.length > 0) {
        const item = this.categoryOptionList.find(
          ({ code }) => code === messageCategoryCode
        );
        if (item && item.name) {
          name = item.name;
        }
      }
      return name;
    },
  },
};
</script>

<style lang="scss" scoped>
// .document-form {
// }
</style>