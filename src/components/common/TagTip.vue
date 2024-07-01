<template>
  <!-- 顶部tag信息 可参见消息列表页面 -->
  <div class="tagTip">
    <el-tag
      v-for="(tag, index) in tagList"
      :key="index"
      :closable="closable"
      :disable-transitions="true"
      type="info"
      class="tagTip__tag"
      @close="handleCloseTag(tag)"
    >
      <p class="tagTip__content">
        <i class="el-icon-info"></i>&nbsp;
        <slot>{{ text }}</slot>
      </p>
    </el-tag>
  </div>
</template>

<script>
export default {
  name: "TagTip",
  props: {
    text: {
      type: String,
      default: "",
    },
    closable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      tagList: ["tag"],
    };
  },
  methods: {
    handleCloseTag(tag) {
      this.tagList.splice(this.tagList.indexOf(tag), 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.tagTip {
  .tagTip__tag {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-size: small;
    border-color: #f5f5f5;
    .tagTip__content {
      color: #999;
    }
  }
}
</style>