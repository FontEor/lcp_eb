<template>
  <el-row class="search-form" type="flex" justify="space-between" tag="section">
    <el-form
      class="search-form__left-form"
      :model="searchFormData"
      :inline="true"
      @keyup.enter.native="$emit('keyupEnter')"
    >
      <el-form-item>
        <el-input
          v-model="searchFormData.subject"
          :clearable="true"
          placeholder="请输入申请主题"
          style="width: 320px"
        />
      </el-form-item>
      <el-form-item label="申请状态">
        <el-select v-model="searchFormData.status" style="width: 160px">
          <el-option
            v-for="{ label, value } in statusOptionList"
            :key="value"
            :label="label"
            :value="value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="$emit('keyupEnter')"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>
    <div class="search-form__right-container">
      <slot />
    </div>
  </el-row>
</template>

<script>
export default {
  name: "SearchForm",
  props: {
    searchFormData: { type: Object, required: true },
  },
  data() {
    return {
      statusOptionList: [
        { label: "-", value: null },
        { label: "审核中", value: 1 },
        { label: "通过", value: 2 },
        { label: "驳回", value: 3 },
        { label: "已取消", value: 4 },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.search-form {
}
</style>