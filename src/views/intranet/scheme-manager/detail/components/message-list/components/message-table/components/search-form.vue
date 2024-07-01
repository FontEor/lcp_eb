<template>
  <el-form :model="formData" class="search-form" @submit.native.prevent>
    <el-row :gutter="8" style="display: flex; flex-wrap: wrap">
      <el-col :span="8">
        <el-form-item prop="queryLike">
          <el-input
            v-model="formData.queryLike"
            :clearable="true"
            placeholder="请输入TOPIC/名称以搜索"
            style="width: 100%"
            @keyup.native.enter="$emit('keyupEnterLeftInput')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="$emit('clickLeftButton')"
            >查询</el-button
          >
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <div class="search-form__right-button-wrapper">
          <el-button type="primary" @click="$emit('clickRightButton')"
            >添加消息</el-button
          >
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  name: "SearchForm",
  props: {
    formData: {
      type: Object,
      default: () => {
        const queryLike = "";
        return { queryLike };
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.search-form {
  .search-form__right-button-wrapper {
    display: flex;
    justify-content: flex-end;
  }
}
</style>